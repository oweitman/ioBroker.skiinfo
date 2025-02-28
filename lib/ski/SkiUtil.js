const SkiCache = require('./SkiCache');
const SkiConfig = require('./SkiConfig');
const axios = require('axios').default;

module.exports = class SkiUtil {
    constructor() {
        this.cache = new SkiCache();
        this.lastrequest = 0;
        this.httpUserAgent =
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36';
    }
    async request(url) {
        console.log(`request1: ${url} ${Date.now()}`);
        let cachedata = this.cache.getData();
        let cacheresult = cachedata.find(el => el.url == url);
        if (!cacheresult) {
            console.log(`request3: ${url} add to cache`);
            let index = cachedata.push({ url, html: null, lastrequest: 0 });
            cacheresult = cachedata[index - 1];
        }
        if (cacheresult.lastrequest + SkiConfig.cachetime < Date.now()) {
            cacheresult.lastrequest = Date.now();
            try {
                while (this.lastrequest + SkiConfig.delaytime > Date.now()) {
                    console.log(`request2: ${url} deferred`);
                    await this.delay(SkiConfig.delaytime);
                }

                //  const response = await fetch(url, {
                //     method: 'GET',
                //     headers: {
                //         accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                //         'accept-language': 'en-US,en;q=0.9,de-DE;q=0.8,de;q=0.7',
                //         'cache-control': 'no-cache',
                //         pragma: 'no-cache',
                //         priority: 'u=0, i',
                //         'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
                //         'sec-ch-ua-mobile': '?0',
                //         'sec-ch-ua-platform': '"Windows"',
                //         'sec-fetch-dest': 'document',
                //         'sec-fetch-mode': 'navigate',
                //         'sec-fetch-site': 'same-origin',
                //         'sec-fetch-user': '?1',
                //         'upgrade-insecure-requests': '1',
                //         'user-agent':
                //             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
                //     },
                // });
                await this.delay(1000);
                const response = await axios.get(url, {
                    headers: {
                        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                        'accept-language': 'en-US,en;q=0.9,de-DE;q=0.8,de;q=0.7',
                        'cache-control': 'no-cache',
                        pragma: 'no-cache',
                        priority: 'u=0, i',
                        'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Windows"',
                        'sec-fetch-dest': 'document',
                        'sec-fetch-mode': 'navigate',
                        'sec-fetch-site': 'same-origin',
                        'sec-fetch-user': '?1',
                        'upgrade-insecure-requests': '1',
                        'user-agent':
                            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
                    },
                });
                cacheresult.html = response.data;
            } catch (error) {
                console.log(`request4: ${url} error `);
                console.log(error);
            }
            cacheresult.lastrequest = this.lastrequest = Date.now();
            console.log(`request4: ${url} fetched ${cacheresult.html !== null}`);
            return cacheresult.html;
        }
        console.log(`request5: ${url} cached ${cacheresult.html !== null}`);
        return cacheresult.html;
    }
    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
