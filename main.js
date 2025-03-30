'use strict';

/*
 * Created with @iobroker/create-adapter v2.6.5
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load your modules here, e.g.:
const skiinfoclassNew = require(`${__dirname}/lib/skiinfoserver.js`);
let skiinfoserver;

class Skiinfo extends utils.Adapter {
    /**
     * @param [options] - optional options object
     */
    constructor(options) {
        super({
            ...options,
            name: 'skiinfo',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        this.log.debug('main onReady start');

        // Initialize your adapter here
        if (!skiinfoserver) {
            this.log.debug('main onReady open skiinfo');
            skiinfoserver = new skiinfoclassNew(this);
            await skiinfoserver.init();
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     *
     * @param callback - call back function
     */
    onUnload(callback) {
        try {
            this.log.debug('main onUnload try');

            skiinfoserver.closeConnections();
            this.log.info('cleaned everything up...');
            callback();
        } catch {
            this.log.debug('main onUnload error');
            callback();
        }
    }
    onMessage(obj) {
        if (typeof obj === 'object' && obj.message) {
            if (obj.command === 'send') {
                // e.g. send email or pushover or whatever
                this.log.info('send command');
                // Send response in callback if required
                if (obj.callback) {
                    this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
                }
            }
        }
        skiinfoserver.processMessages(obj);
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    /**
     * @param [options] - optional options object
     */
    module.exports = options => new Skiinfo(options);
} else {
    // otherwise start the instance directly
    new Skiinfo();
}
