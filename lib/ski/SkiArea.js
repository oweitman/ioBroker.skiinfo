const cheerio = require('cheerio');
const SkiConfig = require('./SkiConfig');
module.exports = class SkiArea {
    constructor(country) {
        this.country = country;
        this.region = null;
        this.isFavorite = false;
    }
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
    setRegion(region) {
        this.region = region;
    }
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
