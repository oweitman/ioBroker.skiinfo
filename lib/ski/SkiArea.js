const cheerio = require('cheerio');
const SkiConfig = require('./SkiConfig');
module.exports = class SkiArea {
    /**
     * Create a new instance of the SkiArea class.
     *
     * @param country - The country where the area is located.
     *
     * This constructor sets the country and region properties of the new instance.
     * The region is set to null, and the isFavorite property is set to false.
     */
    constructor(country) {
        this.country = country;
        this.region = null;
        this.isFavorite = false;
    }
    /**
     * Parse the given HTML element and extract the area's details.
     *
     * @param el - The HTML element to parse.
     *
     * This function sets the area's code, name, url, snow depths (valley and mountain),
     * fresh snow, open and all lifts, and the last update time.
     *
     * If the country has regions, the function tries to find the region that the area
     * belongs to and sets the area's region property accordingly.
     */
    parse(el) {
        const regex = /\/(.+)\/sch/;
        const $ = cheerio.load(el);
        let elCol1 = $('td a');
        let href = $(elCol1).attr('href');
        if (href) {
            let code = href.match(regex);
            this.code = (code && code[1]) || null;
        }
        this.name = $(elCol1).text();

        this.url = SkiConfig.baseurl + $(elCol1).attr('href');
        this.snowValley = parseInt($('td:nth-child(2)').text().replace(/\D/g, '') || '0');
        this.snowMountain = parseInt($('td:nth-child(3)').text().replace(/\D/g, '') || '0');
        this.freshSnow = parseInt($('td:nth-child(4)').text().replace(/\D/g, '') || '0');
        let lifts =
            $('td:nth-child(5)')
                .text()
                .replace(/[^\d/]/g, '') || '0/0';
        this.liftsOpen = parseInt(lifts.split('/')[0] || '0');
        this.liftsAll = parseInt(lifts.split('/')[1] || '0');
        this.lastUpdate = $('td:nth-child(6)').attr('data-value');

        if (this.country?.regions) {
            for (let region of this.country.regions) {
                if (region.areas.includes(this.code)) {
                    this.region = region.code;
                    break;
                }
            }
        }
    }
    /**
     * Sets the region code for this area.
     *
     * @param region - The code of the region to associate with this area.
     */
    setRegion(region) {
        this.region = region;
    }
    /**
     * Returns an object representation of the ski area with various details.
     *
     * @param country - The code of the country this ski area belongs to.
     * @returns An object containing the ski area's properties, including:
     *                   - name: The name of the ski area.
     *                   - code: The unique code of the ski area.
     *                   - url: The URL to the ski area's page.
     *                   - isFavorite: Boolean indicating if this area is a favorite.
     *                   - country: The code of the country.
     *                   - region: The code of the region, or null if not set.
     *                   - snowValley: Snow depth in the valley.
     *                   - snowMountain: Snow depth on the mountain.
     *                   - freshSnow: Amount of fresh snow.
     *                   - liftsOpen: Number of lifts currently open.
     *                   - liftsAll: Total number of lifts.
     *                   - lastUpdate: The last update timestamp.
     */
    getObject(country) {
        return {
            name: this.name,
            code: this.code,
            url: this.url,
            isFavorite: this.isFavorite,
            country: country,
            region: this.region ?? null,
            snowValley: this.snowValley,
            snowMountain: this.snowMountain,
            freshSnow: this.freshSnow,
            liftsOpen: this.liftsOpen,
            liftsAll: this.liftsAll,
            lastUpdate: this.lastUpdate,
        };
    }
};
