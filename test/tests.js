var expect = chai.expect,
	should = chai.should();

describe('Initialization', function() {
	
	var i18np = window.i18np;
    
    it('should be exist', function() {
		expect(i18np).to.exist;
		expect(i18np.init).to.exist;
	});

    it('expect a resource url for json', function() {
		expect(i18np.options.localeUrl).to.be.a("string");
	});

 	it('should load a json', function() {
		expect(i18np.options.localeObject).to.be.a("object").to.not.be.empty;
	});

});

describe('Keys', function() {
	
	var i18np = window.i18np;
    
	it('expect a getter function', function() {
		expect(i18np.get).to.exist;
	});

	it('expect a value for a given key', function() {
		expect(i18np.get("google")).to.equal("http://www.google.com");
	});

	it('expect an undefined value for an not existing key', function() {
		expect(i18np.get("xswq23d")).to.be.undefined;
	});

});

describe('DOM manipulation', function () {
	
	var i18np = window.i18np;

	it ("should be a method of jQuery", function () {
		expect($.i18np).to.exist;
	});

	it ("should be translated all the body", function () {
		$("body").i18np();
		expect($(".linkGitHub").html()).to.equal("Explore GitHub");
	})

	it ("should be translated all the attr", function () {
		$("body").i18np();
		expect($(".linkGitHub").attr("href")).to.equal("https://github.com/explore");
	})

})