/*!
 * Formaat 0.0.1
 * Copyright 2017 Rajiv Raman (https://www.linkedin.com/in/rajivraman/)
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 */

(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        define([/*"foo"*/], factory);
    } else if(typeof module === "object" && module.exports) {
        module.exports = factory(/*require("foo")*/);
    } else {
        root.formaat = factory(/*root.foo*/);
    }
}(this, function(/*foo*/) {
    "use strict";

    var Utils = {
        foo: { bar: 100 },

        /**
         *
         */
        privFunc: function(foo, bar) {
            return foo + bar;
        },
    };

    /**
     * @class formaat
     * @param {Integer} numChars
     */
    var Formaat = function(numChars) {

        // if we are called as a function, call using new instead
        if (!(this instanceof Formaat)) {
            return new Formaat(numChars);
        }

        // see if pNumChars is missing or <= 0; can be a float (e.g. 4.5)
        numChars = parseFloat(numChars);
        var numCharsCheck = numChars > 0;
        if (!numCharsCheck) {
            throw new Error('"numChars" argument must be an int or float greater than zero');
        }

        this.numChars = numChars;

    };

    /**
     * Generates formatted string
     * @param {Number} pNum
     * @param {Number} pOrigPNum
     * @return {String}
     */
    Formaat.prototype.abbrev = function(pNum, origPNum) {
        if (!origPNum) {
            origPNum = pNum;
        }

        // isFinite means non NaN or +/- Infinity
        if (!isFinite(pNum = parseFloat(pNum))) {
            console.log('formatNumber; invalid pNum: ' + pNum);
            return pNum;
        }

        // func to measure char length of string, counting , and . as halves
        var countChars = function(pNumStr) {
            return pNumStr.length  - ( (pNumStr.match(/[,\.]/g) || []).length * 0.5 );
        };

        var countIntPortionChars = function(pNumStr) {
            var periodIndex = pNumStr.indexOf('.');
            if (periodIndex >= 0) {
                return countChars(pNumStr.substr(0, periodIndex));
            }
            else {
                // this is an integer
                return countChars(pNumStr);
            }
        };

        // first, try formatting number and see if it fits
        var formatted = pNum.toLocaleString('en-US', {maximumFractionDigits: 20}); // native comma-formatting (non-regex)
        var fullCharCount = countChars(formatted);
        if (fullCharCount <= this.numChars) {
            return formatted;
        }

        //IE11 polyfill for isInteger
        Number.isInteger = Number.isInteger || function(value) {
            return typeof value === "number" &&
                   isFinite(value) &&
                   Math.floor(value) === value;
        };

        var isInt = Number.isInteger(pNum);
        var isFloat = !isInt;
        var intPortionCharCount;
        var numDecimals;

        // if it was an int, we can skip this step (we know the whole thing won't
        // fit).
        // if it was a float, see if the int portion can fit, then proceed seeing
        // how many decimals can fit.
        if (isFloat) {
            intPortionCharCount = fullCharCount - (formatted.length - formatted.indexOf('.') - 1) - 0.5 /* 0.5 for period */;
            if (intPortionCharCount <= this.numChars) {
                numDecimals = Math.floor( this.numChars - intPortionCharCount - 0.5 /* for period */ );
                numDecimals = Math.max(0, numDecimals); // numDecimals might be -0.5 in which case we want zero (turns toLocaleString to a simple "rounding")
                // 99.9 might have been converted to 100 if this.numChars is 2;
                // 999.9 with this.numChars of 3 might have been converted to 1,000;
                // 99.9 with limit of 3 got converted to 100, but still fits
                formatted = pNum.toLocaleString('en-US', { maximumFractionDigits: numDecimals });
                if (countIntPortionChars(formatted) != intPortionCharCount) {
                    var newPNum = Math.round(pNum);
                    return this.abbrev(newPNum, pNum);
                }
                else {
                    return formatted;
                }
            }
        }

        // if we've reached this point, we are an int that's too large OR a float
        // whose int-portion is too large
        var pNumAbs = Math.abs(pNum);
        var croppedPNum = null;
        var suffix = '';
        var denom = null;
        if (pNumAbs < 1000) {
            // we'll reach this case for 999.9 limit of 2...
            // need to make sure we do step into "suffix" case so that rounding
            // can happen (to result in 1K)
            croppedPNum = pNum/1000;
            denom = 1000;
            suffix = 'K';
        }
        else if (pNumAbs < 1000000) {
            croppedPNum = pNum/1000;
            denom = 1000;
            suffix = 'K';
        }
        else if (pNumAbs < 1000000000) {
            croppedPNum = pNum/1000000;
            denom = 1000000;
            suffix = 'M';
        }
        else if (pNumAbs < 1000000000000) {
            croppedPNum = pNum/1000000000;
            denom = 1000000000;
            suffix = 'B';
        }
        else {
            // don't even bother validating against this.numChars...
            return '1T+';
        }

        // TODO: fix this logic:
        if (true) {
            // now (almost) repeat the logic further up, but compensate for suffix
            // we don't want to alter it in case we fall out of this case to the bottom tilde case:
            var newPNumChars = this.numChars - suffix.length;

            // croppedPNum is guaranteed to be a comma-less number with 0 or 1 periods,
            // so we can just toString() it
            intPortionCharCount = Math.floor(croppedPNum).toString().length;

            // protect against the "APP.formatNumber(100000, 2)" case:
            // can't do this check here anymore (moved it further down)...since (999999, 2)
            // needs to filter down to 1M and int-portion of 999.999 is 3 (and is greater than 2)
            if (true /*intPortionCharCount <= newPNumChars*/) {
                numDecimals = Math.floor( newPNumChars - intPortionCharCount - 0.5 /* for period */ );
                numDecimals = Math.max(0, numDecimals);
                // 99.9 might have been converted to 100 if newPNumChars is 2; so our original intPortionCharCount is now inaccurate; so do this extra check
                formatted = croppedPNum.toLocaleString('en-US', {maximumFractionDigits: numDecimals });
                // (999999, 6) results in 1,000K; it "fits" but its not correct. basically, if the intportion changes, round and redo the entire calc
                if (countIntPortionChars(formatted) != intPortionCharCount) {
                    var tryRounded = Math.round(croppedPNum) * denom; // "undo" the cropping, but on the ROUNDED number; i.e. "round to the nearest X where X = denom"
                    return this.abbrev(tryRounded, pNum);
                }
                else if (intPortionCharCount <= newPNumChars && formatted !== '0') { // WE SHOULD NEVER DISPLAY 0K...should fall down into tilde case
                    return formatted + suffix;
                }
            }
        }

        console.log('formatNumber; bad params: ' + origPNum + ', ' + this.numChars);
        return origPNum.toString().substr(0, this.numChars - 1) + "~"; // this may result in just "~" if this.numChars is 1
    };

    // export
    return Formaat;

}));