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
          de: "Gebiet",
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
          de: "Neuschnee",
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
          de: "Lift",
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
          it: "date of",
          es: "date of",
          pl: "data",
          uk: "\u0434\u0430\u0442\u0430",
          "zh-cn": "date of"
        },
        Suchbegriff: {
          en: "Search term",
          de: "Suchbegriff",
          ru: "\u041F\u043E\u0438\u0441\u043A\u043E\u0432\u044B\u0439 \u0442\u0435\u0440\u043C\u0438\u043D",
          pt: "Termo de pesquisa",
          nl: "Zoekterm",
          fr: "Terme de recherche",
          it: "Termine di ricerca",
          es: "T\xE9rmino de b\xFAsqueda",
          pl: "Wyszukiwane has\u0142o",
          uk: "\u041F\u043E\u0448\u0443\u043A\u043E\u0432\u0438\u0439 \u0437\u0430\u043F\u0438\u0442",
          "zh-cn": "Search term"
        },
        yyy: {
          en: "yyy",
          de: "yyy",
          ru: "yyy",
          pt: "yyy",
          nl: "yyy",
          fr: "aaa",
          it: "aaaa",
          es: "yyy",
          pl: "yyy",
          uk: "yyy",
          "zh-cn": "yyy"
        }
      };
    }
  });

  // ../package.json
  var version = "0.5.0";

  // skiinfo/js/skiinfo.js
  var translations = require_translations();
  $.extend(true, systemDictionary, translations);
  vis.binds["skiinfo"] = {
    version,
    debug: true,
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
          this.visSkiinfo.debug && console.log("Load Data");
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
              },
              filter: false
            };
          }
          this.visSkiinfo[widgetID].wdata = data;
          this.visSkiinfo[widgetID].instance = instance;
          if (!this.visSkiinfo[instance].data) {
            this.visSkiinfo[instance].data = yield this.visSkiinfo.getServerSkiData(instance);
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
      /**
       * Renders the skiinfo widget for the specified widget ID.
       * Constructs the HTML structure and style, including tables for countries, regions, and areas.
       * Adds click event handlers to elements for interactivity.
       *
       * @param widgetID - The ID of the widget to render.
       */
      render(widgetID) {
        return __async(this, null, function* () {
          this.visSkiinfo.debug && console.log(`render browser`);
          let instance = this.visSkiinfo[widgetID].instance;
          let favoritecolor = this.visSkiinfo[widgetID].wdata.favoritecolor || "red";
          let text = "";
          text += `<style>`;
          text += `.skiinfo.${widgetID}.container {
`;
          text += "   display: flex; \n";
          text += "   height: 100%; \n";
          text += "} \n";
          text += `.skiinfo.${widgetID} .icon {
`;
          text += "   line-height: 1em; \n";
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
          text += `.skiinfo.${widgetID}.countries .filter {
`;
          text += "   cursor: pointer;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .tharea {
`;
          text += "   cursor: pointer;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .tharea.thname {
`;
          text += "   text-align: left;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .tharea .thcontent {
`;
          text += "   display: flex;\n";
          text += "   justify-content: space-between;\n";
          text += "   align-items: center;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .tharea .thcontent span{
`;
          text += "   flex: 0 0 auto;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .tharea .thcontent span:first-child{
`;
          text += "   flex: 1;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.countries .thcountries.thname {
`;
          text += "   text-align: left;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.countries .thcountries .thcontent {
`;
          text += "   display: flex;\n";
          text += "   justify-content: space-between;\n";
          text += "   align-items: center;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.countries .thcountries .thcontent span{
`;
          text += "   flex: 0 0 auto;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.countries .thcountries .thcontent span:first-child{
`;
          text += "   flex: 1;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .tharea .thsearchcontent {
`;
          text += "   position: relative;\n";
          text += "   width: 100%;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .tharea .thsearchcontent .thinput {
`;
          text += "   width: 100%;\n";
          text += "   box-sizing: border-box;\n";
          text += "   padding-right: 24px;\n";
          text += "   color: currentColor;\n";
          text += "   background-color: transparent;\n";
          text += "   border-style: solid;\n";
          text += "   border-width: 1px;\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .tharea .thsearchcontent .searchclose {
`;
          text += "   position: absolute;\n";
          text += "   right: 8px;\n";
          text += "   top: 50%;\n";
          text += "   transform: translateY(-50%);\n";
          text += "} \n";
          text += `.skiinfo.${widgetID}.areas .favorite.selected {
`;
          text += `   color: ${favoritecolor}; 
`;
          text += "} \n";
          text += `.skiinfo.${widgetID}.countries .icon.filter.selected {
`;
          text += `   color: ${favoritecolor}; 
`;
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
          text += `.skiinfo.${widgetID} td span.selected {
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
          text += `    <th class="thcountries thname" data-widgetid="${widgetID}"><div class="thcontent"><span>${_("Land")}</span><span class="icon filter ${this.visSkiinfo[widgetID].filter ? "selected" : ""}">&#x1F7CA;</span></div></th>`;
          text += `   </tr>`;
          let countries = this.visSkiinfo[instance].data.skiinfodata;
          countries.map((country2) => {
            let selected = country2.code == this.visSkiinfo[widgetID].selectedCountry;
            let visible = this.visSkiinfo[instance].data.favorites.findIndex((item) => item.country == country2.code) == -1 ? false : true;
            if (this.visSkiinfo[widgetID].filter && !visible) {
              return;
            }
            text += `   <tr>`;
            text += `    <td><span 
                 data-code="${country2.code}" 
                 data-widgetid="${widgetID}" 
                 ${selected ? 'class="selected"' : ""}
                >${country2.name}</span></td>`;
            text += `   </tr>`;
          });
          text += `  </table>`;
          text += ` </div>`;
          text += ` <div class="skiinfo ${widgetID} flexcontainer regions">`;
          text += `  <table>`;
          text += `   <tr>`;
          text += `    <th>${_("Region")}</th>`;
          text += `   </tr>`;
          let country = countries.find((c) => c.code == this.visSkiinfo[widgetID].selectedCountry);
          country.regions.map((region) => {
            let selected = region.code == this.visSkiinfo[widgetID].selectedRegion;
            let visible = this.visSkiinfo[instance].data.favorites.findIndex(
              (item) => item.country == this.visSkiinfo[widgetID].selectedCountry && item.region == region.code
            ) == -1 ? false : true;
            if (this.visSkiinfo[widgetID].filter && !visible) {
              return;
            }
            text += `   <tr>`;
            text += `    <td><span  
                 data-code="${region.code}" 
                 data-widgetid="${widgetID}" 
                 data-country="${this.visSkiinfo[widgetID].selectedCountry}" 
                 ${selected ? 'class="selected"' : ""}
                >${region.name}</span></td>`;
            text += `   </tr>`;
          });
          text += `  </table>`;
          text += ` </div>`;
          text += ` <div class="skiinfo ${widgetID} flexcontainer areas">`;
          text += `  <table>`;
          text += `   <tr>`;
          if (this.visSkiinfo[widgetID].search !== void 0) {
            text += `    <th class="thsort tharea thname" data-widgetid="${widgetID}" data-sort="thname"><div class="thsearchcontent"><input type="text" placeholder="${_("Suchbegriff")}" value="${this.visSkiinfo[widgetID].search}" autofocus="autofocus" class="thinput" /><span class="icon searchclose">&times;</span></div></th>`;
          } else {
            text += `    <th class="thsort tharea thname" data-widgetid="${widgetID}" data-sort="thname"><div class="thcontent"><span>${_("Area")}</span><span class="icon sort">${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thname"]]}</span> <span class="icon search">&#x1F50E;&#xFE0E;</span></div></th>`;
          }
          text += `    <th class="thsort tharea"        data-widgetid="${widgetID}" data-sort="thvalley">${_("Tal")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thvalley"]]}</th>`;
          text += `    <th class="thsort tharea"        data-widgetid="${widgetID}" data-sort="thmountain">${_("Berg")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thmountain"]]}</th>`;
          text += `    <th class="thsort tharea"        data-widgetid="${widgetID}" data-sort="thnew">${_("Neu")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thnew"]]}</th>`;
          text += `    <th class="thsort tharea"        data-widgetid="${widgetID}" data-sort="thlift">${_("Lift")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thlift"]]}</th>`;
          text += `    <th class="thsort tharea"        data-widgetid="${widgetID}" data-sort="thupdate">${_("von")} ${this.visSkiinfo.sortarrows[this.visSkiinfo[widgetID].sortState["thupdate"]]}</th>`;
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
          country.areas.filter((area) => {
            let testregion = area.region == this.visSkiinfo[widgetID].selectedRegion;
            let testname = this.visSkiinfo[widgetID].search !== void 0 ? area.name.toLowerCase().includes(this.visSkiinfo[widgetID].search.toLowerCase()) : true;
            return testregion && testname;
          }).sort(compareFn).map((area) => {
            let selected = this.visSkiinfo[instance].data.favorites.findIndex(
              (item) => item.country == this.visSkiinfo[widgetID].selectedCountry && item.area == area.code
            ) == -1 ? false : true;
            if (this.visSkiinfo[widgetID].filter && !selected) {
              return;
            }
            text += `   <tr>`;
            text += `    <td class="txtl"><span class="icon favorite ${selected ? "selected" : ""}"  data-widgetid="${widgetID}" data-country="${area.country}" data-region="${area.region}" data-area="${area.code}">&#x1F7CA;</span>${area.name} &nbsp;</td>`;
            text += `    <td class="txtr">${area.snowValley} &nbsp;</td>`;
            text += `    <td class="txtr">${area.snowMountain} &nbsp;</td>`;
            text += `    <td class="txtr">${area.freshSnow} &nbsp;</td>`;
            text += `    <td class="txtr">${area.liftsOpen}/${area.liftsAll} &nbsp;</td>`;
            text += `    <td class="txtl">${area.lastUpdate} &nbsp;</td>`;
            text += `   </tr>`;
          });
          text += `  </table>`;
          text += ` </div>`;
          text += `</div>`;
          $(`#${widgetID}`).html(text);
          $(`.skiinfo.${widgetID}.countries td span`).on("click", function() {
            return __async(this, null, function* () {
              yield vis.binds["skiinfo"].browser.onClickCountry(this);
            });
          });
          $(`.skiinfo.${widgetID}.regions td span`).on("click", function() {
            return __async(this, null, function* () {
              yield vis.binds["skiinfo"].browser.onClickRegion(this);
            });
          });
          $(`.skiinfo.${widgetID} .tharea`).on("click", function() {
            return __async(this, null, function* () {
              yield vis.binds["skiinfo"].browser.onClickHeadArea(this);
            });
          });
          $(`.skiinfo.${widgetID} .tharea.thname .icon.search`).on("click", function() {
            return __async(this, null, function* () {
              yield vis.binds["skiinfo"].browser.onClickSearchArea(this);
            });
          });
          $(`.skiinfo.${widgetID}.areas .favorite`).on("click", function() {
            return __async(this, null, function* () {
              yield vis.binds["skiinfo"].browser.onClickFavorite(this);
            });
          });
          $(`.skiinfo.${widgetID} .thcountries.thname .icon.filter`).on("click", function() {
            return __async(this, null, function* () {
              vis.binds["skiinfo"].browser.onClickCountriesFilter(this);
            });
          });
          if (this.visSkiinfo[widgetID].search !== void 0) {
            $(`.skiinfo.${widgetID} .tharea.thname .icon.searchclose`).on("click", function() {
              return __async(this, null, function* () {
                yield vis.binds["skiinfo"].browser.onClickSearchClose(this);
              });
            });
            $(`.skiinfo.${widgetID} .tharea.thname .thinput`).on("change", function() {
              return __async(this, null, function* () {
                yield vis.binds["skiinfo"].browser.onClickDoSearch(this);
              });
            });
            $(`.skiinfo.${widgetID} .tharea.thname .thinput`).focus();
          }
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
      onClickCountry: function(el) {
        return __async(this, null, function* () {
          let code = $(el).attr("data-code");
          let widgetID = $(el).attr("data-widgetid");
          this.visSkiinfo.debug && console.log(`onClickCountry ${widgetID} ${code}`);
          yield this.setSelectedCountry(widgetID, code);
          this.render(widgetID);
        });
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
      onClickRegion: function(el) {
        return __async(this, null, function* () {
          let code = $(el).attr("data-code");
          let countrycode = $(el).attr("data-country");
          let widgetID = $(el).attr("data-widgetid");
          this.visSkiinfo.debug && console.log(`onClickRegion ${widgetID} ${countrycode} ${code}`);
          yield this.setSelectedRegion(widgetID, countrycode, code);
          this.render(widgetID);
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
      onClickHeadArea: function(el) {
        return __async(this, null, function* () {
          let sortkey = $(el).attr("data-sort");
          let widgetID = $(el).attr("data-widgetid");
          if (vis.binds["skiinfo"][widgetID].search !== void 0) {
            return;
          }
          this.visSkiinfo.debug && console.log(`onClickHeadArea ${widgetID} ${sortkey}`);
          vis.binds["skiinfo"].toggleSort(widgetID, sortkey);
          this.render(widgetID);
        });
      },
      /**
       * Event handler for clicking on the search icon in the area list.
       *
       * @param el The HTML element that was clicked.
       * @returns Promise
       *
       * This function enables the search bar and then calls the render function to update the widget.
       */
      onClickSearchArea: function(el) {
        return __async(this, null, function* () {
          let widgetID = $(el).parent().parent().attr("data-widgetid");
          this.visSkiinfo.debug && console.log(`onClickSearchArea ${widgetID}`);
          vis.binds["skiinfo"].enableSearch(widgetID);
          this.render(widgetID);
        });
      },
      onClickCountriesFilter: function(el) {
        return __async(this, null, function* () {
          let widgetID = $(el).parent().parent().attr("data-widgetid");
          this.visSkiinfo.debug && console.log(`onClickCountriesFilter ${widgetID}`);
          vis.binds["skiinfo"].toggleFilter(widgetID);
          this.render(widgetID);
        });
      },
      /**
       * Event handler for clicking on the close icon in the search bar.
       *
       * @param el The HTML element that was clicked.
       * @returns Promise
       *
       * This function disables the search bar and then calls the render function to update the widget.
       */
      onClickSearchClose: function(el) {
        return __async(this, null, function* () {
          let widgetID = $(el).parent().parent().attr("data-widgetid");
          this.visSkiinfo.debug && console.log(`onClickSearchClose ${widgetID}`);
          vis.binds["skiinfo"].disableSearch(widgetID);
          this.render(widgetID);
        });
      },
      /**
       * Event handler for clicking on the search button in the search bar.
       *
       * @param el The HTML element that was clicked.
       * @returns Promise
       *
       * This function calls the doSearch function to update the search and then calls the render
       * function to update the widget.
       */
      onClickDoSearch: function(el) {
        return __async(this, null, function* () {
          let widgetID = $(el).parent().parent().attr("data-widgetid");
          this.visSkiinfo.debug && console.log(`onClickDoSearch ${widgetID}`);
          vis.binds["skiinfo"].doSearch(widgetID, $(el).val());
          this.render(widgetID);
        });
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
      onClickFavorite: function(el) {
        return __async(this, null, function* () {
          let widgetID = $(el).attr("data-widgetid");
          let instance = this.visSkiinfo[widgetID].instance;
          let country = $(el).attr("data-country");
          let region = $(el).attr("data-region");
          let area = $(el).attr("data-area");
          if (!this.visSkiinfo[instance].data.favorites) {
            this.visSkiinfo[instance].data.favorites = [];
          }
          let index = this.visSkiinfo[instance].data.favorites.findIndex(
            (item) => item.country == country && item.area == area
          );
          if (index !== -1) {
            this.visSkiinfo.debug && console.log(`onClickFavorite ${widgetID} ${country} ${area} fav deleted`);
            this.visSkiinfo[instance].data = yield this.visSkiinfo.delServerFavorite(
              this.visSkiinfo[widgetID].instance,
              country,
              region,
              area
            );
          } else {
            this.visSkiinfo.debug && console.log(`onClickFavorite ${widgetID} ${country} ${area} fav added`);
            this.visSkiinfo[instance].data = yield this.visSkiinfo.addServerFavorite(
              this.visSkiinfo[widgetID].instance,
              country,
              region,
              area
            );
          }
          this.render(widgetID);
        });
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
      setSelectedCountry: function(widgetID, countrycode) {
        return __async(this, null, function* () {
          let instance = this.visSkiinfo[widgetID].instance;
          this.visSkiinfo.debug && console.log(`setSelectedCountry ${widgetID} ${countrycode}`);
          if (countrycode) {
            this.visSkiinfo[widgetID].selectedCountry = countrycode;
            let country = this.visSkiinfo[instance].data.skiinfodata.find((country2) => country2.code == countrycode);
            if (!country || country.loaded == false) {
              this.visSkiinfo[instance].data = yield this.visSkiinfo.getServerCountryData(
                this.visSkiinfo[widgetID].instance,
                this.visSkiinfo[widgetID].selectedCountry
              );
            }
            this.visSkiinfo[widgetID].selectedRegion = country.regions[0].code;
          } else {
            this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata[0].code;
            this.visSkiinfo[widgetID].selectedRegion = this.visSkiinfo[instance].data.skiinfodata[0].regions[0].code;
          }
        });
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
      setSelectedRegion: function(widgetID, countrycode, regioncode) {
        return __async(this, null, function* () {
          let country, region;
          let instance = this.visSkiinfo[widgetID].instance;
          this.visSkiinfo.debug && console.log(`setSelectedRegion ${widgetID} ${countrycode} ${regioncode}`);
          if (countrycode) {
            country = this.visSkiinfo[instance].data.skiinfodata.find((country2) => country2.code == countrycode);
            if (!country || country.loaded == false) {
              this.visSkiinfo[instance].data = yield this.visSkiinfo.getServerCountryData(
                this.visSkiinfo[widgetID].instance,
                this.visSkiinfo[widgetID].selectedCountry
              );
            }
          } else {
            this.visSkiinfo[widgetID].selectedCountry = this.visSkiinfo[instance].data.skiinfodata[0].code;
          }
          country = this.visSkiinfo[instance].data.skiinfodata.find((country2) => country2.code == countrycode);
          if (regioncode) {
            this.visSkiinfo[widgetID].selectedRegion = regioncode;
            region = country.regions.find((region2) => region2.code == regioncode);
            if (!region || region.loaded == false) {
              this.visSkiinfo[instance].data = yield this.visSkiinfo.getServerRegionData(
                this.visSkiinfo[widgetID].instance,
                this.visSkiinfo[widgetID].selectedCountry,
                this.visSkiinfo[widgetID].selectedRegion
              );
            }
          } else {
            this.visSkiinfo[widgetID].selectedRegion = country.regions[0].code;
          }
        });
      }
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
          this.visSkiinfo[widgetID].wdata = data;
          this.visSkiinfo[widgetID].instance = instance;
          if (!this.visSkiinfo[instance].data) {
            this.visSkiinfo[instance].data = yield this.visSkiinfo.getServerSkiData(instance);
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
      /**
       * renders the skiinfo widget for the specified widget ID
       * constructs the HTML structure and style, including tables for countries, regions, and areas
       * adds click event handlers to elements for interactivity
       *
       * @param widgetID - The ID of the widget to render.
       */
      render(widgetID) {
        return __async(this, null, function* () {
          this.visSkiinfo.debug && console.log(`favorites render ${widgetID}`);
          let instance = this.visSkiinfo[widgetID].instance;
          let favoritecolor = this.visSkiinfo[widgetID].wdata.favoritecolor || "red";
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
          text += `   color: ${favoritecolor}; 
`;
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
      onClickHeadArea: function(el) {
        return __async(this, null, function* () {
          let sortkey = $(el).attr("data-sort");
          let widgetID = $(el).attr("data-widgetid");
          this.visSkiinfo.debug && console.log(`onClickHeadArea ${widgetID} ${sortkey}`);
          vis.binds["skiinfo"].toggleSort(widgetID, sortkey);
          this.render(widgetID);
        });
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
            this.visSkiinfo.debug && console.log(`onClickFavorite ${widgetID} ${country} ${area} fav deleted`);
            this.visSkiinfo[instance].data = yield this.visSkiinfo.delServerFavorite(
              this.visSkiinfo[widgetID].instance,
              country,
              area
            );
          } else {
            this.visSkiinfo.debug && console.log(`onClickFavorite ${widgetID} ${country} ${area} fav added`);
            this.visSkiinfo[instance].data = yield this.visSkiinfo.addServerFavorite(
              this.visSkiinfo[widgetID].instance,
              country,
              area
            );
          }
        });
      }
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
    toggleSort: function(widgetID, sortkey) {
      this.visSkiinfo.debug && console.log(`toggleSort ${widgetID} ${sortkey}`);
      for (const item in vis.binds["skiinfo"][widgetID].sortState) {
        if (item !== sortkey) {
          vis.binds["skiinfo"][widgetID].sortState[item] = 0;
        }
      }
      vis.binds["skiinfo"][widgetID].sortState[sortkey] = (vis.binds["skiinfo"][widgetID].sortState[sortkey] + 1) % 3;
    },
    /**
     * Enables search mode in the skiinfo widget.
     *
     * Search mode is enabled by setting the 'search' property of the widget to
     * an empty string.
     *
     * @param widgetID - The ID of the widget to enable search mode in.
     */
    enableSearch: function(widgetID) {
      this.visSkiinfo.debug && console.log(`enableSearch ${widgetID}`);
      vis.binds["skiinfo"][widgetID].search = "";
    },
    /**
     * Disables search mode in the skiinfo widget.
     *
     * Search mode is disabled by deleting the 'search' property of the widget.
     *
     * @param widgetID - The ID of the widget to disable search mode in.
     */
    disableSearch: function(widgetID) {
      this.visSkiinfo.debug && console.log(`disableSearch ${widgetID}`);
      delete vis.binds["skiinfo"][widgetID].search;
    },
    toggleFilter: function(widgetID) {
      this.visSkiinfo.debug && console.log(`toggleFilter ${widgetID}`);
      vis.binds["skiinfo"][widgetID].filter = !vis.binds["skiinfo"][widgetID].filter;
    },
    /**
     * Updates the search value of the skiinfo widget.
     *
     * The search value is used to filter the areas shown in the widget.
     * The search is case-insensitive and searches for the value in the
     * names of the areas.
     *
     * @param widgetID - The ID of the widget to update the search value of.
     * @param value - The new search value.
     */
    doSearch: function(widgetID, value) {
      this.visSkiinfo.debug && console.log(`doSearch ${widgetID}`);
      vis.binds["skiinfo"][widgetID].search = value;
    },
    /**
     * Sends a request to the server to fetch the current ski data for all countries, regions, and areas.
     *
     * @param instance - The instance ID of the adapter.
     * @returns - A promise that resolves to the ski data.
     */
    getServerSkiData: function(instance) {
      return __async(this, null, function* () {
        this.visSkiinfo.debug && console.log(`getServerSkiData request`);
        return yield this.sendToAsync(instance, "getServerSkiData", {});
      });
    },
    /**
     * Sends a request to the server to fetch the current ski data for a specific country.
     *
     * @param instance - The instance ID of the adapter.
     * @param countrycode - The code of the country to fetch data for.
     * @returns - A promise that resolves to the ski data.
     */
    getServerCountryData: function(instance, countrycode) {
      return __async(this, null, function* () {
        this.visSkiinfo.debug && console.log(`getServerCountryData request`);
        return yield this.sendToAsync(instance, "getServerCountryData", {
          countrycode
        });
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
    getServerRegionData: function(instance, countrycode, regioncode) {
      return __async(this, null, function* () {
        this.visSkiinfo.debug && console.log(`getServerRegionData request`);
        return yield this.sendToAsync(instance, "getServerRegionData", {
          countrycode,
          regioncode
        });
      });
    },
    /**
     * Sends a request to the server to add a favorite ski area.
     *
     * @param instance - The instance ID of the adapter.
     * @param countrycode - The code of the country to add the favorite for.
     * @param regioncode - The code of the region to add the favorite for.
     * @param areacode - The code of the area to add as a favorite.
     * @returns - A promise that resolves to the ski data.
     */
    addServerFavorite: function(instance, countrycode, regioncode, areacode) {
      return __async(this, null, function* () {
        this.visSkiinfo.debug && console.log(`addServerFavorite request`);
        return yield this.sendToAsync(instance, "addServerFavorite", {
          countrycode,
          regioncode,
          areacode
        });
      });
    },
    /**
     * Sends a request to the server to remove a favorite ski area.
     *
     * @param instance - The instance ID of the adapter.
     * @param countrycode - The code of the country to remove the favorite for.
     * @param regioncode - The code of the region to remove the favorite for.
     * @param areacode - The code of the area to remove as a favorite.
     * @returns - A promise that resolves to the ski data.
     */
    delServerFavorite: function(instance, countrycode, regioncode, areacode) {
      return __async(this, null, function* () {
        this.visSkiinfo.debug && console.log(`delServerFavorite request`);
        return yield this.sendToAsync(instance, "delServerFavorite", {
          countrycode,
          regioncode,
          areacode
        });
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
    sendToAsync: function(instance, command, sendData) {
      this.visSkiinfo.debug && console.log(`sendToAsync ${command} ${JSON.stringify(sendData)}`);
      return new Promise((resolve, reject) => {
        try {
          vis.conn.sendTo(instance, command, sendData, function(receiveData) {
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
    getInstanceInfo: function(oid) {
      this.visSkiinfo = vis.binds["skiinfo"];
      this.visSkiinfo.debug && console.log("getInstanceInfo");
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
