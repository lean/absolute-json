/*
absolute-json-improved-templating
version 0.2
author: Martin Toledo Do Pazo
https://github.com/dreadloop/absolute-json
a fork of:
absolute-json
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

	function init( opt, callback ) {
		options.resources = [];

		$.each(opt.resources, function(i, resource) {
			options.resources.push(resource);
			resource.localeObject = {};
			loadResource(options.resources[i]);
		});
		/*options.localeUrl = opt.localeUrl;
		 options.customJsonParser = opt.customJsonParser;

		 loadResource({
		 url:opt.localeUrl
		 }, callback );*/

		$.fn.abjson = function ( options ) {

			// localize childs
			var elements = $(this).find( '[data-abjson]' );

			elements.each( function () {
				localize( $(this), options );
			});

		};

		callback();

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

  function get ( key, replacements ) {
    return options.localeObject[key] ?
      wildcardReplace(options.localeObject[key], replacements || []) :
      undefined;
  }

  function buildWriter (element, attribute) {
    return function (value) {
      if(attribute === 'html' || !attribute){
        element.html(value);
      } else {
        element.attr('attribute', value);
      }
    }
  }

	function updateElements ( el, opt ) {

		var elKey = el.attr( "data-abjson" ),
      elAttrKey = el.attr( "data-abjson-attr" ),
			updateElementsdText = get( elKey ),
      writer = buildWriter(el, elAttrKey);

		if ( typeof updateElementsdText !== "undefined" ) {

			if ( updateElementsdText === Object(updateElementsdText) ) {

				forEach( updateElementsdText, function ( val, key ) {

					if ( key === "text" ){

						if ( el.attr( "data-abjson-r" ) ) {
							writer( wildcardReplace( updateElementsdText, el.attr( "data-abjson-r" ).split("|") ) );
						} else {
							writer( val );
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
			if(typeof replaceElements[i].replace === 'function'){
				replaceElements[i] = replaceElements[i].replace(/%{(.+?)}/g, function($0, $1){
					return get($1);
				});
			}
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

	function loadResource( resource ) {

		$.ajax({
			url: resource.localeUrl,
			type: 'get',
			dataType: 'json',
			cache: false,
			async: false,
			success: function ( data ) {

				resource.localeObject = (resource.customJsonParser) ? resource.customJsonParser(data) : data;

				if (resource.callback !== undefined) {
					resource.callback();
				}

			},
			error: function ( xhr, textStatus ) {
				if (resource.callback !== undefined) {
					resource.callback();
				}
				throw textStatus.toUpperCase() + ": " + xhr.statusText;

			}
		});
	}

	function getKeys ( resource ) {
		try{
			if( !resource && options.resources[0].localeObject ) {
				return _.keys(options.resources[0].localeObject);
			} else if( resource ) {
				for (var i = 0; i<options.resources.length; i++) {
					if (options.resources[i].name === resource && options.resources[i].localeObject) {
						return _.keys(options.resources[i].localeObject);
					}
				}
			}
		} catch(err) {
			//console.error(err);
		}

	}

	// public api interface
	abjson.init = init;
	abjson.load = load;
	abjson.options = options;
	abjson.get = get;
	abjson.getKeys = getKeys;


})();
