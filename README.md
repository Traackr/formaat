Formaat
============

[![Bower version](https://img.shields.io/bower/v/formaat.svg?style=flat-square)](https://github.com/Traackr/formaat)
[![NPM version](https://img.shields.io/npm/v/formaat.svg?style=flat-square)](https://www.npmjs.com/package/formaat)

## Number formatter

Easily format a number to fit in a given space (number of characters).

Compatible with Require.js/AMD and NodeJS.

## Usage

The formatted number can be generated given a number of characters to fit in. Commas, periods count as half-spaces. If a number cannot be abbreviated, it will be cropped with tildes.

### Initialize formaat

The `formaat` constructor takes a number of characters to fit in. Commas, periods count as half-spaces.

```javascript
// pass in number of characters to fit in
var formaat = formaat(3.5);
```

### Generate number

Pass in the number to be formatted.
> Numbers over a trillion will be formatted as "1T+".

```javascript
// Generate number
var formatted = formaat.abbrev(8100);
```
> 8.1K

## Tests

A Mocha test suite is available.

```
npm install
npm test
```
