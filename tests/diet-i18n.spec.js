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
        var phrase = {"test": "this is a mocha %{expression}"};
        i18n.extend(phrase);
        expect(i18n('test', {"expression": 'test'})).to.equal('this is a mocha test');
        var phrase = {"test": "this is a mocha %{ expression }"};
        i18n.extend(phrase);
        expect(i18n('test', {"expression": 'test'})).to.equal('this is a mocha test');
        phrase = {"test": "this is a %{thing} %{expression}"};
        i18n.extend(phrase);
        expect(i18n('test', {"expression": 'practice', "thing": 'TDD'})).to.equal('this is a TDD practice');
        expect(i18n('tset', {"expression": 'practice', "thing": 'TDD'})).to.equal('i18n_void: tset');
        phrase = {"test": "%{expression} this, %{expression} that."};
        i18n.extend(phrase);
        expect(i18n('test', {"expression": 'Mocha'})).to.equal('Mocha this, Mocha that.');
    });

    it('should use expression default if one is populated', function() {
        expect(i18n('test')).to.equal('i18n_void: test');
        expect(i18n('test', {
            "__default__": 'test content'
        })).to.equal('test content');
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
        expect(i18n('data.one')).to.equal('i18n_void: data.one');
        expect(i18n('data.more.moreData')).to.equal(set.data.more.moreData);
        expect(i18n('data.more.moredata')).to.equal('i18n_void: data.more.moredata');
    });

    it('should empty out phrase registry', function() {
        i18n.extend({
            "test": 'this is a test'
        });
        expect(i18n('test')).to.equal('this is a test');
        i18n.empty();
        expect(i18n('test')).to.equal('i18n_void: test');
    });

    it('should determine pluralized context for translation', function() {
        i18n.extend({
            "test": 'orange || oranges'
        });
        expect(i18n('test', 1)).to.equal('orange');
        expect(i18n('test', '1')).to.equal('orange');
        expect(i18n('test', 2)).to.equal('oranges');
        expect(i18n('test', '2')).to.equal('oranges');
        expect(i18n('test', {"n": 2})).to.equal('oranges');
    });

    it('should remove error messaging if void content is allowed', function() {
        expect(i18n('test')).to.equal('i18n_void: test');
        i18n.set({"allowVoid": true});
        expect(i18n('test')).to.equal('');
        i18n.set({"allowVoid": false});
    });

    afterEach(function() {
        i18n.empty();
    });

});
