(function(root) {
    'use strict';

    var attributes = {},
        pluralizationRule,
        variants;

    variants = { // l: locales; r: rule
        "zh": { // chinese
            "l": ['fa', 'id', 'ja', 'ko', 'lo', 'ms', 'th', 'tr', 'zh'],
            "r": function(n) { return 0; }
        },
        "de": { // german
            "l": ['da', 'de', 'en', 'es', 'fi', 'gb', 'el', 'he', 'hu', 'it', 'nl', 'no', 'pt', 'sv', 'uk'],
            "r": function(n) { return n !== 1 ? 1 : 0; }
        },
        "fr": { // french
            "l": ['fr', 'tl', 'pt-br'],
            "r": function(n) { return n > 1 ? 1 : 0; }
        },
        "ru": { // russian
            "l": ['hr', 'ru'],
            "r": function(n) { return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2; }
        },
        "cs": { // czech
            "l": ['cs'],
            "r": function(n) { return (n === 1) ? 0 : (n >= 2 && n <= 4) ? 1 : 2; }
        },
        "pl": { // polish
            "l": ['pl'],
            "r": function(n) { return (n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2); }
        },
        "is": { // icelandic
            "l": ['is'],
            "r": function(n) { return (n % 10 !== 1 || n % 100 === 11) ? 1 : 0; }
        }
    };

    function trim(phrase) {
        var regExp = /^\s+|\s+$/g;
        return phrase.replace(regExp, '');
    }

    function setPluralizationRule() {

        var locale = attributes.locale,
            variant,
            index;

        for (variant in variants) {
            variant = variants[variant];
            index = variant.l.length;
            while (index--) {
                if (variant.l[index] === locale) {
                    pluralizationRule = variant.r;
                    return;
                }
            }
        }
    }

    function pluralize(phrase, expressions) {

        var property, rule;

        if (~phrase.indexOf(attributes.delimiter)) {
            phrase = phrase.split(attributes.delimiter);
            if (!isNaN(expressions)) {
                rule = +expressions;
            } else {
                for (property in expressions) {
                    if (!isNaN(expressions[property])) {
                        rule = +expressions[property];
                        break;
                    }
                }
            }

            phrase = phrase[pluralizationRule(rule || 0)];
        }

        return trim(phrase);
    }

    function i18n(path, expressions) {

        var phrase = attributes.registry[path] || (expressions ? expressions.__default__ : null);

        if (phrase != null && phrase.constructor === String) {
            phrase = phrase.replace(attributes.expression, function(expression, property) {
                return expressions[property] || '';
            });
            phrase = pluralize(phrase, expressions);

        } else {
            phrase = null;
        }

        return phrase || (attributes.allowVoid ? '' : attributes.defaultText + path);
    }

    i18n.extend = function(phrases, prefix) {

        var item,
            phrase;

        for (item in phrases) {
            phrase = phrases[item];
            if (prefix !== void 0) {
                item = prefix + attributes.notation + item;
            }
            if (phrase instanceof Object) {
                this.extend(phrase, item);
                continue;
            }
            attributes.registry[item] = phrase;
        }

        return this;
    };

    i18n.set = function(properties) {

        for (var property in properties) {
            attributes[property] = properties[property];
            if (property === 'locale') {
                setPluralizationRule();
            }
        }

        return this;
    };

    i18n.get = function(property) {
        return attributes[property];
    };

    i18n.empty = function() {
        this.set({
            "registry": {}
        });
        return this;
    };

    root.i18n = i18n.set({ // Default Configuration
        "allowVoid": false,
        "defaultText": 'i18n_void: ',
        "delimiter": '||',
        "expression": /%\{(.*?)\}/g,
        "locale": 'en',
        "notation": '.',
        "registry": {}
    });

})(this);
