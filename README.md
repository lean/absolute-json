# absolute-json
=========

![logo](logo.gif)

A complete tool to maintain all the front-end through a json. You can manipulate all text and HTML attributes automatically.

* The best way to work with config files
* Use it as localization library
* Dynamic loading json files
* Fast startup, lightweight
* Easy to maintain
* Errors and warnings

## Examples

#####Bind your texts with the source json
```javascript
//file: source.json
{
	"title" : "GitHub",
	"text" : "GitHub · Build software better, together."
}
```
in your html
```html

<h3 data-abjson='title'></h3>
<p data-abjson='text'></p>
```
becomes
```html
<h3 data-abjson='title'>GitHub</h3>
<p data-abjson='text'>GitHub · Build software better, together.</p>
```


#####Bind html attributes
You can work with objects in the source. The default property for the html text in an object will be "text". If you specified an html attribute it will be replaced
```javascript
//file: source.json
{
	"githubLink" : {
		"text" : "GitHub · Build software better",
		"href" : "https://github.com/"
	}
}
```
in your html
```html
<a data-abjson='githubLink' href=''></a>
```
becomes
```html
<a data-abjson='github' href='https://github.com/'>GitHub · Build software better</a>
```

## Getting started
create a file that will be the source of all your texts and HTML attributes

```javascript

//file: text-sources.json

{
  "greeting" : "Hello!!!",
  "githubLink" : {
    "text" : "GitHub · Build software better, together.",
    "href" : "http://www.github.com"
  }
}
```

now in your HTML import the lib


```html

<!-- file: example.html -->

<script src="absolute-json.js">

```

Add the *data-abjson* attribute to the HTML elements

```html
<p data-abjson='greeting'></p>
<a src='' data-abjson='githubLink'></a>
```

init the lib

```javascript
abjson.init({
    sourceUrl : 'text-sources.json',
  }, function(err){
    if (err) {
      throw err;
    }

    //update the dom
    $(body).abjson();
});
```
## Methods
###abjson.init (options, callback)
load the resource file and init the library. 

load resource from memory
```javascript
var jsonData = {
  "hello": "hola"
};

abjson.init({
    source : jsonData,
  }, function(err){
  if (err) {
    throw err;
  }

  //update the dom
  $(body).abjson();
});
```

##Contribute
1. install some HTTP static server pointing to root directory (i.e. npm install -g wup)
2. open your browser and run tests from http://localhost:8080
3. pull request
4. get some vodka ;)

#changelog:
###0.6  
- Added support to load json from reference (not a file URL)  
###0.5
- Many improvements
- Removed underscorejs dependency
