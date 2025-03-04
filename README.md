# ioBroker.skiinfo

![Logo](admin/skiinfo.png)

[![NPM version](https://img.shields.io/npm/v/iobroker.skiinfo.svg)](https://www.npmjs.com/package/iobroker.skiinfo)
[![Downloads](https://img.shields.io/npm/dm/iobroker.skiinfo.svg)](https://www.npmjs.com/package/iobroker.skiinfo)
![Number of Installations](https://iobroker.live/badges/skiinfo-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/skiinfo-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.skiinfo.png?downloads=true)](https://nodei.co/npm/iobroker.skiinfo/)

**Tests:** ![Test and Release](https://github.com/oweitman/ioBroker.skiinfo/workflows/Test%20and%20Release/badge.svg)

## skiinfo adapter for ioBroker

With this adapter you can access the current snow depths for mountain, valley and fresh snow, as well as open lifts for various European locations.

## Configuration

The adapter dont need any configuration.

## vis and widgets

The following widgets actually exists

- [`Skiinfo browser`](#skiinfo-browser) - to browse through all available countries, regions and areas and set favorite areas.
- [`Skiinfo Favorites`](#skiinfo-favorite) - to show only the favorite ski areas.

### Skiinfo browser

The widget is used to browse through all available countries, regions and areas and set favorite areas.
With the table head, you can toggle the sort mode for each column (default, descending, ascending).
With the star icon you can toggle the favorite mode.
As a datapoint please select the config datapoint.

### Skiinfo favorite

The widget is used to show only the favorite ski areas.
With the table head, you can toggle the sort mode for each column (default, descending, ascending).
With the star icon you can remove the area from the favorite list.
As a datapoint please select the config datapoint.

## Available sendTo commands

### getServerSkiData

Get the current data for the requested ski data to the client.

#### Parameters for getServerSkiData

none

#### Example for getServerSkiData

```javascript
let instance = 'skiinfo.0';
let response = await sendToAsync(instance, 'getServerSkiData', {});
console.log(response);
```

### getServerCountryData

Loads the country data if it was not already loaded and sends the data back to the client.

#### Parameters for getServerCountryData

- countrycode

#### Example for getServerCountryData

```javascript
let instance = 'skiinfo.0';
let response = await sendToAsync(instance, 'getServerCountryData', { countrycode: 'deutschland' });
console.log(response);
```

### getServerRegionData

Loads the country and region data if it was not already loaded and sends the data
back to the client.

#### Parameters for getServerRegionData

- countrycode
- regioncode

#### Example for getServerRegionData

```javascript
let instance = 'skiinfo.0';
let response = await sendToAsync(instance, 'getServerRegionData', {
    countrycode: 'deutschland',
    countrycode: 'bayern',
});
console.log(response);
```

### addServerFavorite

Adds a favorite area for the given country and area.
If the favorite area does not exist it will be added.
Sends the updated data back to the client.

#### Parameters for addServerFavorite

- countrycode
- regioncode

#### Example for addServerFavorite

```javascript
let instance = 'skiinfo.0';
let response = await sendToAsync(instance, 'addServerFavorite', { countrycode: 'deutschland', countrycode: 'bayern' });
console.log(response);
```

### delServerFavorite

Removes a favorite area for the given country and area.
Sends the updated data back to the client.

#### Parameters for delServerFavorite

- countrycode
- regioncode

#### Example for delServerFavorite

```javascript
let instance = 'skiinfo.0';
let response = await sendToAsync(instance, 'delServerFavorite', { countrycode: 'deutschland', countrycode: 'bayern' });
console.log(response);
```

## Todo

- to be defined

## Changelog

<!--
    Placeholder for the next version (at the beginning of the line):
    ### **WORK IN PROGRESS**
-->

### **WORK IN PROGRESS**

- (oweitman) initial release

## License

MIT License

Copyright (c) 2025 oweitman <oweitman@gmx.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

```
