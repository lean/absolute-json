var expect = chai.expect,
	should = chai.should();

describe('Initialization', function() {
	
	var ajson = window.ajson;
    
    it('should be exist', function() {
		expect(ajson).to.exist;
		expect(ajson.init).to.exist;
	});

    it('expect a resource url for json', function() {
		expect(ajson.options.localeUrl).to.be.a("string");
	});

 	it('should load a json', function() {
		expect(ajson.options.localeObject).to.be.a("object").to.not.be.empty;
	});

});

describe('Keys', function() {
	
	var ajson = window.ajson;
    
	it('expect a getter function', function() {
		expect(ajson.get).to.exist;
	});

	it('expect a value for a given key', function() {
		expect(ajson.get("google")).to.equal("http://www.google.com");
	});

	it('expect an undefined value for an not existing key', function() {
		expect(ajson.get("xswq23d")).to.be.undefined;
	});

});

describe('DOM manipulation', function () {
	
	var ajson = window.ajson;

	it ("should be a method of jQuery", function () {
		expect($.ajson).to.exist;
	});

	it ("should be translated all the body", function () {
		$("body").ajson();
		expect($(".linkGitHub").html()).to.equal("Explore GitHub");
	})

	it ("should be translated all the attr", function () {
		$("body").ajson();
		expect($(".linkGitHub").attr("href")).to.equal("https://github.com/explore");
	})

})