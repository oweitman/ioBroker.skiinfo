const { expect } = require('chai');
const sinon = require('sinon');

const SkiCache = require('../../lib/ski/SkiCache');
const SkiConfig = require('../../lib/ski/SkiConfig');
const SkiUtil = require('../../lib/ski/SkiUtil');

/*
 * Tests for SkiCache, SkiConfig and SkiUtil classes.  Only the cache
 * retrieval and configuration getters are validated.  For SkiUtil, the
 * caching branch of the request method is exercised by pre-populating
 * the cache with a fresh entry.  The path which makes HTTP requests is
 * intentionally not tested here to avoid external dependencies.
 */

describe('SkiCache', () => {
    it('getData returns internal data array', () => {
        const cache = new SkiCache();
        cache.data = [ { url: 'u', html: 'h' } ];
        expect(cache.getData()).to.deep.equal([ { url: 'u', html: 'h' } ]);
    });
});

describe('SkiConfig getters', () => {
    it('baseurl returns the base URL', () => {
        expect(SkiConfig.baseurl).to.equal('https://www.bergfex.ch');
    });
    it('delaytime returns default delay', () => {
        expect(SkiConfig.delaytime).to.equal(2000);
    });
    it('cachetime returns one hour in ms', () => {
        expect(SkiConfig.cachetime).to.equal(60 * 60 * 1000);
    });
});

describe('SkiUtil request', () => {
    it('returns cached html when cache entry is still valid', async () => {
        const util = new SkiUtil();
        const now = Date.now();
        util.cache.data = [ { url: 'http://example.com', html: '<html></html>', lastrequest: now } ];
        // Call request with same URL.  Because lastrequest + cachetime > now,
        // it should return cached html and not perform a network call.
        const result = await util.request('http://example.com');
        expect(result).to.equal('<html></html>');
    });
});