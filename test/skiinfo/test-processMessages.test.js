const { expect } = require('chai');
const sinon = require('sinon');

const skiinfoclass = require('../../lib/skiinfoserver');
const { createAdapterStub } = require('../helpers/adapterStub');

/*
 * Tests covering message dispatching and individual message handlers in the
 * skiinfo adapter.  To isolate behaviour from network and data loading the
 * countryList and region list methods are stubbed.  The adapter.sendTo
 * function is observed to verify responses are sent when callbacks are
 * provided.
 */

describe('skiinfoserver message processing', () => {
    let adapter;
    let server;

    beforeEach(() => {
        adapter = createAdapterStub();
        server = new skiinfoclass(adapter);
        // Provide minimal countryList to avoid null references
        server.countryList = {
            getObject: sinon.stub().returns([]),
            getCountryByCode: sinon.stub().returns({
                load: sinon.stub().resolves(),
                getRegionByCode: sinon.stub().returns({
                    load: sinon.stub().resolves(),
                }),
                getAreaByCode: sinon.stub().returns({ isFavorite: false }),
            }),
            getCountriesOfFavorties: sinon.stub().returns([]),
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it('processMessages dispatches to getServerSkiDataMsg', () => {
        const skiSpy = sinon.stub(server, 'getServerSkiDataMsg');
        server.processMessages({ command: 'getServerSkiData' });
        expect(skiSpy.calledOnce).to.be.true;
    });

    it('processMessages dispatches to getServerCountryDataMsg', () => {
        const countrySpy = sinon.stub(server, 'getServerCountryDataMsg');
        server.processMessages({ command: 'getServerCountryData' });
        expect(countrySpy.calledOnce).to.be.true;
    });

    it('processMessages dispatches to getServerRegionDataMsg', () => {
        const regionSpy = sinon.stub(server, 'getServerRegionDataMsg');
        server.processMessages({ command: 'getServerRegionData' });
        expect(regionSpy.calledOnce).to.be.true;
    });

    it('processMessages dispatches to addServerFavoriteMsg', () => {
        const addSpy = sinon.stub(server, 'addServerFavoriteMsg');
        server.processMessages({ command: 'addServerFavorite' });
        expect(addSpy.calledOnce).to.be.true;
    });

    it('processMessages dispatches to delServerFavoriteMsg', () => {
        const delSpy = sinon.stub(server, 'delServerFavoriteMsg');
        server.processMessages({ command: 'delServerFavorite' });
        expect(delSpy.calledOnce).to.be.true;
    });

    describe('getServerSkiDataMsg', () => {
        it('sends data via adapter.sendTo when callback supplied', () => {
            const sendSpy = adapter.sendTo;
            const callback = sinon.stub();
            const msg = { from: 'source', command: 'getServerSkiData', callback, message: {} };
            server.getServerSkiDataMsg(msg);
            expect(sendSpy.calledOnce).to.be.true;
            const args = sendSpy.firstCall.args;
            // Validate arguments: target, command, data and callback
            expect(args[0]).to.equal('source');
            expect(args[1]).to.equal('getServerSkiData');
            expect(args[2]).to.deep.equal({ skiinfodata: [], favorites: [] });
            expect(args[3]).to.equal(callback);
        });

        it('does nothing when callback is not provided', () => {
            const sendSpy = adapter.sendTo;
            const msg = { from: 'source', command: 'getServerSkiData', message: {} };
            server.getServerSkiDataMsg(msg);
            expect(sendSpy.notCalled).to.be.true;
        });
    });

    describe('getServerCountryDataMsg', () => {
        it('loads the requested country and sends response with favorites', async () => {
            // Prepare stubbed country
            const loadSpy = sinon.stub().resolves();
            const countryStub = { load: loadSpy };
            server.countryList.getCountryByCode.withArgs('de').returns(countryStub);
            const sendSpy = adapter.sendTo;
            const msg = { from: 'src', command: 'getServerCountryData', message: { countrycode: 'de' }, callback: sinon.stub() };
            await server.getServerCountryDataMsg(msg);
            expect(loadSpy.calledOnce).to.be.true;
            expect(sendSpy.calledOnce).to.be.true;
            const args = sendSpy.firstCall.args;
            expect(args[0]).to.equal('src');
            expect(args[1]).to.equal('getServerCountryData');
            expect(args[2]).to.deep.equal({ skiinfodata: [], favorites: [] });
        });

        it('sends response even if country is not found', async () => {
            server.countryList.getCountryByCode.returns(null);
            const sendSpy = adapter.sendTo;
            const msg = { from: 'src', command: 'getServerCountryData', message: { countrycode: 'xx' }, callback: sinon.stub() };
            await server.getServerCountryDataMsg(msg);
            expect(sendSpy.calledOnce).to.be.true;
            const args = sendSpy.firstCall.args;
            expect(args[2]).to.deep.equal({ skiinfodata: [], favorites: [] });
        });
    });

    describe('getServerRegionDataMsg', () => {
        it('loads the country and region and sends response', async () => {
            const regionLoad = sinon.stub().resolves();
            const regionStub = { load: regionLoad };
            const countryLoad = sinon.stub().resolves();
            const countryStub = { load: countryLoad, getRegionByCode: sinon.stub().withArgs('reg1').returns(regionStub) };
            server.countryList.getCountryByCode.withArgs('de').returns(countryStub);
            const sendSpy = adapter.sendTo;
            const msg = { from: 'src', command: 'getServerRegionData', message: { countrycode: 'de', regioncode: 'reg1' }, callback: sinon.stub() };
            await server.getServerRegionDataMsg(msg);
            expect(countryLoad.calledOnce).to.be.true;
            expect(regionLoad.calledOnce).to.be.true;
            expect(sendSpy.calledOnce).to.be.true;
        });

        it('sends response when country is not found', async () => {
            server.countryList.getCountryByCode.returns(null);
            const sendSpy = adapter.sendTo;
            const msg = { from: 'src', command: 'getServerRegionData', message: { countrycode: 'xx' }, callback: sinon.stub() };
            await server.getServerRegionDataMsg(msg);
            expect(sendSpy.calledOnce).to.be.true;
        });
    });

    describe('addServerFavoriteMsg', () => {
        it('adds a new favorite and marks area as favorite', () => {
            const areaStub = { isFavorite: false };
            // Stub getCountryByCode to return object with getAreaByCode
            server.countryList.getCountryByCode.withArgs('de').returns({ getAreaByCode: sinon.stub().withArgs('area1').returns(areaStub) });
            server.favorites = [];
            const saveSpy = sinon.stub(server, 'saveConfig').resolves();
            const msg = { from: 'src', command: 'addServerFavorite', message: { countrycode: 'de', areacode: 'area1' }, callback: sinon.stub() };
            server.addServerFavoriteMsg(msg);
            // favorite should be added
            expect(server.favorites).to.deep.equal([ { country: 'de', area: 'area1' } ]);
            expect(areaStub.isFavorite).to.be.true;
            expect(saveSpy.calledOnce).to.be.true;
            // sendTo should have been called
            expect(adapter.sendTo.calledOnce).to.be.true;
        });

        it('does not add duplicate favorites and logs error', () => {
            const errorSpy = sinon.stub(server.ioUtil, 'logerror');
            const sendSpy = adapter.sendTo;
            server.favorites = [ { country: 'de', area: 'area1' } ];
            const msg = { from: 'src', command: 'addServerFavorite', message: { countrycode: 'de', areacode: 'area1' }, callback: sinon.stub() };
            server.addServerFavoriteMsg(msg);
            // favorites should remain unchanged
            expect(server.favorites).to.deep.equal([ { country: 'de', area: 'area1' } ]);
            expect(errorSpy.calledOnce).to.be.true;
            expect(sendSpy.calledOnce).to.be.true;
        });
    });

    describe('delServerFavoriteMsg', () => {
        it('removes an existing favorite and clears area flag', () => {
            const areaStub = { isFavorite: true };
            server.countryList.getCountryByCode.withArgs('de').returns({ getAreaByCode: sinon.stub().withArgs('area1').returns(areaStub) });
            server.favorites = [ { country: 'de', area: 'area1' } ];
            const saveSpy = sinon.stub(server, 'saveConfig').resolves();
            const msg = { from: 'src', command: 'delServerFavorite', message: { countrycode: 'de', areacode: 'area1' }, callback: sinon.stub() };
            server.delServerFavoriteMsg(msg);
            expect(server.favorites).to.deep.equal([]);
            expect(areaStub.isFavorite).to.be.false;
            expect(saveSpy.calledOnce).to.be.true;
            expect(adapter.sendTo.calledOnce).to.be.true;
        });

        it('logs error when favorite to delete is not found', () => {
            const errorSpy = sinon.stub(server.ioUtil, 'logerror');
            server.favorites = [ { country: 'de', area: 'area1' } ];
            const msg = { from: 'src', command: 'delServerFavorite', message: { countrycode: 'de', areacode: 'area2' }, callback: sinon.stub() };
            server.delServerFavoriteMsg(msg);
            expect(errorSpy.calledOnce).to.be.true;
            // favorites should remain unchanged
            expect(server.favorites).to.deep.equal([ { country: 'de', area: 'area1' } ]);
            // sendTo still called to return current state
            expect(adapter.sendTo.calledOnce).to.be.true;
        });
    });
});