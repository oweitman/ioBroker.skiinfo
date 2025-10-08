const cheerio = require('cheerio');
const SkiConfig = require('./SkiConfig');
const SkiRegion = require('./SkiRegion');
const SkiArea = require('./SkiArea');
module.exports = class SkiCountry {
    /**
     * Create a new instance of the SkiCountry class.
     *
     * @param util - The SkiUtil instance used for utility functions.
     *
     * The constructor initializes the SkiCountry instance by setting up the
     * util property and the state properties, which are name, code, url,
     * regions, areas and loaded.
     */
    constructor(util) {
        this.util = util;
        this.name = null;
        this.code = null;
        this.url = null;
        this.regions = [];
        this.areas = [];
        this.loaded = false;
    }
    /**
     * Parse the given HTML element and extract the country's details.
     *
     * @param el - The HTML element to parse.
     *
     * This function sets the country's code, name, and URL.
     */
    parseCountry(el) {
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
     * Parse the given HTML and extract the country's regions.
     *
     * @param html - The HTML to parse.
     *
     * This function sets the country's regions property with an array of SkiRegion
     * objects. The function only parses the first region and loads its data.
     * The other regions are created but their data is not loaded yet.
     */
    async parseRegions(html) {
        this.regions = [];
        const $ = cheerio.load(html);
        let elRegions = $('.regions-col-2 li a');
        for (let i = 0; i < elRegions.length; i++) {
            let bfr = new SkiRegion(this);
            bfr.parse(elRegions[i]);
            if (i == 0) {
                await bfr.load();
            }
            this.regions.push(bfr);
        }
    }
    /**
     * Parse the given HTML and extract the ski area's details.
     *
     * @param html - The HTML to parse.
     *
     * This function initializes the areas array and populates it with SkiArea
     * objects by parsing the specified HTML. Each SkiArea object is created
     * by parsing individual elements that match the '.snow .tr0' and '.snow .tr1'
     * selectors within the provided HTML. The function does not load additional
     * data for each area at this stage.
     */
    parseAreas(html) {
        this.areas = [];
        const $ = cheerio.load(html);
        let elAreas = $('.snow .tr0,.snow .tr1');
        for (let i = 0; i < elAreas.length; i++) {
            //elAreas.map((i, el) => {
            let bfa = new SkiArea(this);
            bfa.parse(elAreas[i]);
            this.areas.push(bfa);
            //});
        }
    }
    /**
     * Loads the country data if it was not already loaded.
     *
     * If the country's URL is set, the function requests the HTML from the
     * specified URL, parses the regions and areas, and sets the loaded property
     * to true.
     */
    async load() {
        if (this.url) {
            let html = await this.util.request(this.url);
            await this.parseRegions(html);
            this.parseAreas(html);
            this.loaded = true;
        }
    }
    /**
     * Returns an array of all the regions of this country.
     *
     * @returns The array of SkiRegion objects.
     */
    getRegions() {
        return this.regions;
    }
    /**
     * Retrieves a region by its name.
     *
     * @param name - The name of the region to find.
     * @returns The SkiRegion object with the matching name, or undefined if not found.
     */
    getRegionByName(name) {
        return this.regions.find(el => el.name == name);
    }
    /**
     * Retrieves a region by its code.
     *
     * @param code - The code of the region to find.
     * @returns The SkiRegion object with the matching code, or undefined if not found.
     */
    getRegionByCode(code) {
        return this.regions.find(el => el.code == code);
    }
    /**
     * Returns an array of all the ski areas of this country.
     *
     * @returns The array of SkiArea objects.
     */
    getAreas() {
        return this.areas;
    }
    /**
     * Retrieves a ski area by its name.
     *
     * @param name - The name of the ski area to find.
     * @returns The SkiArea object with the matching name, or undefined if not found.
     */
    getAreaByName(name) {
        return this.areas.find(el => el.name == name);
    }
    /**
     * Retrieves a ski area by its code.
     *
     * @param code - The code of the ski area to find.
     * @returns The SkiArea object with the matching code, or undefined if not found.
     */
    getAreaByCode(code) {
        return this.areas.find(el => el.code == code);
    }
    /**
     * Returns an object representation of the country with various details.
     *
     * @returns An object containing the country's properties, including:
     *                   - name: The name of the country.
     *                   - code: The unique code of the country.
     *                   - url: The URL to the country's page.
     *                   - regions: An array of SkiRegion objects.
     *                   - areas: An array of SkiArea objects.
     *                   - loaded: Boolean indicating if the country has been loaded.
     */
    getObject() {
        return {
            name: this.name,
            code: this.code,
            url: this.url,
            regions: this.regions.map(region => region.getObject(this.code)),
            areas: this.areas.map(area => area.getObject(this.code)),
            loaded: this.loaded,
        };
    }
    /**
     * Returns true if any ski area of this country is a favorite.
     *
     * @returns Boolean indicating if the country contains any favorite ski areas.
     */
    containFavoriteAreas() {
        return this.areas.some(area => area.isFavorite);
    }
};
