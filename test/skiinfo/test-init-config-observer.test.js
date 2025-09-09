const { expect } = require('chai');
const sinon = require('sinon');

const skiinfoclass = require('../../lib/skiinfoserver');
const { createAdapterStub } = require('../helpers/adapterStub');

/*
 * Tests covering initialization, configuration handling and observer logic of
 * the Skiinfo server.  To keep the tests deterministic the asynchronous
 * behaviour of `getInitData` and `doObserver` is stubbed so that they do
 * not trigger network requests or infinite loops.  The ioUtil methods
 * invoked by these operations are stubbed via the adapter stub and
 * sinon spies.
 */

describe('skiinfoserver initialization and config', () => {
    let adapter;
    let server;

    beforeEach(() => {
        adapter = createAdapterStub();
        server = new skiinfoclass(adapter);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('init calls checkDatapoints, readConfig, getInitData and starts observer', async () => {
        // Replace methods with spies that resolve immediately
        const checkSpy = sinon.stub(server, 'checkDatapoints').resolves();
        const readSpy = sinon.stub(server, 'readConfig').resolves();
        const initSpy = sinon.stub(server, 'getInitData').resolves();
        // Prevent the real observer loop from executing
        const obsSpy = sinon.stub(server, 'doObserver');

        await server.init();

        expect(checkSpy.calledOnce).to.be.true;
        expect(readSpy.calledOnce).to.be.true;
        expect(initSpy.calledOnce).to.be.true;
        // observer should be kicked off once
        expect(obsSpy.calledOnce).to.be.true;
    });

    it('checkDatapoints creates config object and initial state when missing', async () => {
        // Mark the stateTemplate entry as not existing
        server.stateTemplate.config.exist = false;
        // Simulate no existing state returned by ioUtil.getStateAsync
        sinon.stub(server.ioUtil, 'getStateAsync').resolves(null);
        const createObjStub = sinon.stub(server.ioUtil, 'createObjectAsync').resolves();
        const setStateStub = sinon.stub(server.ioUtil, 'setStateAsync').resolves();

        await server.checkDatapoints();

        // should create the object when exist flag is false
        expect(createObjStub.calledOnceWithExactly(server.stateTemplate.config, '', '')).to.be.true;
        // exist flag should be set
        expect(server.stateTemplate.config.exist).to.be.true;
        // should set initial state to '{}'
        expect(setStateStub.calledOnce).to.be.true;
    });

    it('checkDatapoints does not recreate object when exist flag is true but sets state when missing', async () => {
        server.stateTemplate.config.exist = true;
        sinon.stub(server.ioUtil, 'createObjectAsync');
        // getStateAsync returns null to simulate missing state
        sinon.stub(server.ioUtil, 'getStateAsync').resolves(null);
        const setStateStub = sinon.stub(server.ioUtil, 'setStateAsync').resolves();

        await server.checkDatapoints();
        // createObjectAsync should not be called
        expect(server.ioUtil.createObjectAsync.called).to.be.false;
        // Should still set initial state
        expect(setStateStub.calledOnce).to.be.true;
    });

    it('checkDatapoints skips setting state when state already exists', async () => {
        server.stateTemplate.config.exist = true;
        sinon.stub(server.ioUtil, 'createObjectAsync');
        // getStateAsync returns an object with val property to simulate existing state
        sinon.stub(server.ioUtil, 'getStateAsync').resolves({ val: '{}' });
        const setStateStub = sinon.stub(server.ioUtil, 'setStateAsync');

        await server.checkDatapoints();
        expect(server.ioUtil.createObjectAsync.called).to.be.false;
        expect(setStateStub.called).to.be.false;
    });

    it('udateFavorites loads each favorite country if available', async () => {
        // Provide a countryList implementation that returns objects with a load() method
        // Provide country objects with a load() method and a loaded flag.  The
        // skiinfoserver implementation will always call load() regardless of
        // loaded status, so we track calls via the stub.  Use full country
        // codes (e.g. deutschsprachig names) to mirror real codes like
        // 'deutschland' and 'schweiz'.  Each load stub updates loaded to true.
        const countryDE = { loaded: false, load: sinon.stub().callsFake(function() { this.loaded = true; return Promise.resolve(); }) };
        const countryCH = { loaded: false, load: sinon.stub().callsFake(function() { this.loaded = true; return Promise.resolve(); }) };
        server.countryList = {
            getCountryByCode: (code) => {
                if (code === 'deutschland') return countryDE;
                if (code === 'schweiz') return countryCH;
                return null;
            },
        };
        server.favorites = [ { country: 'deutschland' }, { country: 'schweiz' } ];
        await server.udateFavorites();
        expect(countryDE.load.calledOnce).to.be.true;
        expect(countryCH.load.calledOnce).to.be.true;
    });

    it('udateFavorites ignores favorites with unknown country', async () => {
        server.countryList = {
            getCountryByCode: sinon.stub().returns(null),
        };
        server.favorites = [ { country: 'xx' } ];
        await server.udateFavorites();
        // nothing should be called, but it should not throw
        expect(server.countryList.getCountryByCode.calledOnceWithExactly('xx')).to.be.true;
    });

    it('saveConfig writes favorites and timestamp as JSON state', async () => {
        // stub setStateAsync to capture the payload
        const setStateStub = sinon.stub(server.ioUtil, 'setStateAsync').resolves();
        server.favorites = [ { country: 'de', area: 'area1' } ];
        await server.saveConfig();
        expect(setStateStub.calledOnce).to.be.true;
        const args = setStateStub.firstCall.args;
        // first arg should be the state name
        expect(args[0]).to.equal(server.stateTemplate.config.name);
        // second arg should be a JSON string containing favorites array
        const payload = JSON.parse(args[1]);
        expect(payload.favorites).to.deep.equal(server.favorites);
        expect(payload).to.have.property('lastupdate');
    });

    it('readConfig populates favorites from stored state', async () => {
        const configObj = { favorites: [ { country: 'de', area: 'area2' } ] };
        sinon.stub(server.ioUtil, 'getStateAsync').resolves({ val: JSON.stringify(configObj) });
        await server.readConfig();
        expect(server.favorites).to.deep.equal(configObj.favorites);
    });

    it('readConfig logs error when JSON parsing fails', async () => {
        const errorStub = sinon.stub(server.ioUtil, 'logerror');
        sinon.stub(server.ioUtil, 'getStateAsync').resolves({ val: '{invalid' });
        await server.readConfig();
        expect(errorStub.calledOnce).to.be.true;
    });
});