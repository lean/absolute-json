/*
absolute-json
version 0.6
author: Leandro Cabrera
https://github.com/lean/absolute-json
Licensed under the MIT license.
*/
(function () {

	var root = this,
		$ = root.jQuery,
		abjson = {};

	// defaults
	var options = {
		source: null,
		sourceUrl: "",
		localeObject: {},
		customJsonParser : null
	};

	// helpers
	function abjError ( name, message ) {
		this.name = name;
		this.message = message || "error";
	}

	abjError.prototype = new Error();
	abjError.prototype.constructor = abjError;

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

	function load ( opt, callback ) {
		
		options.source = opt.source;
		options.sourceUrl = opt.sourceUrl;
		options.customJsonParser = opt.customJsonParser;

		loadSource( callback );
	}

	function loadSource ( callback ) {

		function parse(data){
			options.localeObject = (options.customJsonParser) ? options.customJsonParser(data) : data;
				
			callback();
		}

		if (options.source){
			parse(options.source);
			return;
		}

		$.ajax({
			url: options.sourceUrl,
			type: 'get',
			dataType: 'json',
			cache : false,
			success: parse,
			error: function ( xhr, textStatus ) {
				callback(new abjError(textStatus.toUpperCase(), xhr.statusText));
			}
		});
	}

	function get ( key ) {
		return options.localeObject[key] ?
						wildcardReplace(options.localeObject[key], Array.prototype.slice.call(arguments, 1)) :
						undefined;
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
			//key not found
			el.html(elKey + " NOT FOUND");
		}

	}

	function wildcardReplace ( text, replaceElements ) {

		var i,
			replacedText = text;
		
		for( i=0; i < replaceElements.length; i++ ) {
			replacedText = replacedText.replace( new RegExp("%" + (i+1), 'ig'), replaceElements[i] );
		}

		return replacedText;

	}

	if (!$.abjson && !root.abjson) {
		$.abjson = $.abjson || abjson;

		$.fn.abjson = function ( options ) {

			var elements = $("[data-abjson]", this);

			elements.each( function () { 
				updateElements( $(this), options );
			});

		};
			
		root.abjson = root.abjson || abjson;
	}
	

	// public api interface
	abjson.load = load;
	abjson.options = options;
	abjson.get = get;


})();
