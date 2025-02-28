const cheerio = require('cheerio');
const SkiConfig = require('./SkiConfig');
const SkiArea = require('./SkiArea');
module.exports = class SkiRegion {
    constructor(country) {
        this.country = country;
        this.name = null;
        this.code = null;
        this.url = null;
        this.areas = [];
        this.loaded = false;
    }
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
    async load() {
        let html = await this.country.util.request(this.url);
        this.parseAreas(html);
        this.loaded = true;
    }
    parseAreas(html) {
        const $ = cheerio.load(html);
        let elAreas = $('.snow .tr0,.snow .tr1');
        this.areas = [];
        for (let i = 0; i < elAreas.length; i++) {
            //elAreas.map((i, el) => {
            let bfa = new SkiArea();
            bfa.parse(elAreas[i]);
            let area = this.country.getAreaByCode(bfa.code);
            if (area == null) {
                bfa.setRegion(this.code);
                this.country.areas.push(bfa);
            } else {
                area.setRegion(this.code);
            }
            this.areas.push(bfa.code);
            //});
        }
    }
    getAreas() {
        return this.country.areas.filter(area => area.region == this.code);
    }
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
