var i18n = require('../src/diet-i18n.js').i18n,
    expect = require('expect.js');

describe('i18n', function() {

    'use strict';

    it('should retrieve translation from phrase registry', function() {
        var phrase = {"test": "this is a mocha test"};
        i18n.extend(phrase);
        expect(i18n('test')).to.equal(phrase.test);
        expect(i18n('tset')).to.equal('i18n_void: tset');
    });

    it('should apply expression handling for desired translation', function() {
        var phrase = {"test": "this is a mocha {{expression}}"};
        i18n.extend(phrase);
        expect(i18n('test', {"expression": 'test'})).to.equal('this is a mocha test');
        phrase = {"test": "this is a {{thing}} {{expression}}"};
        i18n.extend(phrase);
        expect(i18n('test', {"expression": 'practice', "thing": 'TDD'})).to.equal('this is a TDD practice');
        expect(i18n('tset', {"expression": 'practice', "thing": 'TDD'})).to.equal('i18n_void: tset');
    });

    it('should register translations by extending the current registry', function() {
        var set = {
            "name": 'Mocha',
            "data": {
                "one": 1,
                "more": {
                    "moreData": 'asdf'
                }
            }
        };
        i18n.extend(set);
        expect(i18n('name')).to.equal(set.name);
        expect(i18n('data.one')).to.equal(set.data.one);
        expect(i18n('data.more.moreData')).to.equal(set.data.more.moreData);
        expect(i18n('data.more.moredata')).to.equal('i18n_void: data.more.moredata');
    });

    afterEach(function() {
        i18n.restore();
    });

});
