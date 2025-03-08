const cheerio = require('cheerio');
const SkiConfig = require('./SkiConfig');
const SkiCountry = require('./SkiCountry');

module.exports = class SkiCountryList {
    countries = [];

    /**
     * The constructor for the class.
     *
     * @param util - An instance of the SkiUtil class, used for
     *                         making web requests.
     */
    constructor(util) {
        this.config = new SkiConfig();
        this.util = util;
    }
    /**
     * Loads the list of countries from the bergfex.ch website.
     *
     * This function requests the HTML from the bergfex.ch website and then
     * calls the parse method to extract the country data from the HTML.
     *
     * @returns A promise that resolves when the loading and parsing of the
     *          country data is complete.
     */
    async load() {
        let url = `${SkiConfig.baseurl}/schweiz/schneewerte/`;
        let html = await this.util.request(url);
        await this.parse(html);
    }
    /**
     * Parses the HTML and extracts the country data.
     *
     * This function takes the HTML string and parses it using the cheerio library.
     * It then extracts the country data from the HTML and stores it in the
     * countries array.
     *
     * @param html - The HTML string to parse.
     * @returns A promise that resolves when the parsing is complete.
     */
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
    /**
     * Returns the list of countries.
     *
     * @returns An array of SkiCountry objects, each one representing a country.
     */
    getCountries() {
        return this.countries;
    }
    /**
     * Finds a country by its name.
     *
     * @param name - The name of the country to find.
     * @returns The SkiCountry object with the matching name, or undefined if not found.
     */
    getCountryByName(name) {
        return this.countries.find(el => el.name == name);
    }
    /**
     * Finds a country by its code.
     *
     * @param code - The code of the country to find.
     * @returns The SkiCountry object with the matching code, or undefined if not found.
     */
    getCountryByCode(code) {
        return this.countries.find(el => el.code == code);
    }
    /**
     * Returns an object representation of the country list with various details.
     *
     * @returns An array of objects, each one representing a country, with the following properties:
     *                   - name: The name of the country.
     *                   - code: The unique code of the country.
     *                   - url: The URL to the country's page.
     *                   - regions: An array of SkiRegion objects.
     *                   - areas: An array of SkiArea objects.
     *                   - loaded: Boolean indicating if the country has been loaded.
     */
    getObject() {
        return this.countries.map(country => country.getObject());
    }
    /**
     * Returns an array of countries that contain at least one favorite ski area.
     *
     * @returns An array of SkiCountry objects, each one representing a country
     *          that contains at least one favorite ski area.
     */
    getCountriesOfFavorties() {
        return this.countries.filter(country => country.containFavoriteAreas());
    }
};
