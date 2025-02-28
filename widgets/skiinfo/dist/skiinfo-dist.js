"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // skiinfo/i18n/translations.json
  var require_translations = __commonJS({
    "skiinfo/i18n/translations.json"(exports, module) {
      module.exports = {
        Land: {
          en: "Country",
          de: "Land",
          ru: "\u0421\u0442\u0440\u0430\u043D\u0430",
          pt: "Pa\xEDs",
          nl: "Land",
          fr: "Pays",
          it: "Paese",
          es: "Pa\xEDs",
          pl: "Kraj",
          uk: "\u041A\u0440\u0430\u0457\u043D\u0430",
          "zh-cn": "Country"
        },
        Region: {
          en: "Region",
          de: "Region",
          ru: "\u0420\u0435\u0433\u0438\u043E\u043D",
          pt: "Regi\xE3o",
          nl: "Regio",
          fr: "R\xE9gion",
          it: "Regione",
          es: "Regi\xF3n",
          pl: "Region",
          uk: "\u0420\u0435\u0433\u0456\u043E\u043D",
          "zh-cn": "Region"
        },
        Area: {
          en: "Area",
          de: "Bereich",
          ru: "\u041E\u0431\u043B\u0430\u0441\u0442\u044C",
          pt: "\xC1rea",
          nl: "Gebied",
          fr: "Zone",
          it: "Area",
          es: "Zona",
          pl: "Obszar",
          uk: "\u041F\u043B\u043E\u0449\u0430",
          "zh-cn": "Area"
        },
        Tal: {
          en: "Valley",
          de: "Tal",
          ru: "\u0414\u043E\u043B\u0438\u043D\u0430",
          pt: "Vale",
          nl: "Vallei",
          fr: "Vall\xE9e",
          it: "Valle",
          es: "Valle",
          pl: "Dolina",
          uk: "\u0414\u043E\u043B\u0438\u043D\u0430",
          "zh-cn": "Valley"
        },
        Berg: {
          en: "Mountain",
          de: "Berg",
          ru: "\u0413\u043E\u0440\u0430",
          pt: "Montanha",
          nl: "Berg",
          fr: "Montagne",
          it: "Montagna",
          es: "Monta\xF1a",
          pl: "G\xF3ra",
          uk: "\u0413\u043E\u0440\u0430",
          "zh-cn": "Mountain"
        },
        Neu: {
          en: "Fresh",
          de: "Frisch",
          ru: "\u0421\u0432\u0435\u0436\u0438\u0435",
          pt: "Fresco",
          nl: "Vers",
          fr: "Frais",
          it: "Fresco",
          es: "Fresco",
          pl: "\u015Awie\u017Cy",
          uk: "\u0421\u0432\u0456\u0436\u0438\u0439",
          "zh-cn": "Fresh"
        },
        Lift: {
          en: "Lift",
          de: "Aufzug",
          ru: "\u041F\u043E\u0434\u044A\u0435\u043C\u043D\u0438\u043A",
          pt: "Elevador",
          nl: "Lift",
          fr: "Ascenseur",
          it: "Sollevare",
          es: "Ascensor",
          pl: "Podnoszenie",
          uk: "\u041F\u0456\u0434\u0439\u043E\u043C!",
          "zh-cn": "Lift"
        },
        von: {
          en: "date of",
          de: "Datum von",
          ru: "\u0434\u0430\u0442\u0430",
          pt: "data de",
          nl: "datum van",
          fr: "date de",
          it: "data di",
          es: "fecha de",
          pl: "data",
          uk: "\u0434\u0430\u0442\u0430",
          "zh-cn": "date of"
        }
      };
    }
  });

  // ../package.json
  var version = "0.0.1";

  // skiinfo/js/skiinfo.js
  var translations = require_translations();
  $.extend(true, systemDictionary, translations);
  vis.binds["skiinfo"] = {
    version,
    showVersion: function() {
      if (vis.binds["skiinfo"].version) {
        console.log(`Version skiinfo: ${vis.binds["skiinfo"].version}`);
        vis.binds["skiinfo"].version = null;
      }
    },
    data: null,
    sortarrows: {
      0: "&nbsp;",
      1: "&darr;",
      2: "&uarr;"
    },
    browser: {
      createWidget: function(widgetID, view, data, style) {
        return __async(this, null, function* () {
          var $div = $(`#${widgetID}`);
          if (!$div.length) {
            return setTimeout(function() {
              vis.binds["skiinfo"].browser.createWidget(widgetID, view, data, style);
            }, 100);
          }
          this.visSkiinfo = vis.binds["skiinfo"];
          if (!data.skiinfo_oid || data.skiinfo_oid == "") {
            return;
          }
          let [instance, skiinfo_oid] = this.visSkiinfo.getInstanceInfo(data.skiinfo_oid);
          if (!skiinfo_oid && !instance) {
            return;
          }
          console.log("Load Data");
          if (!this.visSkiinfo[instance]) {
            this.visSkiinfo[instance] = {
              data: null
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
                thupdate: 0
              }
            };
          }
          this.visSkiinfo[widgetID].instance = instance;
          if (!this.visSkiinfo[instance].data) {
            this.visSkiinfo[instance].data = yield this.visSkiinfo.getServerSkiData(instance, widgetID);
            if (!this.visSkiinfo[instance].data.favorites) {
              this.visSkiinfo[instance].data.favorites = [];
            }
          }
          if (!this.visSkiinfo[widgetID].selectedCountry) {
            yield this.setSelectedCountry(widgetID);
          }
          this.render(widgetID);
        });
      },
      render(widgetID) {
        return __async(this, null, function* () {
          let instance = this.visSkiinfo[widgetID].instance;
          let text = "";
          text += `<style>`;
          text += `.skiinfo.${widgetID}.container {
`;
          text += "   display: flex; \n";
          text += "   height: 100%; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.flexcontainer {
`;
          text += "   overflow: auto; \n";
          text += "   scrollbar-width: thin; \n";
          text += "   margin: 0px 0px 0px 2px; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.countries {
`;
          text += "} \n";
          text += `.skiinfo.${widgetID}.countries.scroll {
`;
          text += "} \n";
          text += `.skiinfo.${widgetID} ul {
`;
          text += "   list-style-type: none; \n";
          text += "   padding: 0px; \n";
          text += "   margin: 0px; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} li {
`;
          text += "   border: solid 1px;\n";
          text += "   border-color: currentcolor;\n";
          text += "   padding: 2px 8px;\n";
          text += "   margin: 2px 0px;\n";
          text += "   cursor: pointer;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.regions {
`;
          text += "} \n";
          text += `.skiinfo.${widgetID}.regions.scroll {
`;
          text += "} \n";
          text += `.skiinfo.${widgetID}.regions li.selected {
`;
          text += "   font-weight: bold; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .favorite {
`;
          text += "   cursor: pointer;\n";
          text += "   padding-right: 5px; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .tharea {
`;
          text += "   cursor: pointer;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .favorite.selected {
`;
          text += "   color: red; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} table {
`;
          text += "   white-space: nowrap; \n";
          text += "   border-collapse: separate; \n";
          text += "   border-spacing: 0px 2px; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} table tr {
`;
          text += "} \n";
          text += `.skiinfo.${widgetID} table td, .skiinfo.${widgetID} table th {
`;
          text += "   padding: 2px 8px; \n";
          text += "   border: solid 1px currentcolor; \n";
          text += "   border-left-width: 0px; \n";
          text += "   border-right-width: 0px; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} th {
`;
          text += "   text-align: left; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} td.selected {
`;
          text += "   font-weight: bold; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} table td.txtr {
`;
          text += "   text-align: right;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID} table td.txtl {
`;
          text += "   text-align: left;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.countries table td, .skiinfo.${widgetID}.regions table td {
`;
          text += "   cursor: pointer;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID} table td:first-child, .skiinfo.${widgetID} table th:first-child {
`;
          text += "   border-left-width: 1px; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} table td:last-child, .skiinfo.${widgetID} table th:last-child {
`;
          text += "   border-right-width: 1px; \n";
          text += "   padding-right: 7px; \n";
          text += "} \n";
          text += `</style>`;
          text += `<div class="skiinfo ${widgetID} container">`;
          text += ` <div class="skiinfo ${widgetID} flexcontainer countries">`;
          text += `  <table>`;
          text += `   <tr>`;
          text += `    <th>${_("Land")}</th>`;
          text += `   </tr>`;
          this.visSkiinfo[instance].data.skiinfodata.map((country) => {
            text += `   <tr>`;
            text += `    <td 
                 data-code="${country.code}" 
                 data-widgetid="${widgetID}" 
                 ${country.code == this.visSkiinfo[widgetID].selectedCountry.code ? 'class="selected"' : ""}
                >${country.name}</td>`;
            text += `   </tr>`;
          });
          text += `  </table>`;
          text += ` </div>`;
          text += ` <div class="skiinfo ${widgetID} flexcontainer regions">`;
          text += `  <table>`;
          text += `   <tr>`;
          text += `    <th>${_("Region")}</th>`;
          text += `   </tr>`;
          this.visSkiinfo[widgetID].selectedCountry.regions.map((region) => {
            text += `   <tr>`;
            text += `    <td 
                 data-code="${region.code}" 
                 data-widgetid="${widgetID}" 
                 data-country="${this.visSkiinfo[widgetID].selectedCountry.code}" 
                 ${region.code == this.visSkiinfo[widgetID].selectedRegion.code ? 'class="selected"' : ""}
                >${region.name}</td>`;
            text += `   </tr>`;
          });
          text += `  </table>`;
          text += ` </div>`;
          text += ` <div class="skiinfo ${widgetID} flexcontainer areas">`;
          text += `  <table>`;
          text += `   <tr>`;
          text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thname">${_("Area")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thname"]]}</th>`;
          text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thvalley">${_("Tal")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thvalley"]]}</th>`;
          text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thmountain">${_("Berg")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thmountain"]]}</th>`;
          text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thnew">${_("Neu")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thnew"]]}</th>`;
          text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thlift">${_("Lift")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thlift"]]}</th>`;
          text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thupdate">${_("von")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thupdate"]]}</th>`;
          text += `   </tr>`;
          let sortkey = "";
          let sortdir = 0;
          for (const item in this.visSkiinfo[widgetID].sortState) {
            if (this.visSkiinfo[widgetID].sortState[item] > 0) {
              sortkey = item;
              sortdir = this.visSkiinfo[widgetID].sortState[item];
            }
          }
          const compareFn = (a, b) => {
            let valA, valB, compareType;
            switch (sortkey) {
              case "thname":
                compareType = "string";
                valA = a.name;
                valB = b.name;
                break;
              case "thvalley":
                compareType = "number";
                valA = a.snowValley;
                valB = b.snowValley;
                break;
              case "thmountain":
                compareType = "number";
                valA = a.snowMountain;
                valB = b.snowMountain;
                break;
              case "thnew":
                compareType = "number";
                valA = a.freshSnow;
                valB = b.freshSnow;
                break;
              case "thlift":
                compareType = "number";
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
              case "thupdate":
                compareType = "date";
                valA = a.lastUpdate;
                valB = b.lastUpdate;
                break;
              default:
                compareType = "nosort";
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
              case "string":
                return valA.localeCompare(valB);
              case "number":
                return valA - valB;
              case "date":
                return new Date(valA).getTime() - new Date(valB).getTime();
              default:
                return 0;
            }
          };
          this.visSkiinfo[widgetID].selectedCountry.areas.filter((area) => area.region == this.visSkiinfo[widgetID].selectedRegion.code).sort(compareFn).map((area) => {
            let selected = this.visSkiinfo[instance].data.favorites.findIndex(
              (item) => item.country == this.visSkiinfo[widgetID].selectedCountry.code && item.area == area.code
            ) == -1 ? false : true;
            text += `   <tr>`;
            text += `    <td class="txtl"><span class="favorite ${selected ? "selected" : ""}"  data-widgetid="${widgetID}" data-country="${this.visSkiinfo[widgetID].selectedCountry.code}" data-area="${area.code}">&#x1F7CA;</span>${area.name}</td>`;
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
          $(`.skiinfo.${widgetID}.countries td`).click(function() {
            return __async(this, null, function* () {
              yield vis.binds["skiinfo"].browser.onClickCountry(this);
            });
          });
          $(`.skiinfo.${widgetID}.regions td`).click(function() {
            return __async(this, null, function* () {
              yield vis.binds["skiinfo"].browser.onClickRegion(this);
            });
          });
          $(`.skiinfo.${widgetID} .tharea`).click(function() {
            return __async(this, null, function* () {
              yield vis.binds["skiinfo"].browser.onClickHeadArea(this);
            });
          });
          $(`.skiinfo.${widgetID}.areas .favorite`).click(function() {
            return __async(this, null, function* () {
              yield vis.binds["skiinfo"].browser.onClickFavorite(this);
            });
          });
        });
      },
      onClickCountry: function(el) {
        return __async(this, null, function* () {
          let code = $(el).attr("data-code");
          let widgetID = $(el).attr("data-widgetid");
          yield this.setSelectedCountry(widgetID, code);
          this.render(widgetID);
        });
      },
      onClickRegion: function(el) {
        return __async(this, null, function* () {
          let code = $(el).attr("data-code");
          let countrycode = $(el).attr("data-country");
          let widgetID = $(el).attr("data-widgetid");
          yield this.setSelectedRegion(widgetID, countrycode, code);
          this.render(widgetID);
        });
      },
      onClickHeadArea: function(el) {
        return __async(this, null, function* () {
          let sortkey = $(el).attr("data-sort");
          let widgetID = $(el).attr("data-widgetid");
          vis.binds["skiinfo"].toggleSort(widgetID, sortkey);
          this.render(widgetID);
        });
      },
      onClickFavorite: function(el) {
        return __async(this, null, function* () {
          let widgetID = $(el).attr("data-widgetid");
          let instance = this.visSkiinfo[widgetID].instance;
          let country = $(el).attr("data-country");
          let area = $(el).attr("data-area");
          if (!this.visSkiinfo[instance].data.favorites) {
            this.visSkiinfo[instance].data.favorites = [];
          }
          let index = this.visSkiinfo[instance].data.favorites.findIndex(
            (item) => item.country == country && item.area == area
          );
          if (index !== -1) {
            this.visSkiinfo[instance].data = yield this.visSkiinfo.delServerFavorite(
              this.visSkiinfo[widgetID].instance,
              widgetID,
              country,
              area
            );
          } else {
            this.visSkiinfo[instance].data = yield this.visSkiinfo.addServerFavorite(
              this.visSkiinfo[widgetID].instance,
              widgetID,
              country,
              area
            );
          }
          this.render(widgetID);
        });
      },
      setSelectedCountry: function(widgetID, countrycode) {
        return __async(this, null, function* () {
          let instance = this.visSkiinfo[widgetID].instance;
          if (countrycode) {
            this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata.find(
              (country) => country.code == countrycode
            );
            if (this.visSkiinfo[widgetID].selectedCountry.loaded == false) {
              this.visSkiinfo[instance].data = yield this.visSkiinfo.getServerCountryData(
                this.visSkiinfo[widgetID].instance,
                widgetID,
                this.visSkiinfo[widgetID].selectedCountry.code
              );
              this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata.find(
                (country) => country.code == countrycode
              );
            }
            this.visSkiinfo[widgetID].selectedRegion = this.visSkiinfo[widgetID].selectedCountry.regions[0];
          } else {
            this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata[0];
            this.visSkiinfo[widgetID].selectedRegion = this.visSkiinfo[widgetID].selectedCountry.regions[0];
          }
        });
      },
      setSelectedRegion: function(widgetID, countrycode, regioncode) {
        return __async(this, null, function* () {
          let instance = this.visSkiinfo[widgetID].instance;
          if (countrycode) {
            this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata.find(
              (country) => country.code == countrycode
            );
            if (this.visSkiinfo[widgetID].selectedCountry.loaded == false) {
              this.visSkiinfo[instance].data = yield this.visSkiinfo.getServerCountryData(
                this.visSkiinfo[widgetID].instance,
                widgetID,
                this.visSkiinfo[widgetID].selectedCountry.code
              );
              this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata.find(
                (country) => country.code == countrycode
              );
            }
          } else {
            this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata[0];
          }
          if (regioncode) {
            this.visSkiinfo[widgetID].selectedRegion = this.visSkiinfo[widgetID].selectedCountry.regions.find(
              (region) => region.code == regioncode
            );
            if (this.visSkiinfo[widgetID].selectedRegion.loaded == false) {
              this.visSkiinfo[instance].data = yield this.visSkiinfo.getServerRegionData(
                this.visSkiinfo[widgetID].instance,
                widgetID,
                this.visSkiinfo[widgetID].selectedCountry.code,
                this.visSkiinfo[widgetID].selectedRegion.code
              );
              this.visSkiinfo[widgetID].selectedRegion = this.visSkiinfo[widgetID].selectedCountry.regions.find(
                (region) => region.code == regioncode
              );
            }
          } else {
            this.visSkiinfo[widgetID].selectedRegion = this.visSkiinfo[widgetID].selectedCountry.regions[0];
          }
        });
      }
    },
    favorites: {
      createWidget: function(widgetID, view, data, style) {
        return __async(this, null, function* () {
          var $div = $(`#${widgetID}`);
          if (!$div.length) {
            return setTimeout(function() {
              vis.binds["skiinfo"].favorites.createWidget(widgetID, view, data, style);
            }, 100);
          }
          this.visSkiinfo = vis.binds["skiinfo"];
          if (!data.skiinfo_oid || data.skiinfo_oid == "") {
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
                thupdate: 0
              }
            };
          }
          this.visSkiinfo[widgetID].instance = instance;
          if (!this.visSkiinfo[instance].data) {
            this.visSkiinfo[instance].data = yield this.visSkiinfo.getServerSkiData(instance, widgetID);
            if (!this.visSkiinfo[instance].data.favorites) {
              this.visSkiinfo[instance].data.favorites = [];
            }
          }
          let config = data["skiinfo_oid"] ? JSON.parse(vis.states.attr(`${data["skiinfo_oid"]}.val`)) : [];
          this.visSkiinfo[instance].data.favorites = config.favorites || [];
          function onChange(e, newVal) {
            vis.binds["skiinfo"][instance].data.favorites = JSON.parse(newVal).favorites;
            vis.binds["skiinfo"].favorites.render(widgetID);
          }
          if (data.skiinfo_oid) {
            vis.states.bind(`${data.skiinfo_oid}.val`, onChange);
            $div.data("bound", [`${data.skiinfo_oid}.val`]);
            $div.data("bindHandler", onChange);
          }
          this.render(widgetID);
        });
      },
      render(widgetID) {
        return __async(this, null, function* () {
          let instance = this.visSkiinfo[widgetID].instance;
          let text = "";
          text += `<style>`;
          text += `.skiinfo.${widgetID}.container {
`;
          text += "   display: flex; \n";
          text += "   height: 100%; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.flexcontainer {
`;
          text += "   overflow: auto; \n";
          text += "   scrollbar-width: thin; \n";
          text += "   margin: 0px 0px 0px 2px; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .favorite {
`;
          text += "   cursor: pointer;\n";
          text += "   padding-right: 5px; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .tharea {
`;
          text += "   cursor: pointer;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .favorite.selected {
`;
          text += "   color: red; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} table {
`;
          text += "   white-space: nowrap; \n";
          text += "   border-collapse: separate; \n";
          text += "   border-spacing: 0px 2px; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} table tr {
`;
          text += "} \n";
          text += `.skiinfo.${widgetID} table td, .skiinfo.${widgetID} table th {
`;
          text += "   padding: 2px 8px; \n";
          text += "   border: solid 1px currentcolor; \n";
          text += "   border-left-width: 0px; \n";
          text += "   border-right-width: 0px; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} th {
`;
          text += "   text-align: left; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} td.selected {
`;
          text += "   font-weight: bold; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} table td.txtr {
`;
          text += "   text-align: right;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID} table td.txtl {
`;
          text += "   text-align: left;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID} table td:first-child, .skiinfo.${widgetID} table th:first-child {
`;
          text += "   border-left-width: 1px; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} table td:last-child, .skiinfo.${widgetID} table th:last-child {
`;
          text += "   border-right-width: 1px; \n";
          text += "   padding-right: 7px; \n";
          text += "} \n";
          text += `</style>`;
          text += `<div class="skiinfo ${widgetID} container">`;
          text += ` <div class="skiinfo ${widgetID} flexcontainer areas">`;
          text += `  <table>`;
          text += `   <tr>`;
          text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thname">${_("Area")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thname"]]}</th>`;
          text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thvalley">${_("Tal")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thvalley"]]}</th>`;
          text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thmountain">${_("Berg")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thmountain"]]}</th>`;
          text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thnew">${_("Neu")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thnew"]]}</th>`;
          text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thlift">${_("Lift")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thlift"]]}</th>`;
          text += `    <th class="thsort tharea" data-widgetid="${widgetID}" data-sort="thupdate">${_("von")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thupdate"]]}</th>`;
          text += `   </tr>`;
          let sortkey = "";
          let sortdir = 0;
          for (const item in this.visSkiinfo[widgetID].sortState) {
            if (this.visSkiinfo[widgetID].sortState[item] > 0) {
              sortkey = item;
              sortdir = this.visSkiinfo[widgetID].sortState[item];
            }
          }
          const compareFn = (a, b) => {
            let valA, valB, compareType;
            switch (sortkey) {
              case "thname":
                compareType = "string";
                valA = a.name;
                valB = b.name;
                break;
              case "thvalley":
                compareType = "number";
                valA = a.snowValley;
                valB = b.snowValley;
                break;
              case "thmountain":
                compareType = "number";
                valA = a.snowMountain;
                valB = b.snowMountain;
                break;
              case "thnew":
                compareType = "number";
                valA = a.freshSnow;
                valB = b.freshSnow;
                break;
              case "thlift":
                compareType = "number";
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
              case "thupdate":
                compareType = "date";
                valA = a.lastUpdate;
                valB = b.lastUpdate;
                break;
              default:
                compareType = "nosort";
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
              case "string":
                return valA.localeCompare(valB);
              case "number":
                return valA - valB;
              case "date":
                return new Date(valA).getTime() - new Date(valB).getTime();
              default:
                return 0;
            }
          };
          let areas = [];
          this.visSkiinfo[instance].data.favorites.forEach((favorite) => {
            const country = this.visSkiinfo[instance].data.skiinfodata.find(
              (country2) => country2.code === favorite.country && country2.areas.find((area) => area.code === favorite.area)
            );
            if (country) {
              areas.push(country.areas.find((area) => area.code === favorite.area));
            }
          });
          areas.sort(compareFn).map((area) => {
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
          $(`.skiinfo.${widgetID} .tharea`).click(function() {
            return __async(this, null, function* () {
              yield vis.binds["skiinfo"].favorites.onClickHeadArea(this);
            });
          });
          $(`.skiinfo.${widgetID}.areas .favorite`).click(function() {
            return __async(this, null, function* () {
              yield vis.binds["skiinfo"].favorites.onClickFavorite(this);
            });
          });
        });
      },
      onClickHeadArea: function(el) {
        return __async(this, null, function* () {
          let sortkey = $(el).attr("data-sort");
          let widgetID = $(el).attr("data-widgetid");
          vis.binds["skiinfo"].toggleSort(widgetID, sortkey);
          this.render(widgetID);
        });
      },
      onClickFavorite: function(el) {
        return __async(this, null, function* () {
          let widgetID = $(el).attr("data-widgetid");
          let instance = this.visSkiinfo[widgetID].instance;
          let country = $(el).attr("data-country");
          let area = $(el).attr("data-area");
          if (!this.visSkiinfo[instance].data.favorites) {
            this.visSkiinfo[instance].data.favorites = [];
          }
          let index = this.visSkiinfo[instance].data.favorites.findIndex(
            (item) => item.country == country && item.area == area
          );
          if (index !== -1) {
            this.visSkiinfo[instance].data = yield this.visSkiinfo.delServerFavorite(
              this.visSkiinfo[widgetID].instance,
              widgetID,
              country,
              area
            );
          } else {
            this.visSkiinfo[instance].data = yield this.visSkiinfo.addServerFavorite(
              this.visSkiinfo[widgetID].instance,
              widgetID,
              country,
              area
            );
          }
        });
      }
    },
    toggleSort: function(widgetID, sortkey) {
      for (const item in vis.binds["skiinfo"][widgetID].sortState) {
        if (item !== sortkey) {
          vis.binds["skiinfo"][widgetID].sortState[item] = 0;
        }
      }
      vis.binds["skiinfo"][widgetID].sortState[sortkey] = (vis.binds["skiinfo"][widgetID].sortState[sortkey] + 1) % 3;
    },
    getServerSkiData: function(instance, widgetID) {
      return __async(this, null, function* () {
        console.log(`getServerSkiData request`);
        return yield this.sendToAsync(instance, "getServerSkiData", { widgetID });
      });
    },
    getServerCountryData: function(instance, widgetID, countrycode) {
      return __async(this, null, function* () {
        console.log(`getServerCountryData request`);
        return yield this.sendToAsync(instance, "getServerCountryData", {
          widgetID,
          countrycode
        });
      });
    },
    getServerRegionData: function(instance, widgetID, countrycode, regioncode) {
      return __async(this, null, function* () {
        console.log(`getServerRegionData request`);
        return yield this.sendToAsync(instance, "getServerRegionData", {
          widgetID,
          countrycode,
          regioncode
        });
      });
    },
    addServerFavorite: function(instance, widgetID, countrycode, areacode) {
      return __async(this, null, function* () {
        console.log(`addServerFavorite request`);
        return yield this.sendToAsync(instance, "addServerFavorite", {
          widgetID,
          countrycode,
          areacode
        });
      });
    },
    delServerFavorite: function(instance, widgetID, countrycode, areacode) {
      return __async(this, null, function* () {
        console.log(`delServerFavorite request`);
        return yield this.sendToAsync(instance, "delServerFavorite", {
          widgetID,
          countrycode,
          areacode
        });
      });
    },
    sendToAsync: function(instance, command, sendData) {
      return __async(this, null, function* () {
        console.log(`sendToAsync ${command} ${sendData}`);
        return new Promise((resolve, reject) => {
          try {
            vis.conn.sendTo(instance, command, sendData, function(receiveData) {
              resolve(receiveData);
            });
          } catch (error) {
            reject(error);
          }
        });
      });
    },
    getInstanceInfo: function(oid) {
      console.log("getInstanceInfo");
      let idParts = oid.trim().split(".");
      if (idParts.length < 2) {
        return [null, null];
      }
      return [
        idParts.slice(0, 2).join("."),
        // instance
        idParts.slice(0, 3).join(".")
        // skiinfo id
      ];
    }
  };
  vis.binds["skiinfo"].showVersion();
})();
//# sourceMappingURL=skiinfo-dist.js.map
