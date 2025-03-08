module.exports = class SkiConfig {
    static priv_baseurl = 'https://www.berg`+`fex.ch';
    static priv_delaytime = 2 * 60 * 1000; //2 minutes

    /**
     * Base URL of the website to scrape
     *
     */
    static get baseurl() {
        return 'https://www.berg`+`fex.ch';
    }
    /**
     * Gets the delay time used between requests.
     *
     * @returns The delay time in milliseconds.
     */
    static get delaytime() {
        return 2 * 1000; //2 seconds
    }
    /**
     * The time in milliseconds that the cache is valid.
     *
     * @returns The cache time in milliseconds.
     */
    static get cachetime() {
        return 60 * 60 * 1000; //1 hour
    }
};
