var expect = chai.expect;

describe('Initialization', function() {
	
	var abjson = window.abjson;
    
  it('should be exist', function() {
		expect(abjson).to.exist;
	});

  it('expect a resource url or a resource for json', function() {
		if (abjson.options.sourceUrl)
			expect(abjson.options.sourceUrl).to.be.a("string");
		else if (abjson.options.source)
			expect(abjson.options.source).to.be.an("object");
		else throw new Error('Expected [sourceUrl] or [source]');
	});

 	it('should load a json', function() {
		expect(abjson.options.localeObject).to.be.a("object").to.not.be.empty;
	});

});

describe('Keys', function() {
	
	var abjson = window.abjson;
    
	it('expect a getter function', function() {
		expect(abjson.get).to.exist;
	});

	it('expect a value for a given key', function() {
		expect(abjson.get("google")).to.equal("http://www.google.com");
	});

	it('expect an undefined value for an non existing key', function() {
		expect(abjson.get("xswq23d")).to.be.undefined;
	});

});

describe('DOM manipulation', function () {
	
	var abjson = window.abjson;

	it ("should be a method of jQuery", function () {
		expect($.abjson).to.exist;
	});

	it ("should be translated all the body", function () {

		$("body").abjson();
				
		expect($(".linkGitHub").html()).to.equal("Explore GitHub");
		
	})

	it ("should be translated all the attr", function () {
		expect($(".linkGitHub").attr("href")).to.equal("https://github.com/explore");
	})

})