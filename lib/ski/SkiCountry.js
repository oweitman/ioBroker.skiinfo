const cheerio = require('cheerio');
const SkiConfig = require('./SkiConfig');
const SkiRegion = require('./SkiRegion');
const SkiArea = require('./SkiArea');
module.exports = class SkiCountry {
    constructor(util) {
        this.util = util;
        this.name = null;
        this.code = null;
        this.url = null;
        this.regions = [];
        this.areas = [];
        this.loaded = false;
    }
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
    async parseRegions(html) {
        this.regions = [];
        const $ = cheerio.load(html);
        let elRegions = $('.regions-col-2 li a');
        //elRegions.map(async (i, el) => {
        for (let i = 0; i < elRegions.length; i++) {
            let bfr = new SkiRegion(this);
            bfr.parse(elRegions[i]);
            if (i == 0) {
                await bfr.load();
            }
            this.regions.push(bfr);
        }
        //});
    }
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
    async load() {
        if (this.url) {
            let html = await this.util.request(this.url);
            await this.parseRegions(html);
            this.parseAreas(html);
            this.loaded = true;
        }
    }
    getRegions() {
        return this.regions;
    }
    getRegionByName(name) {
        return this.regions.find(el => el.name == name);
    }
    getRegionByCode(code) {
        return this.regions.find(el => el.code == code);
    }
    getAreas() {
        return this.areas;
    }
    getAreaByName(name) {
        return this.areas.find(el => el.name == name);
    }
    getAreaByCode(code) {
        return this.areas.find(el => el.code == code);
    }
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
    containFavoriteAreas() {
        return this.areas.some(area => area.isFavorite);
    }
};
