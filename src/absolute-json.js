/*
 absolute-json
 version 0.7
 author: Leandro Cabrera
 https://github.com/lean/absolute-json
 Licensed under the MIT license.
 */
;(function (root,$) {

    var abjson = {};

    // defaults
    var options = {
        source: null,
        sourceUrl: "",
        localeObject: {},
        customJsonParser : null
    }

    // helpers
    function AbjError ( name, message ) {
        this.name = name;
        this.message = message || "error";
    }

    AbjError.prototype = new Error();
    AbjError.prototype.constructor = AbjError;

    function forEach (obj, iterator, context) {
        if (obj == null) return;
        if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (iterator.call(context, obj[i], i, obj) === {}) return;
            }
        } else {
            for (var key in obj) {
                if ( obj.hasOwnProperty(key) ) {
                    if (iterator.call(context, obj[key], key, obj) === {}) return;
                }
            }
        }

    }

    function getPropertyByString(obj,str) {
        var a = str.split('.');
        while (a.length) {
            var n = a.shift();
            if (n in obj) {
                obj = obj[n];
            } else {
                return;
            }
        }
        return obj;
    }

    function load ( opt, callback ) {

        options.source = opt.source;
        options.sourceUrl = opt.sourceUrl;

        loadSource( callback );
    }

    function loadSource ( callback ) {

        if (options.source){
            options.localeObject = options.source;
            callback();
            return;
        }

        $.ajax({
            url: options.sourceUrl,
            type: 'get',
            dataType: 'json',
            cache : false,
            success: function(data){
                options.localeObject = data;
                callback();
            },
            error: function ( xhr, textStatus ) {
                callback(new AbjError(textStatus.toUpperCase(), xhr.statusText));
            }
        });
    }

    function get ( key ) {
        var r;

        if(options.localeObject[key]){

            r =  wildcardReplace(options.localeObject[key], Array.prototype.slice.call(arguments, 1));

        }else{

            if(key.indexOf(".")>0){
                r = wildcardReplace( getPropertyByString(options.localeObject,key), Array.prototype.slice.call(arguments, 1) );
            }

        }

        return r;

    }

    function updateElements ( el, opt ) {

        var elKey = el.attr( "data-abjson" ),
            updateElementsdText = get( elKey );

        if ( typeof updateElementsdText !== "undefined" ) {

            if ( updateElementsdText === Object(updateElementsdText) ) {

                forEach( updateElementsdText, function ( val, key ) {

                    if ( key === "text" ){

                        if ( el.attr( "data-abjson-r" ) ) {
                            el.html( wildcardReplace( updateElementsdText, el.attr( "data-abjson-r" ).split("|") ) );
                        } else {
                            el.html( val );
                        }

                    } else {

                        el.attr( key,val );

                    }

                });

            } else {

                if ( el.attr( "data-abjson-r" ) ) {
                    el.html( wildcardReplace( updateElementsdText, el.attr( "data-abjson-r" ).split("|") ) );
                } else {
                    el.html( updateElementsdText );
                }

            }

        } else {
            el.html(elKey + " NOT FOUND");
        }

    }

    function wildcardReplace ( text, replaceElements ) {

        var i,
            replacedText = text;

        for( i=0; i < replaceElements.length; i++ ) {
            replacedText = replacedText.replace( new RegExp("%" + (i+1), 'ig'), replaceElements[i] )
        }

        return replacedText;

    }

    if (!root.abjson) {

        $.fn.abjson = function ( options ) {

            var elements = $("[data-abjson]", this);

            elements.each( function () {
                updateElements( $(this), options );
            });

        };

        root.abjson = root.abjson || abjson;
    }


    // public interface
    abjson.load = load;
    abjson.options = options;
    abjson.get = get;


})(window, jQuery);
