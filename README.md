# absolute-json
=========

A complete tool to maintain all the front-end through a json. You can manipulate all text and HTML attributes automatically.

* Easy to maintain
* The best way to work with i18n files
* Fast startup, lightweight
* Loading asynchronous json files
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

<link src="absolute-json.js">

```

Add the *data-abjson* attribute to the HTML elements

```html
<p data-abjson='greeting'></p>
<a src='' data-abjson='githubLink'></a>
```

init the lib

```javascript
abjson.init({
  	localeUrl : 'text-sources.json',
		},function(){
      //update the dom
      $(body).abjson();
    });
```
