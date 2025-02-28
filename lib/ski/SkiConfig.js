module.exports = class SkiConfig {
    static priv_baseurl = 'https://www.bergfex.ch';
    static priv_delaytime = 2 * 60 * 1000; //2 minutes
    /*     constructor() { } */
    static get baseurl() {
        return 'https://www.bergfex.ch';
    }
    static get delaytime() {
        return 2 * 1000; //2 seconds
    }
    static get cachetime() {
        return 60 * 60 * 1000; //1 hour
    }
};
