/*
absolute-json
version 0.8
author: Leandro Cabrera
https://github.com/lean/absolute-json
Licensed under the MIT license.
*/

(function () {
  "use strict";
  // defaults
  var options = {
    source: null,
    sourceUrl: "",
    localeObject: {}
  };
  var abjson = {};

  // helpers
  function abjError ( name, message ) {
    this.name = name;
    this.message = message || "error";
  }

  abjError.prototype = new Error();
  abjError.prototype.constructor = abjError;

  function forEach (obj, iterator, context) {
    if (!obj){
      return;
    }
    if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (iterator.call(context, obj[i], i, obj) === {}){
          return;
        }
      }
    } else {
      for (var key in obj) {
        if ( obj.hasOwnProperty(key) ) {
          if (iterator.call(context, obj[key], key, obj) === {}) {
            return;
          }
        }
      }
    }

  }

  function setSource ( source ) {
    options.source = source;
  }

  function get ( key ) {
    return options.source[key] ?
            wildcardReplace(options.source[key], Array.prototype.slice.call(arguments, 1)) :
            undefined;
  }

  function updateElements(el) {

    var elKey = el.attributes["data-abjson"].value,
        elReplaceAttr = el.attributes["data-abjson-r"],
        elAttrSelector = el.attributes["data-abjson-attr"],
        updateElementsText = options.source[elKey];

    if (typeof updateElementsText !== "undefined") {

      if (updateElementsText === Object(updateElementsText)) {

        forEach(updateElementsText, function (val, key) {

          if (key === "text") {
            if (elReplaceAttr) {
              if (elAttrSelector) {
                el.setAttribute(elAttrSelector, wildcardReplace(updateElementsText, elReplaceAttr.value.split("|")));
              } else {
                el.innerHTML = wildcardReplace(updateElementsText, elReplaceAttr.value.split("|"));
              }
            } else {
              if (elAttrSelector) {
                el.setAttribute(elAttrSelector, val);
              } else {
                el.innerHTML = val;
              }
            }
          } else {
            el.attributes[key].value = val;
          }
        });

      } else {

        if (elReplaceAttr) {
          if (elAttrSelector) {
            el.setAttribute(elAttrSelector, wildcardReplace(updateElementsText, elReplaceAttr.value.split("|")));
          } else {
            el.innerHTML = wildcardReplace(updateElementsText, elReplaceAttr.value.split("|"));
          }
        } else {
          if (elAttrSelector) {
            el.setAttribute(elAttrSelector, updateElementsText);
          } else {
            el.innerHTML = updateElementsText;
          }
        }

      }

    } else {
      //key not found
      el.innerHTML = elKey + " NOT FOUND";
    }

  }

  function wildcardReplace ( text, replaceElements ) {

    var i,
      replacedText = text,
      replaceElementsLength = replaceElements.length;

    for( i=0; i < replaceElementsLength; i++ ) {
      replacedText = replacedText.replace( new RegExp("%" + (i+1), "ig"), replaceElements[i] );
    }

    return replacedText;

  }

  function findElements(el, opt){
    var elements = [];

    if (!el) {el = document;}
    elements =  Array.prototype.slice.call(el.querySelectorAll("[data-abjson]"));
    forEach( elements, function (v) {
      updateElements( v, opt );
    });
  }

  // public api interface
  abjson.setSource = setSource;
  abjson.options = options;
  abjson.get = get;
  abjson.updateElements = findElements;
  window.abjson = abjson;

})();