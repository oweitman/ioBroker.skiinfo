const { expect } = require('chai');
const sinon = require('sinon');

const SkiCountryList = require('../../lib/ski/SkiCountryList');
const SkiCountry = require('../../lib/ski/SkiCountry');

/*
 * Tests for the SkiCountryList class.  The country list manages a collection
 * of SkiCountry instances.  These tests verify the basic lookup and helper
 * functions without performing any network operations.
 */

describe('SkiCountryList', () => {
    it('getCountries returns all countries', () => {
        const util = {}; // dummy util not used here
        const list = new SkiCountryList(util);
        const c1 = new SkiCountry(util);
        c1.name = 'Germany'; c1.code = 'de';
        const c2 = new SkiCountry(util);
        c2.name = 'Austria'; c2.code = 'at';
        list.countries = [c1, c2];
        expect(list.getCountries()).to.deep.equal([c1, c2]);
    });

    it('getCountryByName and getCountryByCode return the matching country', () => {
        const util = {};
        const list = new SkiCountryList(util);
        const c1 = new SkiCountry(util);
        c1.name = 'Switzerland'; c1.code = 'ch';
        list.countries = [c1];
        expect(list.getCountryByName('Switzerland')).to.equal(c1);
        expect(list.getCountryByCode('ch')).to.equal(c1);
        expect(list.getCountryByName('Unknown')).to.be.undefined;
    });

    it('getObject returns an array of country objects', () => {
        const util = {};
        const list = new SkiCountryList(util);
        const c1 = new SkiCountry(util);
        sinon.stub(c1, 'getObject').returns({ name: 'n1' });
        const c2 = new SkiCountry(util);
        sinon.stub(c2, 'getObject').returns({ name: 'n2' });
        list.countries = [c1, c2];
        expect(list.getObject()).to.deep.equal([ { name: 'n1' }, { name: 'n2' } ]);
    });

    it('getCountriesOfFavorties returns only countries with favorite areas', () => {
        const util = {};
        const list = new SkiCountryList(util);
        const c1 = new SkiCountry(util);
        sinon.stub(c1, 'containFavoriteAreas').returns(true);
        const c2 = new SkiCountry(util);
        sinon.stub(c2, 'containFavoriteAreas').returns(false);
        list.countries = [c1, c2];
        expect(list.getCountriesOfFavorties()).to.deep.equal([c1]);
    });
});