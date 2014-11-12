(function(root) {
    'use strict';

    var attributes = {}, variants = [
        // icelandic
        [function(n) { return (n % 10 !== 1 || n % 100 === 11) ? 1 : 0; }, 'is'],
        // polish
        [function(n) { return (n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2); }, 'pl'],
        // czech
        [function(n) { return (n === 1) ? 0 : (n >= 2 && n <= 4) ? 1 : 2; }, 'cs'],
        // russian
        [function(n) { return n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2; }, 'hr', 'ru'],
        // french
        [function(n) { return n > 1 ? 1 : 0; }, 'fr', 'tl', 'pt-br'],
        // german
        [function(n) { return n !== 1 ? 1 : 0; }, 'da', 'de', 'en', 'es', 'fi', 'gb', 'el', 'he', 'hu', 'it', 'nl', 'no', 'pt', 'sv', 'uk'],
        // chinese
        [function(n) { return 0; }, 'fa', 'id', 'ja', 'ko', 'lo', 'ms', 'th', 'tr', 'zh']
    ];

    function trim(phrase) {
        var regExp = /^\s+|\s+$/g;
        return phrase.replace(regExp, '');
    }

    function setPluralizationRule() {

        var locale = attributes.locale,
            codes,
            index,
            variant;

        for (variant = variants.length - 1; variant; variant--) {
            codes = variants[variant].slice(1);
            index = codes.length;
            while (index--) {
                if (codes[index] === locale) {
                    attributes.pluralizationRule = variants[variant][0];
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

            phrase = phrase[attributes.pluralizationRule(rule || 0)];
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
        }

        if (properties.locale !== void 0) {
            setPluralizationRule();
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
