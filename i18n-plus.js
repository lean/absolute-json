(function () {

	var root = this,
		$ = root.jQuery,
		_ = root._,
		ajson = {};

	// defaults
	var options = {
		localeUrl: "",
		localeObject: {},
		customJsonParser : null
	}

	// Export the i18next object for **CommonJS**. 
	// If we're not in CommonJS, add `ajson` to the
	// global object or to jquery.
	if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = ajson;
	} else {
		if($) {
			$.ajson = $.ajson || ajson;
		}

		root.ajson = root.ajson || ajson;
	}

	function init(opt, callback) {
		
		options.localeUrl = opt.localeUrl;
		options.customJsonParser = opt.customJsonParser;

		loadResource({
			url:opt.localeUrl
		}, callback );

		$.fn.ajson = function (options) {

				// localize childs
				var elements = $(this).find('[data-ajson]');

				elements.each( function () { 
					localize($(this), options);
				});

		};

	}

	function loadResource( opt, callback ) {

		$.ajax({
			url: opt.url,
			type: 'get',
			dataType: 'json',
			success: function ( data ) {

				options.localeObject = (options.customJsonParser) ? options.customJsonParser(data) : data;
				
				callback();

			},
			error: function (xhr, textStatus){
				callback();
				throw textStatus.toUpperCase() + ": " + xhr.statusText;

			}
		});
	}

	function get ( key ) {
		
		return options.localeObject[key];

	}

	function localize ( el, opt ) {

		var elKey = el.attr("data-ajson"),
			k = get(elKey);

				
		if(k){

			if( _.isObject(k) ){
				_.each( k, function ( val, key ) {
					
					if( key === "text" ){
						
						el.html(val);

					}else{
						
						if( el.attr(key) === "" ){
							el.attr(key,val);
						}
					}

				});
			}else{
				el.html(k);
			}
		}

	}

	// public api interface
	ajson.init = init;
	ajson.options = options;
	ajson.get = get;

})();