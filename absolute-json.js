/*
absolute-json
version 0.0.5
author: Leandro Cabrera
https://github.com/lean/absolute-json
Licensed under the MIT license.
 
changelog:
0.0.5 add cache false

*/
(function () {

	var root = this,
		$ = root.jQuery,
		_ = root._,
		abjson = {};

	// defaults
	var options = {
		localeUrl: "",
		localeObject: {},
		customJsonParser : null
	}

	// Export the abjson object for **CommonJS**. 
	// If we're not in CommonJS, add 'abjson' to the
	// global object or to jquery.
	if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = abjson;
	} else {
		if($) {
			$.abjson = $.abjson || abjson;
		}

		root.abjson = root.abjson || abjson;
	}

	function init( opt, callback ) {
		
		options.localeUrl = opt.localeUrl;
		options.customJsonParser = opt.customJsonParser;

		loadResource({
			url:opt.localeUrl
		}, callback );

		$.fn.abjson = function ( options ) {

			// localize childs
			var elements = $(this).find( '[data-abjson]' );

			elements.each( function () { 
				localize( $(this), options );
			});

		};

	}

	function loadResource( opt, callback ) {

		$.ajax({
			url: opt.url,
			type: 'get',
			dataType: 'json',
			cache : false,
			success: function ( data ) {

				options.localeObject = (options.customJsonParser) ? options.customJsonParser(data) : data;
				
				callback();

			},
			error: function ( xhr, textStatus ) {
				callback();
				throw textStatus.toUpperCase() + ": " + xhr.statusText;

			}
		});
	}

	function get ( key ) {
		try{
			if (key === " ") {
				return "";
			}else if( options.localeObject[key] ) {
				return options.localeObject[key];
			} else {
				throw "KEY " + key + " NOT FOUND";
			}
			
		}catch(err){
				console.error(err);
		}

	}

	function localize ( el, opt ) {

		var elKey = el.attr( "data-abjson" ),
			localizedText = get( elKey );

		if ( typeof localizedText !== "undefined" ) {

			if ( _.isObject( localizedText ) ) {
				
				_.each( localizedText, function ( val, key ) {
					
					if ( key === "text" ){
						
						if ( el.attr( "data-abjson-r" ) ) {
							el.html( wildcardReplace( localizedText, el.attr( "data-abjson-r" ).split("|") ) );
						} else {
							el.html( val );
						}

					} else {

						el.attr( key,val );

					}

				});

			} else {

				if ( el.attr( "data-abjson-r" ) ) {
					el.html( wildcardReplace( localizedText, el.attr( "data-abjson-r" ).split("|") ) );
				} else {
					el.html( localizedText );
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
			replacedText = replacedText.replace( "%" + (i+1), replaceElements[i] )
		};

		return replacedText;

	}

	// public api interface
	abjson.init = init;
	abjson.options = options;
	abjson.get = get;

})();