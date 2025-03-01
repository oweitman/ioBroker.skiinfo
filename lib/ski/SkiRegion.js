const cheerio = require('cheerio');
const SkiConfig = require('./SkiConfig');
const SkiArea = require('./SkiArea');
module.exports = class SkiRegion {
    /**
     * Creates a new instance of the SkiRegion class.
     *
     * @param country - The country where the region is located.
     *
     * The constructor sets the country property to the given country and
     * initializes the name, code, url, areas and loaded properties to their
     * defaults.
     */
    constructor(country) {
        this.country = country;
        this.name = null;
        this.code = null;
        this.url = null;
        this.areas = [];
        this.loaded = false;
    }
    /**
     * Parses the given HTML element and extracts the region's details.
     *
     * This function sets the region's code, name, and URL.
     *
     * @param el - The HTML element to parse.
     */
    parse(el) {
        const regex = /\/(.+)\/sch/;
        const $ = cheerio.load(el);
        let href = $(el).attr('href');
        if (href) {
            let code = href.match(regex);
            this.code = (code && code[1]) || null;
        }

        this.name = $(el).text();
        this.url = SkiConfig.baseurl + $(el).attr('href');
    }
    /**
     * Loads the region data if it was not already loaded.
     *
     * If the region's URL is set, the function requests the HTML from the
     * specified URL, parses the areas and sets the loaded property to true.
     *
     * @returns A promise that resolves when the loading and parsing of the
     *          region data is complete.
     */
    async load() {
        let html = await this.country.util.request(this.url);
        this.parseAreas(html);
        this.loaded = true;
    }
    /**
     * Parses the given HTML and extracts the region's areas.
     *
     * This function parses individual elements that match the '.snow .tr0' and '.snow .tr1'
     * selectors within the provided HTML. For each element, it creates a new SkiArea
     * object, parses it, and adds it to the region's areas array and the country's areas
     * array. If the area is already known by the country, it just sets the region for
     * that area.
     *
     * @param html - The HTML to parse.
     */
    parseAreas(html) {
        const $ = cheerio.load(html);
        let elAreas = $('.snow .tr0,.snow .tr1');
        this.areas = [];
        for (let i = 0; i < elAreas.length; i++) {
            let bfa = new SkiArea(undefined);
            bfa.parse(elAreas[i]);
            let area = this.country.getAreaByCode(bfa.code);
            if (area == null) {
                bfa.setRegion(this.code);
                this.country.areas.push(bfa);
            } else {
                area.setRegion(this.code);
            }
            this.areas.push(bfa.code);
        }
    }
    /**
     * Returns an array of all the ski areas of this region.
     *
     * @returns An array of SkiArea objects.
     */
    getAreas() {
        return this.country.areas.filter(area => area.region == this.code);
    }
    /**
     * Returns an object representation of the region with various details.
     *
     * @param country - The code of the country this region belongs to.
     * @returns An object containing the region's properties, including:
     *                   - name: The name of the region.
     *                   - code: The unique code of the region.
     *                   - url: The URL to the region's page.
     *                   - country: The code of the country.
     *                   - loaded: Boolean indicating if the region has been loaded.
     */
    getObject(country) {
        return {
            name: this.name,
            code: this.code,
            url: this.url,
            country: country,
            loaded: this.loaded,
        };
    }
};
