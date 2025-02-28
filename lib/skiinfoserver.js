//const utils = require('@iobroker/adapter-core');
const { ioUtil } = require('./ioUtil');

const SkiCountryList = require('./ski/SkiCountryList');
const SkiUtil = require('./ski/SkiUtil');

/**
 * A class for managing TV program data and interactions.
 *
 * @param adapter - The adapter instance used for communication with the ioBroker system.
 *
 * This class initializes and manages TV program data, including channels, categories, genres, and broadcast events.
 * It provides methods for interacting with the data, processing messages, handling state changes, and managing the
 * filesystem. The class uses various APIs to fetch TV program data and stores it locally. It supports observing
 * state changes and responding to specific commands.
 */
class skiinfoclass {
    /*     
    this.log = {};
    this.islogsilly = true;
    this.islogdebug = true;
    this.observers = [];
    this.tvdata = {};
    this.tvdata.program = {}; */
    constructor(adapter) {
        this.adapter = adapter;
        this.ioUtil = new ioUtil(adapter);
        this.stateTemplate = {
            config: {
                name: 'config',
                read: true,
                write: false,
                type: 'string',
                role: 'value',
            },
        };
        this.countryList = null;
        this.favorites = [];
    }
    async init() {
        await this.checkDatapoints();
        await this.readConfig();
        await this.getInitData();
        this.doObserver();
    }
    async checkDatapoints() {
        this.ioUtil.logdebug('checkDatapoints');
        const key = 'config';
        let stateTemplate = this.stateTemplate[key];
        if (!stateTemplate.exist) {
            await this.ioUtil.createObjectAsync(stateTemplate, '', '');
            this.stateTemplate[key].exist = true;
        }
        let state = await this.ioUtil.getStateAsync(stateTemplate.name, '', '');
        if (state == null) {
            await this.ioUtil.setStateAsync(stateTemplate.name, '{}', '', '');
        }
    }
    async doObserver() {
        this.ioUtil.logdebug('doObserver');
        await this.ioUtil.delay(5 * 60 * 1000);
        await this.udateFavorites();
        this.doObserver();
    }
    async getInitData() {
        this.ioUtil.logdebug('getInitData');
        this.countryList = new SkiCountryList(new SkiUtil());
        await this.countryList.load();
        await this.countryList.getCountryByCode('deutschland').load();
        await this.countryList.getCountryByCode('oesterreich').load();
        await this.countryList.getCountryByCode('schweiz').load();
        await this.udateFavorites();
        await this.saveConfig();
        await this.ioUtil.delay(1000);
    }
    async udateFavorites() {
        this.ioUtil.logdebug('udateFavorites');
        //prüfe alle einträge in this favorites, führe den befehl load für jedes country aus
        for (let favorite of this.favorites) {
            let country = this.countryList && this.countryList.getCountryByCode(favorite.country);
            if (country) {
                await country.load();
            }
        }
    }
    async saveConfig() {
        this.ioUtil.logdebug('saveConfig');
        let key = 'config';
        await this.ioUtil.setStateAsync(
            this.stateTemplate[key].name,
            JSON.stringify({
                favorites: this.favorites,
                lastupdate: new Date().toISOString(),
            }),
            '',
            '',
        );
    }
    async readConfig() {
        this.ioUtil.logdebug('readConfig');
        try {
            let key = 'config';
            let state = await this.ioUtil.getStateAsync(this.stateTemplate[key].name, '', '');
            let config = JSON.parse(state.val);
            this.favorites = config.favorites ? config.favorites : [];
        } catch (error) {
            this.ioUtil.logerror(`readConfig error ${error}`);
        }
    }
    processMessages(msg) {
        this.ioUtil.logdebug(`processMessages ${JSON.stringify(msg)}`);
        if (msg.command === 'getServerSkiData') {
            this.ioUtil.logdebug('send getServerSkiData');
            this.getServerSkiDataMsg(msg);
        }
        if (msg.command === 'getServerCountryData') {
            this.ioUtil.logdebug('send getServerCountryData');
            this.getServerCountryDataMsg(msg);
        }
        if (msg.command === 'getServerRegionData') {
            this.ioUtil.logdebug('send getServerRegionData');
            this.getServerRegionDataMsg(msg);
        }
        if (msg.command === 'addServerFavorite') {
            this.ioUtil.logdebug('send addServerFavorite');
            this.addServerFavoriteMsg(msg);
        }
        if (msg.command === 'delServerFavorite') {
            this.ioUtil.logdebug('send delServerFavorite');
            this.delServerFavoriteMsg(msg);
        }
    }
    async getServerCountryDataMsg(msg) {
        this.ioUtil.logdebug('getServerCountryDataMsg ');
        if (typeof msg.message === 'object') {
            let countrycode = msg.message.countrycode || '';
            let country = this.countryList?.getCountryByCode(countrycode);
            if (country) {
                await country.load();
            }
        }
        let data = {
            skiinfodata: this.countryList?.getObject(),
            favorites: this.favorites,
        };
        this.ioUtil.logdebug(
            `getServerCountryDataMsg send${msg.from} ${msg.command} ${JSON.stringify(data).substring(0, 100)} ${msg.callback}`,
        );
        if (msg.callback) {
            this.adapter.sendTo(msg.from, msg.command, data, msg.callback);
        }
    }
    async getServerRegionDataMsg(msg) {
        this.ioUtil.logdebug('getServerRegionDataMsg ');
        if (typeof msg.message === 'object') {
            let countrycode = msg.message.countrycode || '';
            let regioncode = msg.message.regioncode || '';
            let country = this.countryList?.getCountryByCode(countrycode);
            if (country) {
                await country.load();
                let region = country.getRegionByCode(regioncode);
                if (region) {
                    await region.load();
                }
            }
        }
        let data = {
            skiinfodata: this.countryList?.getObject(),
            favorites: this.favorites,
        };
        this.ioUtil.logdebug(
            `getServerRegionDataMsg send${msg.from} ${msg.command} ${JSON.stringify(data).substring(0, 100)} ${msg.callback}`,
        );
        if (msg.callback) {
            this.adapter.sendTo(msg.from, msg.command, data, msg.callback);
        }
    }
    getServerSkiDataMsg(msg) {
        this.ioUtil.logdebug('getServerSkiDataMsg ');
        let data = {
            skiinfodata: this.countryList?.getObject(),
            favorites: this.favorites,
        };
        this.ioUtil.logdebug(
            `getServerSkiDataMsg send${msg.from} ${msg.command} ${JSON.stringify(data).substring(0, 100)} ${msg.callback}`,
        );
        if (msg.callback) {
            this.adapter.sendTo(msg.from, msg.command, data, msg.callback);
        }
    }
    addServerFavoriteMsg(msg) {
        this.ioUtil.logdebug('setServerFavoriteMsg ');
        if (typeof msg.message === 'object') {
            let countrycode = msg.message.countrycode || '';
            let areacode = msg.message.areacode || '';

            let index = this.favorites.findIndex(item => item.country == countrycode && item.area == areacode);
            if (index == -1) {
                this.favorites.push({
                    country: countrycode,
                    area: areacode,
                });
                let area = null;
                area = this.countryList?.getCountryByCode(countrycode).getAreaByCode(areacode);
                area.isFavorite = true;
                this.saveConfig();
            } else {
                this.ioUtil.logerror(
                    `addServerFavoriteMsg favorite allready exists ${msg.from} ${msg.command} ${countrycode} ${areacode}`,
                );
            }
            let data = {
                skiinfodata: this.countryList?.getObject(),
                favorites: this.favorites,
            };
            this.ioUtil.logdebug(
                `addServerFavoriteMsg favorite added ${msg.from} ${msg.command} ${countrycode} ${areacode}`,
            );
            if (msg.callback) {
                this.adapter.sendTo(msg.from, msg.command, data, msg.callback);
            }
        }
    }
    delServerFavoriteMsg(msg) {
        this.ioUtil.logdebug('delServerFavoriteMsg ');
        if (typeof msg.message === 'object') {
            let countrycode = msg.message.countrycode || '';
            let areacode = msg.message.areacode || '';

            let index = this.favorites.findIndex(item => item.country == countrycode && item.area == areacode);
            if (index !== -1) {
                this.favorites.splice(index, 1);
                let area = null;
                area = this.countryList?.getCountryByCode(countrycode).getAreaByCode(areacode);
                area.isFavorite = false;
                this.saveConfig();
            } else {
                this.ioUtil.logerror(
                    `delServerFavoriteMsg dont find favorite ${msg.from} ${msg.command} ${countrycode} ${areacode}`,
                );
            }
            let data = {
                skiinfodata: this.countryList?.getObject(),
                favorites: this.favorites,
            };
            this.ioUtil.logdebug(
                `delServerFavoriteMsg favorite deleted ${msg.from} ${msg.command} ${countrycode} ${areacode}`,
            );
            if (msg.callback) {
                this.adapter.sendTo(msg.from, msg.command, data, msg.callback);
            }
        }
    }
}

module.exports = skiinfoclass;
