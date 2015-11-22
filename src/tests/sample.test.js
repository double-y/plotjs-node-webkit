/**
 * Created by yasudayousuke on 11/22/15.
 */

var assert = require('chai').assert
var should = require('chai').should();

describe('Array', function() {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
            assert.typeOf('str', 'string');
            'str'.should.be.a('string');
        });
    });
});