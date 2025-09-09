const { expect } = require('chai');
const sinon = require('sinon');
const cheerio = require('cheerio');

const SkiCountry = require('../../lib/ski/SkiCountry');
const SkiRegion = require('../../lib/ski/SkiRegion');
const SkiArea = require('../../lib/ski/SkiArea');
const SkiConfig = require('../../lib/ski/SkiConfig');

/*
 * Tests for the SkiCountry class.  The country is responsible for
 * parsing its identifying information, loading regions and areas and
 * providing various lookup and helper functions.  To simplify testing of
 * asynchronous region loading the SkiRegion.prototype.load method is stubbed.
 */

describe('SkiCountry', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('parseCountry extracts code, name and url', () => {
        const country = new SkiCountry({});
        const html = `<a href="/deutschland/sch">Deutschland</a>`;
        country.parseCountry(html);
        expect(country.code).to.equal('deutschland');
        expect(country.name).to.equal('Deutschland');
        expect(country.url).to.equal(SkiConfig.baseurl + '/deutschland/sch');
    });

    it('parseAreas populates areas array with SkiArea instances', () => {
        const country = new SkiCountry({});
        // parseAreas looks for elements matching `.snow .tr0` and `.snow .tr1`
        // Provide a full table with class="snow" so that query selects rows
        const html = `
        <table class="snow">
            <tr class="tr0">
                <td><a href="/area1/sch">Area One</a></td><td>0</td><td>0</td><td>0</td><td>0/0</td><td data-value="2024-01-01"></td>
            </tr>
            <tr class="tr1">
                <td><a href="/area2/sch">Area Two</a></td><td>0</td><td>0</td><td>0</td><td>0/0</td><td data-value="2024-01-01"></td>
            </tr>
        </table>
        `;
        country.parseAreas(html);
        expect(country.areas.length).to.equal(2);
        expect(country.getAreaByCode('area1')).to.be.an.instanceof(SkiArea);
        expect(country.getAreaByCode('area2')).to.be.an.instanceof(SkiArea);
    });

    it('parseRegions creates SkiRegion objects and loads the first region', async () => {
        // Stub SkiRegion.load so that it does not perform network
        const loadStub = sinon.stub(SkiRegion.prototype, 'load').resolves();
        const country = new SkiCountry({});
        const html = `
            <ul class="regions-col-2">
                <li><a href="/region1/sch">Region1</a></li>
                <li><a href="/region2/sch">Region2</a></li>
            </ul>
        `;
        await country.parseRegions(html);
        expect(country.regions.length).to.equal(2);
        // First region should have been loaded
        expect(loadStub.calledOnce).to.be.true;
    });

    it('load requests html and parses regions and areas, setting loaded flag', async () => {
        // Ensure the country has a URL defined so that load() will perform a request
        const country = new SkiCountry({ request: sinon.stub().resolves('<html></html>') });
        country.url = 'http://example.com';
        // Stub parseRegions and parseAreas to monitor invocation
        const pr = sinon.stub(country, 'parseRegions').resolves();
        const pa = sinon.stub(country, 'parseAreas');
        await country.load();
        expect(country.util.request.calledOnceWithExactly(country.url)).to.be.true;
        expect(pr.calledOnce).to.be.true;
        expect(pa.calledOnce).to.be.true;
        expect(country.loaded).to.be.true;
    });

    it('getRegionByName and getRegionByCode return correct region', () => {
        const country = new SkiCountry({});
        const regionA = new SkiRegion(country);
        regionA.name = 'Tirol';
        regionA.code = 'tirol';
        const regionB = new SkiRegion(country);
        regionB.name = 'Graubunden';
        regionB.code = 'graub';
        country.regions = [regionA, regionB];
        expect(country.getRegionByName('Tirol')).to.equal(regionA);
        expect(country.getRegionByCode('graub')).to.equal(regionB);
        expect(country.getRegionByName('Unknown')).to.be.undefined;
    });

    it('getAreaByName and getAreaByCode return correct area', () => {
        const country = new SkiCountry({});
        const area1 = new SkiArea(country);
        area1.name = 'Area1';
        area1.code = 'a1';
        const area2 = new SkiArea(country);
        area2.name = 'Area2';
        area2.code = 'a2';
        country.areas = [area1, area2];
        expect(country.getAreaByName('Area1')).to.equal(area1);
        expect(country.getAreaByCode('a2')).to.equal(area2);
        expect(country.getAreaByCode('unknown')).to.be.undefined;
    });

    it('getObject returns combined object of country, regions and areas', () => {
        const country = new SkiCountry({});
        country.name = 'Austria';
        country.code = 'at';
        country.url = SkiConfig.baseurl + '/austria/sch';
        country.loaded = true;
        // Provide stubbed region and area objects that return custom getObject
        const region = new SkiRegion(country);
        sinon.stub(region, 'getObject').callsFake(() => ({ region: true }));
        const area = new SkiArea(country);
        sinon.stub(area, 'getObject').callsFake(() => ({ area: true }));
        country.regions = [region];
        country.areas = [area];
        const obj = country.getObject();
        expect(obj).to.deep.equal({
            name: 'Austria',
            code: 'at',
            url: SkiConfig.baseurl + '/austria/sch',
            regions: [ { region: true } ],
            areas: [ { area: true } ],
            loaded: true,
        });
    });

    it('containFavoriteAreas returns true if any area is favorite', () => {
        const country = new SkiCountry({});
        const area1 = new SkiArea(country);
        area1.isFavorite = false;
        const area2 = new SkiArea(country);
        area2.isFavorite = true;
        country.areas = [area1, area2];
        expect(country.containFavoriteAreas()).to.be.true;
        // when no favorite
        area2.isFavorite = false;
        expect(country.containFavoriteAreas()).to.be.false;
    });
});