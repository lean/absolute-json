(function () {

	var root = this,
		$ = root.jQuery,
		_ = root._,
		i18np = {};

	// defaults
	var options = {
		localeUrl: "",
		localeObject: {},
		customJsonParser : null
	}

	// Export the i18next object for **CommonJS**. 
	// If we're not in CommonJS, add `i18np` to the
	// global object or to jquery.
	if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = i18np;
	} else {
		if($) {
			$.i18np = $.i18np || i18np;
		}

		root.i18np = root.i18np || i18np;
	}

	function init(opt, callback) {
		
		options.localeUrl = opt.localeUrl;
		options.customJsonParser = opt.customJsonParser;

		loadResource({
			url:opt.localeUrl
		}, callback );

		$.fn.i18np = function (options) {

				// localize childs
				var elements = $(this).find('[data-i18np]');

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

		var elKey = el.attr("data-i18np"),
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
	i18np.init = init;
	i18np.options = options;
	i18np.get = get;

})();