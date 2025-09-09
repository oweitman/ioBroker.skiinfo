const { expect } = require('chai');
const sinon = require('sinon');
const cheerio = require('cheerio');

const SkiRegion = require('../../lib/ski/SkiRegion');
const SkiArea = require('../../lib/ski/SkiArea');
const SkiConfig = require('../../lib/ski/SkiConfig');

/*
 * Tests for the SkiRegion class.  The region parses its code, name and
 * URL from an anchor element.  The parseAreas method adds new SkiArea
 * instances to the owning country or associates the region with existing
 * areas by code.  getAreas filters the country's areas based on the
 * region code.  The getObject method returns a JSON friendly representation.
 */

describe('SkiRegion', () => {
    it('parse extracts code, name and url from link', () => {
        const country = {}; // dummy country not used here
        const region = new SkiRegion(country);
        const html = `<a href="/region1/sch">Region One</a>`;
        region.parse(html);
        expect(region.code).to.equal('region1');
        expect(region.name).to.equal('Region One');
        expect(region.url).to.equal(SkiConfig.baseurl + '/region1/sch');
    });

    it('parseAreas adds new areas to country when not already present', () => {
        // Setup a country with no areas and a stubbed getAreaByCode
        const country = {
            util: { request: sinon.stub() },
            areas: [],
            getAreaByCode: sinon.stub().returns(null),
        };
        const region = new SkiRegion(country);
        region.code = 'reg1';
        // Provide a table with class snow so that parseAreas selects rows
        const html = `
        <table class="snow">
            <tr class="tr0">
                <td><a href="/area1/sch">Area One</a></td>
                <td>10</td><td>20</td><td>5</td><td>1/2</td><td data-value="2024-01-01"></td>
            </tr>
        </table>
        `;
        region.parseAreas(html);
        // Should add one new area to country
        expect(country.areas.length).to.equal(1);
        const area = country.areas[0];
        expect(area.code).to.equal('area1');
        // Region's areas property stores just codes
        expect(region.areas).to.deep.equal(['area1']);
        // Newly created area should have region set to the region code
        expect(area.region).to.equal('reg1');
    });

    it('parseAreas associates region with existing area rather than adding duplicate', () => {
        // Pre-create an existing area in the country
        const existingArea = new SkiArea(null);
        existingArea.code = 'area2';
        existingArea.region = null;
        const country = {
            util: { request: sinon.stub() },
            areas: [ existingArea ],
            getAreaByCode: sinon.stub().withArgs('area2').returns(existingArea),
        };
        const region = new SkiRegion(country);
        region.code = 'reg2';
        // Provide a table with class snow
        const html = `
        <table class="snow">
            <tr class="tr0"><td><a href="/area2/sch">Area Two</a></td><td>0</td><td>0</td><td>0</td><td>0/0</td><td data-value="2024-01-01"></td></tr>
        </table>
        `;
        region.parseAreas(html);
        // Country areas length should remain 1
        expect(country.areas.length).to.equal(1);
        // Region areas should contain only code
        expect(region.areas).to.deep.equal(['area2']);
        // Existing area should now have region set
        expect(existingArea.region).to.equal('reg2');
    });

    it('getAreas filters country areas by region', () => {
        const area1 = new SkiArea(null);
        area1.code = 'a1'; area1.region = 'r';
        const area2 = new SkiArea(null);
        area2.code = 'a2'; area2.region = 'r';
        const area3 = new SkiArea(null);
        area3.code = 'a3'; area3.region = 'other';
        const country = { areas: [area1, area2, area3] };
        const region = new SkiRegion(country);
        region.code = 'r';
        const result = region.getAreas();
        expect(result).to.deep.equal([area1, area2]);
    });

    it('getObject returns an object with country and loaded flags', () => {
        const region = new SkiRegion({});
        region.name = 'Region';
        region.code = 'reg';
        region.url = SkiConfig.baseurl + '/reg/sch';
        region.loaded = true;
        const obj = region.getObject('countryCode');
        expect(obj).to.deep.equal({
            name: 'Region',
            code: 'reg',
            url: SkiConfig.baseurl + '/reg/sch',
            country: 'countryCode',
            loaded: true,
        });
    });
});