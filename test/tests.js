var expect = chai.expect;

describe('Initialization', function() {

	var abjson = window.abjson;

  it('should be exist', function() {
		expect(abjson).to.exist;
	});

  it('expect a source', function() {
		if  (abjson.options.source)
			expect(abjson.options.source).to.be.an("object");
		else throw new Error('Expected [source]');
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

describe('Keys templating', function(){

	var abjson = window.abjson;

	it('expect get to support simple templating with %1 %2 -like', function(){
		var nickname = 'vodkaGuy';
		expect(abjson.get("greet", nickname)).to.equal("hello vodkaGuy");
	});

	it('expect get to leave %1 as it is if no extra parameter provided', function(){
		expect(abjson.get("greet")).to.equal("hello %1");
	});

	it('expect get to support multiple parameters', function(){
		expect(abjson.get("points", "100", "1")).to.equal("you points: 100 - your position: 1");
	});

	it('expect get to replace %1 but not %2 if only one extra parameter provided', function(){
		expect(abjson.get("points", "100")).to.equal("you points: 100 - your position: %2");
	});

	it('expect get to support repeated values in the template', function(){
		expect(abjson.get("confirm", "blue", "red")).to
			.equal("The color you selected is blue. Wanna replace red with blue?");
	});

	it('expect get to replace %1 and %2 even with falsy values', function(){
		expect(abjson.get("points", 0, "")).to.equal("you points: 0 - your position: ");
	});

	it('expect an undefined value for an non existing key when providing multiple parameters', function(){
		expect(abjson.get("key-that-does-not-exist", ':facepalm:', 'number')).to.be.undefined;
	});

});

describe('DOM manipulation', function(){

	var abjson = window.abjson;

	it("should be translated all the body", function (){

		abjson.updateElements();

		expect($(".linkGitHub").html()).to.equal("Explore GitHub");

	});

	it("should be translated all the attr", function(){
		expect($(".linkGitHub").attr("href")).to.equal("https://github.com/explore");
	});

	it("should allow templating replacement through data-abjson-r attr", function(){
		expect($(".points").text()).to.equal("you points: 14 - your position: 5");
	});

	it("should support templates with repeated values", function(){
		expect($(".confirm").text()).to
			.equal("The color you selected is blue. Wanna replace red with blue?");
	});
})