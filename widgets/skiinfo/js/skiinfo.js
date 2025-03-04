/*
    ioBroker.vis skiinfo Widget-Set

    Copyright 2025 oweitman oweitman@gmx.de
*/
'use strict';

// const { config } = require("chai");

/* global $, vis, systemDictionary,_ */

import { version as pkgVersion } from '../../../package.json';
var translations = require('../i18n/translations.json');
$.extend(true, systemDictionary, translations);

// this code can be placed directly in skiinfo.html
vis.binds['skiinfo'] = {
    version: pkgVersion,
    debug: true,
    showVersion: function () {
        if (vis.binds['skiinfo'].version) {
            console.log(`Version skiinfo: ${vis.binds['skiinfo'].version}`);
            vis.binds['skiinfo'].version = null;
        }
    },
    data: null,
    sortarrows: {
        0: '&nbsp;',
        1: '&darr;',
        2: '&uarr;',
    },
    browser: {
        /**
         * Asynchronously creates a widget for the specified widget ID, view, data, and style.
         * If the widget element is not found, the function retries after a delay.
         * Loads instance and skiinfo_oid information, initializes necessary data structures,
         * retrieves ski data if not already available, and sets the selected country.
         * Finally, it renders the widget.
         *
         * @param widgetID - The ID of the widget to create.
         * @param view - The view in which the widget is being created.
         * @param data - Data object containing skiinfo_oid and other relevant information.
         * @param style - The style to apply to the widget.
         */
        createWidget: async function (widgetID, view, data, style) {
            var $div = $(`#${widgetID}`);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds['skiinfo'].browser.createWidget(widgetID, view, data, style);
                }, 100);
            }
            this.visSkiinfo = vis.binds['skiinfo'];
            if (!data.skiinfo_oid || data.skiinfo_oid == '') {
                return;
            }
            let [instance, skiinfo_oid] = this.visSkiinfo.getInstanceInfo(data.skiinfo_oid);
            if (!skiinfo_oid && !instance) {
                return;
            }

            this.visSkiinfo.debug && console.log('Load Data');
            if (!this.visSkiinfo[instance]) {
                this.visSkiinfo[instance] = {
                    data: null,
                };
            }
            if (!this.visSkiinfo[widgetID]) {
                this.visSkiinfo[widgetID] = {
                    // 0=default,1=asc,2=desc
                    sortState: {
                        thname: 0,
                        thvalley: 0,
                        thmountain: 0,
                        thnew: 0,
                        thlift: 0,
                        thupdate: 0,
                    },
                };
            }
            this.visSkiinfo[widgetID].wdata = data;
            this.visSkiinfo[widgetID].instance = instance;
            if (!this.visSkiinfo[instance].data) {
                this.visSkiinfo[instance].data = await this.visSkiinfo.getServerSkiData(instance);
                if (!this.visSkiinfo[instance].data.favorites) {
                    this.visSkiinfo[instance].data.favorites = [];
                }
            }
            if (!this.visSkiinfo[widgetID].selectedCountry) {
                await this.setSelectedCountry(widgetID);
            }
            this.render(widgetID);
        },
        /**
         * Renders the skiinfo widget for the specified widget ID.
         * Constructs the HTML structure and style, including tables for countries, regions, and areas.
         * Adds click event handlers to elements for interactivity.
         *
         * @param widgetID - The ID of the widget to render.
         */
        async render(widgetID) {
            this.visSkiinfo.debug && console.log(`render browser`);
            let instance = this.visSkiinfo[widgetID].instance;
            let favoritecolor = this.visSkiinfo[widgetID].wdata.favoritecolor || 'red';
            let text = '';
            text += `<style>`;
            text += `.skiinfo.${widgetID}.container {\n`;
            text += '   display: flex; \n';
            text += '   height: 100%; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID}.flexcontainer {\n`;
            text += '   overflow: auto; \n';
            text += '   scrollbar-width: thin; \n';
            text += '   margin: 0px 0px 0px 2px; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID}.countries {\n`;
            text += '} \n';
            text += `.skiinfo.${widgetID}.countries.scroll {\n`;
            text += '} \n';

            text += `.skiinfo.${widgetID} ul {\n`;
            text += '   list-style-type: none; \n';
            text += '   padding: 0px; \n';
            text += '   margin: 0px; \n';
            text += '} \n';

            text += `.skiinfo.${widgetID} li {\n`;
            text += '   border: solid 1px;\n';
            text += '   border-color: currentcolor;\n';
            text += '   padding: 2px 8px;\n';
            text += '   margin: 2px 0px;\n';
            text += '   cursor: pointer;\n';
            text += '} \n';

            text += `.skiinfo.${widgetID}.regions {\n`;
            text += '} \n';
            text += `.skiinfo.${widgetID}.regions.scroll {\n`;
            text += '} \n';
            text += `.skiinfo.${widgetID}.regions li.selected {\n`;
            text += '   font-weight: bold; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID}.areas .favorite {\n`;
            text += '   cursor: pointer;\n';
            text += '   padding-right: 5px; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID}.areas .tharea {\n`;
            text += '   cursor: pointer;\n';
            text += '} \n';
            text += `.skiinfo.${widgetID}.areas .favorite.selected {\n`;
            text += `   color: ${favoritecolor}; \n`;
            text += '} \n';
            text += `.skiinfo.${widgetID} table {\n`;
            text += '   white-space: nowrap; \n';
            text += '   border-collapse: separate; \n';
            text += '   border-spacing: 0px 2px; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID} table tr {\n`;
            text += '} \n';
            text += `.skiinfo.${widgetID} table td, .skiinfo.${widgetID} table th {\n`;
            text += '   padding: 2px 8px; \n';
            text += '   border: solid 1px currentcolor; \n';
            text += '   border-left-width: 0px; \n';
            text += '   border-right-width: 0px; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID} th {\n`;
            text += '   text-align: left; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID} td span.selected {\n`;
            text += '   font-weight: bold; \n';
            text += '} \n';

            text += `.skiinfo.${widgetID} table td.txtr {\n`;
            text += '   text-align: right;\n';
            text += '} \n';
            text += `.skiinfo.${widgetID} table td.txtl {\n`;
            text += '   text-align: left;\n';
            text += '} \n';

            text += `.skiinfo.${widgetID}.countries table td, .skiinfo.${widgetID}.regions table td {\n`;
            text += '   cursor: pointer;\n';
            text += '} \n';
            text += `.skiinfo.${widgetID} table td:first-child, .skiinfo.${widgetID} table th:first-child {\n`;
            text += '   border-left-width: 1px; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID} table td:last-child, .skiinfo.${widgetID} table th:last-child {\n`;
            text += '   border-right-width: 1px; \n';
            text += '   padding-right: 7px; \n';
            text += '} \n';
            text += `</style>`;
            text += `<div class="skiinfo ${widgetID} container">`;
            text += ` <div class="skiinfo ${widgetID} flexcontainer countries">`;
            text += `  <table>`;
            text += `   <tr>`;
            text += `    <th>${_('Land')}</th>`;
            text += `   </tr>`;
            this.visSkiinfo[instance].data.skiinfodata.map(country => {
                text += `   <tr>`;
                text += `    <td><span 
                 data-code="${country.code}" 
                 data-widgetid="${widgetID}" 
                 ${country.code == this.visSkiinfo[widgetID].selectedCountry.code ? 'class="selected"' : ''}
                >${country.name}</span></td>`;
                text += `   </tr>`;
            });
            text += `  </table>`;
            text += ` </div>`;
            text += ` <div class="skiinfo ${widgetID} flexcontainer regions">`;
            text += `  <table>`;
            text += `   <tr>`;
            text += `    <th>${_('Region')}</th>`;
            text += `   </tr>`;
            this.visSkiinfo[widgetID].selectedCountry.regions.map(region => {
                text += `   <tr>`;
                text += `    <td><span  
                 data-code="${region.code}" 
                 data-widgetid="${widgetID}" 
                 data-country="${this.visSkiinfo[widgetID].selectedCountry.code}" 
                 ${region.code == this.visSkiinfo[widgetID].selectedRegion.code ? 'class="selected"' : ''}
                >${region.name}</span></td>`;
                text += `   </tr>`;
            });
            text += `  </table>`;
            text += ` </div>`;

            text += ` <div class="skiinfo ${widgetID} flexcontainer areas">`;
            text += `  <table>`;
            text += `   <tr>`;
            text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thname">${_('Area')} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState['thname']]}</th>`;
            text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thvalley">${_('Tal')} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState['thvalley']]}</th>`;
            text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thmountain">${_('Berg')} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState['thmountain']]}</th>`;
            text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thnew">${_('Neu')} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState['thnew']]}</th>`;
            text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thlift">${_('Lift')} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState['thlift']]}</th>`;
            text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thupdate">${_('von')} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState['thupdate']]}</th>`;
            text += `   </tr>`;

            let sortkey = '';
            let sortdir = 0;
            for (const item in this.visSkiinfo[widgetID].sortState) {
                if (this.visSkiinfo[widgetID].sortState[item] > 0) {
                    sortkey = item;
                    sortdir = this.visSkiinfo[widgetID].sortState[item];
                }
            }
            /**
             * Compares two objects based on a specified sort key and direction.
             * The comparison is performed according to the type associated with the sort key,
             * which can be 'string', 'number', or 'date'. If the sort key is 'thlift', a ratio
             * of liftsAll to liftsOpen is used for comparison. The function returns a negative
             * number if the first object should be sorted before the second, a positive number
             * if the first object should be sorted after the second, and zero if they are equal.
             *
             * @param a - The first object to compare.
             * @param b - The second object to compare.
             * @returns - A negative, positive, or zero value based on comparison.
             */
            const compareFn = (a, b) => {
                let valA, valB, compareType;
                switch (sortkey) {
                    case 'thname':
                        compareType = 'string';
                        valA = a.name;
                        valB = b.name;
                        break;
                    case 'thvalley':
                        compareType = 'number';
                        valA = a.snowValley;
                        valB = b.snowValley;
                        break;
                    case 'thmountain':
                        compareType = 'number';
                        valA = a.snowMountain;
                        valB = b.snowMountain;
                        break;
                    case 'thnew':
                        compareType = 'number';
                        valA = a.freshSnow;
                        valB = b.freshSnow;
                        break;
                    case 'thlift':
                        compareType = 'number';
                        if (a.liftsAll == 0) {
                            valA = Infinity;
                        } else {
                            valA = a.liftsAll / a.liftsOpen;
                        }
                        if (b.liftsAll == 0) {
                            valB = Infinity;
                        } else {
                            valB = b.liftsAll / b.liftsOpen;
                        }
                        [valA, valB] = [valB, valA];
                        break;
                    case 'thupdate':
                        compareType = 'date';
                        valA = a.lastUpdate;
                        valB = b.lastUpdate;
                        break;
                    default:
                        compareType = 'nosort';
                        break;
                }
                switch (sortdir) {
                    case 1:
                        [valA, valB] = [valB, valA];
                        break;
                    case 2:
                        break;
                    default:
                        break;
                }
                switch (compareType) {
                    case 'string':
                        return valA.localeCompare(valB);
                    case 'number':
                        return valA - valB;
                    case 'date':
                        return new Date(valA).getTime() - new Date(valB).getTime();
                    default:
                        return 0;
                }
            };

            this.visSkiinfo[widgetID].selectedCountry.areas
                .filter(area => area.region == this.visSkiinfo[widgetID].selectedRegion.code)
                .sort(compareFn)
                .map(area => {
                    let selected =
                        this.visSkiinfo[instance].data.favorites.findIndex(
                            item =>
                                item.country == this.visSkiinfo[widgetID].selectedCountry.code &&
                                item.area == area.code,
                        ) == -1
                            ? false
                            : true;
                    text += `   <tr>`;
                    text += `    <td class="txtl"><span class="favorite ${selected ? 'selected' : ''}"  data-widgetid="${widgetID}" data-country="${this.visSkiinfo[widgetID].selectedCountry.code}" data-area="${area.code}">&#x1F7CA;</span>${area.name}</td>`;
                    text += `    <td class="txtr">${area.snowValley}</td>`;
                    text += `    <td class="txtr">${area.snowMountain}</td>`;
                    text += `    <td class="txtr">${area.freshSnow}</td>`;
                    text += `    <td class="txtr">${area.liftsOpen}/${area.liftsAll}</td>`;
                    text += `    <td class="txtl">${area.lastUpdate}</td>`;
                    text += `   </tr>`;
                });
            text += `  </table>`;
            text += ` </div>`;
            text += `</div>`;

            $(`#${widgetID}`).html(text);
            $(`.skiinfo.${widgetID}.countries td span`).click(async function () {
                await vis.binds['skiinfo'].browser.onClickCountry(this);
            });
            $(`.skiinfo.${widgetID}.regions td span`).click(async function () {
                await vis.binds['skiinfo'].browser.onClickRegion(this);
            });
            $(`.skiinfo.${widgetID} .tharea`).click(async function () {
                await vis.binds['skiinfo'].browser.onClickHeadArea(this);
            });
            $(`.skiinfo.${widgetID}.areas .favorite`).click(async function () {
                await vis.binds['skiinfo'].browser.onClickFavorite(this);
            });
        },
        /**
         * Event handler for clicking on a country.
         *
         * @param el The HTML element that was clicked.
         * @returns Promise
         *
         * This function sets the selected country to the one that was clicked
         * and then calls the render function to update the widget.
         */
        onClickCountry: async function (el) {
            let code = $(el).attr('data-code');
            let widgetID = $(el).attr('data-widgetid');
            this.visSkiinfo.debug && console.log(`onClickCountry ${widgetID} ${code}`);
            await this.setSelectedCountry(widgetID, code);
            this.render(widgetID);
        },
        /**
         * Event handler for clicking on a region.
         *
         * @param el The HTML element that was clicked.
         * @returns Promise
         *
         * This function sets the selected region to the one that was clicked
         * and then calls the render function to update the widget.
         */
        onClickRegion: async function (el) {
            let code = $(el).attr('data-code');
            let countrycode = $(el).attr('data-country');
            let widgetID = $(el).attr('data-widgetid');
            this.visSkiinfo.debug && console.log(`onClickRegion ${widgetID} ${countrycode} ${code}`);
            await this.setSelectedRegion(widgetID, countrycode, code);
            this.render(widgetID);
        },
        /**
         * Event handler for clicking on a table header in the area list.
         *
         * @param el The HTML element that was clicked.
         * @returns Promise
         *
         * This function toggles the sort order of the area list by the sort key
         * that was clicked and then calls the render function to update the
         * widget.
         */
        onClickHeadArea: async function (el) {
            let sortkey = $(el).attr('data-sort');
            let widgetID = $(el).attr('data-widgetid');
            this.visSkiinfo.debug && console.log(`onClickHeadArea ${widgetID} ${sortkey}`);
            vis.binds['skiinfo'].toggleSort(widgetID, sortkey);
            this.render(widgetID);
        },
        /**
         * Event handler for clicking on a favorite icon.
         *
         * @param el The HTML element that was clicked.
         * @returns Promise
         *
         * This function toggles the favorite status of the clicked area and then
         * calls the render function to update the widget.
         */
        onClickFavorite: async function (el) {
            let widgetID = $(el).attr('data-widgetid');
            let instance = this.visSkiinfo[widgetID].instance;
            let country = $(el).attr('data-country');
            let area = $(el).attr('data-area');
            if (!this.visSkiinfo[instance].data.favorites) {
                this.visSkiinfo[instance].data.favorites = [];
            }
            let index = this.visSkiinfo[instance].data.favorites.findIndex(
                item => item.country == country && item.area == area,
            );
            if (index !== -1) {
                this.visSkiinfo.debug && console.log(`onClickFavorite ${widgetID} ${country} ${area} fav deleted`);
                this.visSkiinfo[instance].data = await this.visSkiinfo.delServerFavorite(
                    this.visSkiinfo[widgetID].instance,
                    country,
                    area,
                );
            } else {
                this.visSkiinfo.debug && console.log(`onClickFavorite ${widgetID} ${country} ${area} fav added`);
                this.visSkiinfo[instance].data = await this.visSkiinfo.addServerFavorite(
                    this.visSkiinfo[widgetID].instance,
                    country,
                    area,
                );
            }
            this.render(widgetID);
        },
        /**
         * Sets the selected country of the widget to the given country code.
         *
         * If the country code is not given, the first country in the list is selected.
         *
         * This function also sets the selected region to the first region of the selected country.
         *
         * @param widgetID The ID of the widget for which the selected country is changed.
         * @param countrycode The code of the country to select.
         * @returns Promise
         */
        setSelectedCountry: async function (widgetID, countrycode) {
            let instance = this.visSkiinfo[widgetID].instance;
            this.visSkiinfo.debug && console.log(`setSelectedCountry ${widgetID} ${countrycode}`);
            if (countrycode) {
                this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata.find(
                    country => country.code == countrycode,
                );
                if (this.visSkiinfo[widgetID].selectedCountry.loaded == false) {
                    this.visSkiinfo[instance].data = await this.visSkiinfo.getServerCountryData(
                        this.visSkiinfo[widgetID].instance,
                        this.visSkiinfo[widgetID].selectedCountry.code,
                    );
                    this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata.find(
                        country => country.code == countrycode,
                    );
                }
                this.visSkiinfo[widgetID].selectedRegion = this.visSkiinfo[widgetID].selectedCountry.regions[0];
            } else {
                this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata[0];
                this.visSkiinfo[widgetID].selectedRegion = this.visSkiinfo[widgetID].selectedCountry.regions[0];
            }
        },
        /**
         * Sets the selected region of the widget to the given region code.
         *
         * If the country code is not given, the currently selected country is used.
         *
         * If the region code is not given, the first region of the selected country is selected.
         *
         * This function also sets the selected country if the given country code is not the same as the currently selected country.
         *
         * @param widgetID The ID of the widget for which the selected region is changed.
         * @param countrycode The code of the country which the region belongs to.
         * @param regioncode The code of the region to select.
         * @returns Promise
         */
        setSelectedRegion: async function (widgetID, countrycode, regioncode) {
            let instance = this.visSkiinfo[widgetID].instance;
            this.visSkiinfo.debug && console.log(`setSelectedRegion ${widgetID} ${countrycode} ${regioncode}`);
            if (countrycode) {
                this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata.find(
                    country => country.code == countrycode,
                );
                if (this.visSkiinfo[widgetID].selectedCountry.loaded == false) {
                    this.visSkiinfo[instance].data = await this.visSkiinfo.getServerCountryData(
                        this.visSkiinfo[widgetID].instance,
                        this.visSkiinfo[widgetID].selectedCountry.code,
                    );
                    this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata.find(
                        country => country.code == countrycode,
                    );
                }
            } else {
                this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata[0];
            }
            if (regioncode) {
                this.visSkiinfo[widgetID].selectedRegion = this.visSkiinfo[widgetID].selectedCountry.regions.find(
                    region => region.code == regioncode,
                );
                if (this.visSkiinfo[widgetID].selectedRegion.loaded == false) {
                    this.visSkiinfo[instance].data = await this.visSkiinfo.getServerRegionData(
                        this.visSkiinfo[widgetID].instance,
                        this.visSkiinfo[widgetID].selectedCountry.code,
                        this.visSkiinfo[widgetID].selectedRegion.code,
                    );
                    this.visSkiinfo[widgetID].selectedRegion = this.visSkiinfo[widgetID].selectedCountry.regions.find(
                        region => region.code == regioncode,
                    );
                }
            } else {
                this.visSkiinfo[widgetID].selectedRegion = this.visSkiinfo[widgetID].selectedCountry.regions[0];
            }
        },
    },
    favorites: {
        /**
         * Creates a widget for the specified widget ID, view, data, and style.
         * If the widget element is not found, the function retries after a delay.
         * Loads instance and skiinfo_oid information, initializes necessary data structures,
         * retrieves ski data if not already available, and sets the selected country.
         * Finally, it renders the widget.
         *
         * @param widgetID - The ID of the widget to create.
         * @param view - The view in which the widget is being created.
         * @param data - Data object containing skiinfo_oid and other relevant information.
         * @param style - The style to apply to the widget.
         */
        createWidget: async function (widgetID, view, data, style) {
            var $div = $(`#${widgetID}`);
            // if nothing found => wait
            if (!$div.length) {
                return setTimeout(function () {
                    vis.binds['skiinfo'].favorites.createWidget(widgetID, view, data, style);
                }, 100);
            }
            this.visSkiinfo = vis.binds['skiinfo'];
            if (!data.skiinfo_oid || data.skiinfo_oid == '') {
                return;
            }
            let [instance, skiinfo_oid] = this.visSkiinfo.getInstanceInfo(data.skiinfo_oid);
            if (!skiinfo_oid && !instance) {
                return;
            }
            if (!this.visSkiinfo[widgetID]) {
                this.visSkiinfo[widgetID] = {
                    // 0=default,1=asc,2=desc
                    sortState: {
                        thname: 0,
                        thvalley: 0,
                        thmountain: 0,
                        thnew: 0,
                        thlift: 0,
                        thupdate: 0,
                    },
                };
            }
            this.visSkiinfo[widgetID].wdata = data;
            this.visSkiinfo[widgetID].instance = instance;
            if (!this.visSkiinfo[instance].data) {
                this.visSkiinfo[instance].data = await this.visSkiinfo.getServerSkiData(instance);
                if (!this.visSkiinfo[instance].data.favorites) {
                    this.visSkiinfo[instance].data.favorites = [];
                }
            }
            let config = data['skiinfo_oid'] ? JSON.parse(vis.states.attr(`${data['skiinfo_oid']}.val`)) : [];

            this.visSkiinfo[instance].data.favorites = config.favorites || [];

            /**
             * called when the bound state changes
             *
             * @param e jquery event
             * @param newVal the new value of the bound state as string
             * param [oldVal] the old value of the bound state as string
             */
            function onChange(e, newVal /* , oldVal */) {
                vis.binds['skiinfo'][instance].data.favorites = JSON.parse(newVal).favorites;
                vis.binds['skiinfo'].favorites.render(widgetID);
            }
            if (data.skiinfo_oid) {
                vis.states.bind(`${data.skiinfo_oid}.val`, onChange);
                //remember bound state that vis can release if didnt needed
                $div.data('bound', [`${data.skiinfo_oid}.val`]);
                //remember onchange handler to release bound states
                $div.data('bindHandler', onChange);
            }
            this.render(widgetID);
        },
        /**
         * renders the skiinfo widget for the specified widget ID
         * constructs the HTML structure and style, including tables for countries, regions, and areas
         * adds click event handlers to elements for interactivity
         *
         * @param widgetID - The ID of the widget to render.
         */
        async render(widgetID) {
            this.visSkiinfo.debug && console.log(`favorites render ${widgetID}`);
            let instance = this.visSkiinfo[widgetID].instance;
            let favoritecolor = this.visSkiinfo[widgetID].wdata.favoritecolor || 'red';
            let text = '';
            text += `<style>`;
            text += `.skiinfo.${widgetID}.container {\n`;
            text += '   display: flex; \n';
            text += '   height: 100%; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID}.flexcontainer {\n`;
            text += '   overflow: auto; \n';
            text += '   scrollbar-width: thin; \n';
            text += '   margin: 0px 0px 0px 2px; \n';
            text += '} \n';

            text += `.skiinfo.${widgetID}.areas .favorite {\n`;
            text += '   cursor: pointer;\n';
            text += '   padding-right: 5px; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID}.areas .tharea {\n`;
            text += '   cursor: pointer;\n';
            text += '} \n';
            text += `.skiinfo.${widgetID}.areas .favorite.selected {\n`;
            text += `   color: ${favoritecolor}; \n`;

            text += '} \n';
            text += `.skiinfo.${widgetID} table {\n`;
            text += '   white-space: nowrap; \n';
            text += '   border-collapse: separate; \n';
            text += '   border-spacing: 0px 2px; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID} table tr {\n`;
            text += '} \n';
            text += `.skiinfo.${widgetID} table td, .skiinfo.${widgetID} table th {\n`;
            text += '   padding: 2px 8px; \n';
            text += '   border: solid 1px currentcolor; \n';
            text += '   border-left-width: 0px; \n';
            text += '   border-right-width: 0px; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID} th {\n`;
            text += '   text-align: left; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID} td.selected {\n`;
            text += '   font-weight: bold; \n';
            text += '} \n';

            text += `.skiinfo.${widgetID} table td.txtr {\n`;
            text += '   text-align: right;\n';
            text += '} \n';
            text += `.skiinfo.${widgetID} table td.txtl {\n`;
            text += '   text-align: left;\n';
            text += '} \n';

            text += `.skiinfo.${widgetID} table td:first-child, .skiinfo.${widgetID} table th:first-child {\n`;
            text += '   border-left-width: 1px; \n';
            text += '} \n';
            text += `.skiinfo.${widgetID} table td:last-child, .skiinfo.${widgetID} table th:last-child {\n`;
            text += '   border-right-width: 1px; \n';
            text += '   padding-right: 7px; \n';
            text += '} \n';
            text += `</style>`;

            text += `<div class="skiinfo ${widgetID} container">`;
            text += ` <div class="skiinfo ${widgetID} flexcontainer areas">`;

            text += `  <table>`;
            text += `   <tr>`;
            text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thname">${_('Area')} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState['thname']]}</th>`;
            text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thvalley">${_('Tal')} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState['thvalley']]}</th>`;
            text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thmountain">${_('Berg')} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState['thmountain']]}</th>`;
            text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thnew">${_('Neu')} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState['thnew']]}</th>`;
            text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thlift">${_('Lift')} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState['thlift']]}</th>`;
            text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thupdate">${_('von')} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState['thupdate']]}</th>`;
            text += `   </tr>`;

            let sortkey = '';
            let sortdir = 0;
            for (const item in this.visSkiinfo[widgetID].sortState) {
                if (this.visSkiinfo[widgetID].sortState[item] > 0) {
                    sortkey = item;
                    sortdir = this.visSkiinfo[widgetID].sortState[item];
                }
            }
            /**
             * Function to compare two objects based on the current sort key and sort direction.
             *
             * @param a - first object to compare
             * @param b - second object to compare
             * @returns - positive if a should be sorted before b, negative if a should be sorted after b, 0 if a and b are equal
             */
            const compareFn = (a, b) => {
                let valA, valB, compareType;
                switch (sortkey) {
                    case 'thname':
                        compareType = 'string';
                        valA = a.name;
                        valB = b.name;
                        break;
                    case 'thvalley':
                        compareType = 'number';
                        valA = a.snowValley;
                        valB = b.snowValley;
                        break;
                    case 'thmountain':
                        compareType = 'number';
                        valA = a.snowMountain;
                        valB = b.snowMountain;
                        break;
                    case 'thnew':
                        compareType = 'number';
                        valA = a.freshSnow;
                        valB = b.freshSnow;
                        break;
                    case 'thlift':
                        compareType = 'number';
                        if (a.liftsAll == 0) {
                            valA = Infinity;
                        } else {
                            valA = a.liftsAll / a.liftsOpen;
                        }
                        if (b.liftsAll == 0) {
                            valB = Infinity;
                        } else {
                            valB = b.liftsAll / b.liftsOpen;
                        }
                        [valA, valB] = [valB, valA];
                        break;
                    case 'thupdate':
                        compareType = 'date';
                        valA = a.lastUpdate;
                        valB = b.lastUpdate;
                        break;
                    default:
                        compareType = 'nosort';
                        break;
                }
                switch (sortdir) {
                    case 1:
                        [valA, valB] = [valB, valA];
                        break;
                    case 2:
                        break;
                    default:
                        break;
                }
                switch (compareType) {
                    case 'string':
                        return valA.localeCompare(valB);
                    case 'number':
                        return valA - valB;
                    case 'date':
                        return new Date(valA).getTime() - new Date(valB).getTime();
                    default:
                        return 0;
                }
            };
            let areas = [];
            this.visSkiinfo[instance].data.favorites.forEach(favorite => {
                const country = this.visSkiinfo[instance].data.skiinfodata.find(
                    country =>
                        country.code === favorite.country && country.areas.find(area => area.code === favorite.area),
                );
                if (country) {
                    areas.push(country.areas.find(area => area.code === favorite.area));
                }
            });

            areas.sort(compareFn).map(area => {
                text += `   <tr>`;
                text += `    <td class="txtl"><span class="favorite selected"  data-widgetid="${widgetID}" data-country="${area.country}" data-area="${area.code}">&#x1F7CA;</span>${area.name}</td>`;
                text += `    <td class="txtr">${area.snowValley}</td>`;
                text += `    <td class="txtr">${area.snowMountain}</td>`;
                text += `    <td class="txtr">${area.freshSnow}</td>`;
                text += `    <td class="txtr">${area.liftsOpen}/${area.liftsAll}</td>`;
                text += `    <td class="txtl">${area.lastUpdate}</td>`;
                text += `   </tr>`;
            });
            text += `  </table>`;
            text += ` </div>`;
            text += `</div>`;

            $(`#${widgetID}`).html(text);
            $(`.skiinfo.${widgetID} .tharea`).click(async function () {
                await vis.binds['skiinfo'].favorites.onClickHeadArea(this);
            });
            $(`.skiinfo.${widgetID}.areas .favorite`).click(async function () {
                await vis.binds['skiinfo'].favorites.onClickFavorite(this);
            });
        },
        /**
         * Event handler for clicking on a table header in the area list.
         *
         * @param el The HTML element that was clicked.
         * @returns Promise
         *
         * This function toggles the sort order of the area list by the sort key
         * that was clicked and then calls the render function to update the
         * widget.
         */
        onClickHeadArea: async function (el) {
            let sortkey = $(el).attr('data-sort');
            let widgetID = $(el).attr('data-widgetid');
            this.visSkiinfo.debug && console.log(`onClickHeadArea ${widgetID} ${sortkey}`);
            vis.binds['skiinfo'].toggleSort(widgetID, sortkey);
            this.render(widgetID);
        },
        /**
         * Event handler for clicking on a favorite icon.
         *
         * @param el The HTML element that was clicked.
         * @returns Promise
         *
         * This function toggles the favorite status of the clicked area and then
         * calls the render function to update the widget.
         */
        onClickFavorite: async function (el) {
            let widgetID = $(el).attr('data-widgetid');
            let instance = this.visSkiinfo[widgetID].instance;
            let country = $(el).attr('data-country');
            let area = $(el).attr('data-area');
            if (!this.visSkiinfo[instance].data.favorites) {
                this.visSkiinfo[instance].data.favorites = [];
            }
            let index = this.visSkiinfo[instance].data.favorites.findIndex(
                item => item.country == country && item.area == area,
            );
            if (index !== -1) {
                this.visSkiinfo.debug && console.log(`onClickFavorite ${widgetID} ${country} ${area} fav deleted`);
                this.visSkiinfo[instance].data = await this.visSkiinfo.delServerFavorite(
                    this.visSkiinfo[widgetID].instance,
                    country,
                    area,
                );
            } else {
                this.visSkiinfo.debug && console.log(`onClickFavorite ${widgetID} ${country} ${area} fav added`);
                this.visSkiinfo[instance].data = await this.visSkiinfo.addServerFavorite(
                    this.visSkiinfo[widgetID].instance,
                    country,
                    area,
                );
            }
        },
    },
    /**
     * Toggles the sort state for a specified column in the skiinfo widget.
     *
     * The function iterates through the sort states of all columns, resetting
     * those not matching the provided sort key to their default state (0).
     * The sort state of the specified sort key is then incremented in a cyclic
     * manner through the states: 0 (default), 1 (ascending), and 2 (descending).
     *
     * @param widgetID - The ID of the widget whose sort state is being toggled.
     * @param sortkey - The key representing the column to toggle the sort state for.
     */
    toggleSort: function (widgetID, sortkey) {
        this.visSkiinfo.debug && console.log(`toggleSort ${widgetID} ${sortkey}`);
        for (const item in vis.binds['skiinfo'][widgetID].sortState) {
            if (item !== sortkey) {
                vis.binds['skiinfo'][widgetID].sortState[item] = 0;
            }
        }
        vis.binds['skiinfo'][widgetID].sortState[sortkey] = (vis.binds['skiinfo'][widgetID].sortState[sortkey] + 1) % 3;
    },
    /**
     * Sends a request to the server to fetch the current ski data for all countries, regions, and areas.
     *
     * @param instance - The instance ID of the adapter.
     * @returns - A promise that resolves to the ski data.
     */
    getServerSkiData: async function (instance) {
        this.visSkiinfo.debug && console.log(`getServerSkiData request`);
        return await this.sendToAsync(instance, 'getServerSkiData', {});
    },
    /**
     * Sends a request to the server to fetch the current ski data for a specific country.
     *
     * @param instance - The instance ID of the adapter.
     * @param countrycode - The code of the country to fetch data for.
     * @returns - A promise that resolves to the ski data.
     */
    getServerCountryData: async function (instance, countrycode) {
        this.visSkiinfo.debug && console.log(`getServerCountryData request`);
        return await this.sendToAsync(instance, 'getServerCountryData', {
            countrycode: countrycode,
        });
    },
    /**
     * Sends a request to the server to fetch the current ski data for a specific region.
     *
     * @param instance - The instance ID of the adapter.
     * @param countrycode - The code of the country to fetch data for.
     * @param regioncode - The code of the region to fetch data for.
     * @returns - A promise that resolves to the ski data.
     */
    getServerRegionData: async function (instance, countrycode, regioncode) {
        this.visSkiinfo.debug && console.log(`getServerRegionData request`);
        return await this.sendToAsync(instance, 'getServerRegionData', {
            countrycode: countrycode,
            regioncode: regioncode,
        });
    },
    /**
     * Sends a request to the server to add a favorite ski area.
     *
     * @param instance - The instance ID of the adapter.
     * @param countrycode - The code of the country to add the favorite for.
     * @param areacode - The code of the area to add as a favorite.
     * @returns - A promise that resolves to the ski data.
     */
    addServerFavorite: async function (instance, countrycode, areacode) {
        this.visSkiinfo.debug && console.log(`addServerFavorite request`);
        return await this.sendToAsync(instance, 'addServerFavorite', {
            countrycode: countrycode,
            areacode: areacode,
        });
    },
    /**
     * Sends a request to the server to remove a favorite ski area.
     *
     * @param instance - The instance ID of the adapter.
     * @param countrycode - The code of the country to remove the favorite for.
     * @param areacode - The code of the area to remove as a favorite.
     * @returns - A promise that resolves to the ski data.
     */
    delServerFavorite: async function (instance, countrycode, areacode) {
        this.visSkiinfo.debug && console.log(`delServerFavorite request`);
        return await this.sendToAsync(instance, 'delServerFavorite', {
            countrycode: countrycode,
            areacode: areacode,
        });
    },
    /**
     * Sends a request to the server and returns a promise that resolves when the server responds.
     *
     * @param instance - The instance ID of the adapter.
     * @param command - The command to send to the server.
     * @param sendData - The data to send to the server.
     * @returns - A promise that resolves to the response data.
     */
    sendToAsync: function (instance, command, sendData) {
        this.visSkiinfo.debug && console.log(`sendToAsync ${command} ${JSON.stringify(sendData)}`);
        return new Promise((resolve, reject) => {
            try {
                vis.conn.sendTo(instance, command, sendData, function (receiveData) {
                    resolve(receiveData);
                });
            } catch (error) {
                reject(error);
            }
        });
    },
    /**
     * Extracts and returns the instance and skiinfo ID from a given object ID.
     *
     * This function splits the provided object ID (oid) into parts and forms
     * two identifiers: the instance and the skiinfo ID. If the oid contains
     * fewer than two parts, it returns [null, null].
     *
     * @param oid - The object ID to process, expected to be a string with dot-separated segments.
     * @returns An array with two elements:
     *          - The first element is the instance identifier formed by joining the first two parts.
     *          - The second element is the skiinfo ID formed by joining the first three parts.
     *          If the oid has fewer than two parts, returns [null, null].
     */
    getInstanceInfo: function (oid) {
        this.visSkiinfo = vis.binds['skiinfo'];
        this.visSkiinfo.debug && console.log('getInstanceInfo');
        let idParts = oid.trim().split('.');
        if (idParts.length < 2) {
            return [null, null];
        }
        return [
            idParts.slice(0, 2).join('.'), // instance
            idParts.slice(0, 3).join('.'), // skiinfo id
        ];
    },
};

vis.binds['skiinfo'].showVersion();
