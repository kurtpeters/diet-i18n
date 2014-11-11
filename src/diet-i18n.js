(function(root) {
    'use strict';

    var i18n, phraseRegistry = {}, defaultText = 'i18n_void: ';

    root.i18n = i18n = function(path, expressions) {

        var phrase = phraseRegistry[path] || defaultText + path,
            expression,
            regExp;
        
        for (expression in expressions) {
            regExp = new RegExp('\\{\\{' + expression + '\\}\\}', 'g');
            phrase = phrase.replace(regExp, expressions[expression]);
        }

        return phrase;
    };

    i18n.extend = function(phrases, prefix) {

        var item, phrase;

        for (item in phrases) {
            phrase = phrases[item];

            if (prefix !== void 0) {
                item = prefix + '.' + item;
            }

            if (phrase instanceof Object) {
                this.extend(phrase, item);
                continue;
            }

            phraseRegistry[item] = phrase;
        }

        return this;
    };

    i18n.restore = function() {
        phraseRegistry = {};
        return this;
    };
    
})(this);
