var formaat = require('../formaat.js'),
    assert = require('assert');

describe('Basic abbreviations', function() {
    it('should validate the numChars argument', function() {

        // no args
        assert.throws(function() {
            formaat();
        });

        // numChars not an int or float
        assert.throws(function() {
            formaat('abc');
        });

        // numChars can be a numeric string
        assert.doesNotThrow(function() {
            formaat('4');
        });

        // numChars cannot be less than or equal zero
        assert.throws(function() {
            formaat(-1);
        });
        assert.throws(function() {
            formaat(0);
        });

        // numChars can be an int or float
        assert.doesNotThrow(function() {
            formaat(4);
        });
        assert.doesNotThrow(function() {
            formaat(4.5);
        });

    });

    it('should not alter numbers from -999 to 999 given enough space', function() {

        assert.equal(formaat(1).abbrev(0), '0');
        assert.equal(formaat(3).abbrev(999), '999');
        assert.equal(formaat(4).abbrev(-999), '-999');

    });

    it('should properly round decimals up or down', function() {

        assert.equal(formaat(4.5).abbrev(999.14), '999.1');
        assert.equal(formaat(4.5).abbrev(999.15), '999.2');

    });

    it('should drop trailing zeros when rounding', function() {

        assert.equal(formaat(5.5).abbrev(999.105), '999.11');
        assert.equal(formaat(5.5).abbrev(999.104), '999.1'); // dropped zero

    });

    it('should properly drop decimal point when rounding', function() {

        assert.equal(formaat(4.5).abbrev(899.94), '899.9');
        assert.equal(formaat(4.5).abbrev(899.95), '900'); // dropped decimal point

    });

    it('should properly add commas', function() {

        assert.equal(formaat(4.5).abbrev(1000), '1,000');
        assert.equal(formaat(8).abbrev(1000000), '1,000,000');
        assert.equal(formaat(11.5).abbrev(1000000000), '1,000,000,000');

    });

    it('should properly add commas after rounding', function() {

        assert.equal(formaat(4.5).abbrev(999.95), '1,000');
        assert.equal(formaat(8).abbrev(999999.95), '1,000,000');
        assert.equal(formaat(11.5).abbrev(999999999.95), '1,000,000,000');

    });

    it('should properly abbreviate', function() {

        assert.equal(formaat(4).abbrev(9000), '9K');
        assert.equal(formaat(3).abbrev(9000), '9K');
        assert.equal(formaat(2).abbrev(9000), '9K');

    });

    it('should properly abbreviate after rounding', function() {

        assert.equal(formaat(4).abbrev(8999), '9K');
        assert.equal(formaat(3).abbrev(8999), '9K');
        assert.equal(formaat(2).abbrev(8999), '9K');

    });

    it('should properly abbreviate after rounding with digit increase', function() {

        assert.equal(formaat(4).abbrev(9999), '10K');
        assert.equal(formaat(3).abbrev(9999), '10K');

    });

    it('should properly abbreviate after rounding decimals up or down', function() {

        assert.equal(formaat(4).abbrev(8100), '8.1K');
        assert.equal(formaat(3.5).abbrev(8100), '8.1K');
        assert.equal(formaat(4).abbrev(8599), '8.6K');
        assert.equal(formaat(3.5).abbrev(8599), '8.6K');

    });

    it('should properly abbreviate millions, billions, and trillions+', function() {

        assert.equal(formaat(3).abbrev(9999999), '10M');
        assert.equal(formaat(3).abbrev(9999999999), '10B');
        assert.equal(formaat(3).abbrev(9999999999999), '1T+');

    });

    it('should properly abbreviate as an alternative to truncation', function() {

        assert.equal(formaat(2).abbrev(999), '1K'); // instead of "9~"
        assert.equal(formaat(2).abbrev(999.9), '1K'); // instead of "9~"
        assert.equal(formaat(2).abbrev(999999), '1M'); // instead of "9~"

    });

    it('should truncate when there is no other alternative', function() {

        assert.equal(formaat(2).abbrev(99.4), '99'); // rounding down fits
        assert.equal(formaat(2).abbrev(99.5), '9~'); // rounding up does not
        assert.equal(formaat(2).abbrev(9999), '9~');
        assert.equal(formaat(2).abbrev(100000), '1~');
        assert.equal(formaat(1).abbrev(99), '~');

    });

    it('should never abbreviate in a way that rounding up results in a comma', function() {

        assert.equal(formaat(5.5).abbrev(999999), '1M'); // instead of "1,000K"

    });

});