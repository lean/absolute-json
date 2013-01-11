# absolute-json
=========

A complete tool to maintain all the front-end through a json. You can manipulate all text and HTML attributes automatically.

## Features
* Easy to maintain
* The best way to work with i18n files
* Fast startup, lightweight
* Loading asynchronous json files
* Errors and warnings

### Getting started
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
