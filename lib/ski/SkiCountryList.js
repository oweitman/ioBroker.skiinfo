const cheerio = require('cheerio');
const SkiConfig = require('./SkiConfig');
const SkiCountry = require('./SkiCountry');

module.exports = class BerfexCountryList {
    countries = [];

    constructor(util) {
        this.config = new SkiConfig();
        this.util = util;
    }
    async load() {
        let url = `${SkiConfig.baseurl}/schweiz/schneewerte/`;
        let html = await this.util.request(url);
        await this.parse(html);
    }
    async parse(html) {
        /*         const regex = /\/(.+)\/sch/; */
        const $ = cheerio.load(html);
        let elCountries = $('.regions-col-1 li a');
        elCountries.map((i, el) => {
            let bfc = new SkiCountry(this.util);
            bfc.parseCountry(el);
            this.countries.push(bfc);
        });
        let curCountryText = $('h1.tw-text-4xl span:not([class])').text().trim();
        let curCountry = this.getCountryByName(curCountryText);
        await curCountry.load();
    }
    getCountries() {
        return this.countries;
    }
    getCountryByName(name) {
        return this.countries.find(el => el.name == name);
    }
    getCountryByCode(code) {
        return this.countries.find(el => el.code == code);
    }
    getObject() {
        return this.countries.map(country => country.getObject());
    }
    getCountriesOfFavorties() {
        return this.countries.filter(country => country.containFavoriteAreas());
    }
};
