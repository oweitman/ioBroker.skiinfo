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
    /**
     * Creates a new instance of the skiinfoclass class.
     *
     * @param adapter - The adapter instance used for communication with the ioBroker system.
     *
     * The constructor initializes the skiinfoclass instance by setting up the ioUtil property and
     * the stateTemplate property, which contains the definitions for the datapoints. It then
     * initializes the countryList and favorites properties as empty objects.
     */
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
    /**
     * Initializes the adapter, including setting up datapoints, reading
     * configuration data, loading initial data, and setting up observers.
     *
     * @returns A promise that resolves when the initialization is complete.
     */
    async init() {
        await this.checkDatapoints();
        await this.readConfig();
        await this.getInitData();
        this.doObserver();
    }
    /**
     * Checks if the datapoint for the configuration exists and creates it if not.
     * Also sets an initial value of an empty object if the state does not exist.
     *
     * @returns A promise that resolves when the datapoints are checked and created.
     */
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
    /**
     * Initiates a recurring observation process that updates the favorite ski areas.
     * The function logs the start of the observation, waits for a specified delay,
     * updates the favorites, and then recursively calls itself to continue the process.
     */
    async doObserver() {
        this.ioUtil.logdebug('doObserver');
        await this.ioUtil.delay(5 * 60 * 1000);
        await this.updateFavorites();
        this.doObserver();
    }
    /**
     * Loads initial data for the ski information system, including country data
     * for Germany, Austria, and Switzerland. Initializes the country list,
     * updates the favorites, and saves the configuration. A delay is introduced
     * after initialization to ensure data stability.
     *
     * @returns A promise that resolves when the initial data loading and configuration
     *          processes are complete.
     */
    async getInitData() {
        this.ioUtil.logdebug('getInitData');
        this.countryList = new SkiCountryList(new SkiUtil());
        await this.countryList.load();
        await this.countryList.getCountryByCode('deutschland').load();
        await this.countryList.getCountryByCode('oesterreich').load();
        await this.countryList.getCountryByCode('schweiz').load();
        await this.updateFavorites();
        await this.saveConfig();
        await this.ioUtil.delay(1000);
    }
    /**
     * Iterates over the favorites and loads the data for each country in the list.
     * The function is called after initialization and is used to update the data
     * for the favorite ski areas.
     */
    async updateFavorites() {
        this.ioUtil.logdebug('updateFavorites');
        //prüfe alle einträge in this favorites, führe den befehl load für jedes country aus
        for (let favorite of this.favorites) {
            let country = this.countryList && this.countryList.getCountryByCode(favorite.country);
            if (country) {
                await country.load();
            }
        }
    }
    /**
     * Saves the current configuration to the ioBroker system. The configuration
     * includes the favorites and the last update time.
     */
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
    /**
     * Reads the current configuration from the ioBroker system.
     * Retrieves the state associated with the configuration and parses it
     * to update the favorites list. If an error occurs during this process,
     * it logs an error message.
     */
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
    /**
     * Process incoming messages and call the corresponding functions
     * to send the current data for the requested topics.
     *
     * @param msg The message object containing the command and data.
     */
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
    /**
     * Sends the current data for the requested country to the client.
     * Loads the country data if it was not already loaded and sends the data
     * back to the client.
     *
     * @param msg The message object containing the command and data.
     */
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
    /**
     * Sends the current data for the requested region to the client.
     * Loads the country and region data if it was not already loaded and sends the data
     * back to the client.
     *
     * @param msg The message object containing the command and data.
     */
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
            `getServerRegionDataMsg send ${msg.from} ${msg.command} ${JSON.stringify(data).substring(0, 100)} ${msg.callback}`,
        );
        if (msg.callback) {
            this.adapter.sendTo(msg.from, msg.command, data, msg.callback);
        }
    }
    /**
     * Sends the current data for the requested ski data to the client.
     * Sends the data back to the client.
     *
     * @param msg The message object containing the command and data.
     */
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
    /**
     * Adds a favorite area for the given country and area.
     * If the favorite area does not exist it will be added.
     * If the favorite area already exists the message will be logged as an error.
     * Sends the updated data back to the client.
     *
     * @param msg The message object containing the command and data.
     */
    addServerFavoriteMsg(msg) {
        this.ioUtil.logdebug('setServerFavoriteMsg ');
        if (typeof msg.message === 'object') {
            let countrycode = msg.message.countrycode || '';
            let regioncode = msg.message.regioncode || '';
            let areacode = msg.message.areacode || '';

            let index = this.favorites.findIndex(item => item.country == countrycode && item.area == areacode);
            if (index == -1) {
                this.favorites.push({
                    country: countrycode,
                    region: regioncode,
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
    /**
     * Removes a favorite area for the given country and area.
     * If the favorite area does not exist the message will be logged as an error.
     * Sends the updated data back to the client.
     *
     * @param msg The message object containing the command and data.
     */
    delServerFavoriteMsg(msg) {
        this.ioUtil.logdebug('delServerFavoriteMsg ');
        if (typeof msg.message === 'object') {
            let countrycode = msg.message.countrycode || '';
            // let regioncode = msg.message.regioncode || '';
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
