//absolute-ajax
//----------------
//version 0.1
//author: Leandro Cabrera (leaocabrera@gmail.com)
//https://github.com/lean/
//Licensed under the MIT license.


(function () {

    var abjax = {},
        breaker = {},
        noop = function () {},
        each = function(obj, iterator, context) {
          if (obj == null) return obj;
          if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
            obj.forEach(iterator, context);
          } else if (obj.length === +obj.length) {
            for (var i = 0, length = obj.length; i < length; i++) {
              if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
          } else {
            var keys = keys(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
              if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
            }
          }
          return obj;
        },
        has = function(obj, key) {
          return hasOwnProperty.call(obj, key);
        },
        isFunction = function(obj) {
          return typeof obj === 'function';
        },
        isObject = function(obj) {
          var type = typeof obj;
          return type === 'function' || type === 'object' && !!obj;
        },
        extend = function(obj) {
          if (!_.isObject(obj)) return obj;
              var source, prop;
              for (var i = 1, length = arguments.length; i < length; i++) {
                source = arguments[i];
                for (prop in source) {
                  obj[prop] = source[prop];
                }
              }
              return obj;
        },
        keys = function(obj) {
          if (!isObject(obj)) return [];
          if (Object.prototype.keys) return Object.prototype.keys(obj);
          var keys = [];
          for (var key in obj) if (has(obj, key)) keys.push(key);
          return keys;
        };

    abjax.param = function (obj, prefix) {
        var str = [];

        for (var p in obj) {

            if (isFunction(obj[p])) {
                continue;
            }
            var k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
            str.push(isObject(v) ? abjax.param(v, k) : (k) + "=" + encodeURIComponent(v));
        }

        return str.join("&");
    };

    /* AJAX functions */

    function empty() {}

    abjax.ajaxSettings = {
        type: "GET",
        beforeSend: empty,
        success: empty,
        error: empty,
        complete: empty,
        context: undefined,
        timeout: 0,
        crossDomain: null,
        processData: true,
        cache : false
    };

    abjax.ajax = function (opts) {
        var xhr;
        var settings = opts || {};

        for (var key in abjax.ajaxSettings) {
            if (typeof (settings[key]) === "undefined") {
                settings[key] = abjax.ajaxSettings[key];
            }
        }

        try {
            if (!settings.url) {
                settings.url = window.location;
            }
            if (!settings.headers) {
                settings.headers = {};
            }
            if (!("async" in settings) || settings.async !== false) {
                settings.async = true;
            }
            if (settings.processData && isObject(settings.data)) {
                settings.data = abjax.param(settings.data);
            }

            if (settings.type.toLowerCase() === "get" && settings.data) {
                if (settings.url.indexOf("?") === -1) {
                    settings.url += "?" + settings.data;
                } else {
                    settings.url += "&" + settings.data;
                }
            }
            if (!settings.cache) {
                var rdn = String(Math.random()).split(".")[1];
                if (settings.url.indexOf("?") >= 0) {
                    settings.url += "&_=" + rdn;
                } else {
                    settings.url += "?&_=123" + rdn;
                }
            }

            if (settings.data) {
                if (!settings.contentType && settings.contentType !== false) {
                    settings.contentType = "application/x-www-form-urlencoded; charset=UTF-8";
                }
            }

            if (!settings.dataType) {
                settings.dataType = "application/json";
            }


            if (settings.crossDomain === null) {
                settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
                    RegExp.$2 !== window.location.host;
            }

            if (!settings.crossDomain) {
                settings.headers = extend({
                    "X-Requested-With": "XMLHttpRequest"
                }, settings.headers);
            }

            var abortTimeout;
            var context = settings.context;
            var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.abjax1 : window.location.protocol;

            xhr = new window.XMLHttpRequest();

            xhr.onreadystatechange = function () {
                var mime = settings.dataType;
                if (xhr.readyState === 4) {
                    window.clearTimeout(abortTimeout);
                    var result, error = false;
                    var contentType = xhr.getResponseHeader("content-type") || "";
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0 && protocol === "file:") {

                        if ((contentType === "application/json") || (mime === "application/json" && !(/^\s*abjax/.test(xhr.responseText)))) {
                            try {
                                result = JSON.parse(xhr.responseText);
                            } catch (e) {
                                error = true;
                            }

                        } else {
                            result = xhr.responseText;
                        }
                        //If we're looking at a local file, we assume that no response sent back means there was an error
                        if (xhr.status === 0 && result.length === 0) {
                            error = true;
                        }
                        if (error) {
                            settings.error.call(context, xhr, "parsererror", error);
                        } else {
                            settings.success.call(context, result, "success", xhr);
                        }

                    } else {
                        error = true;
                        settings.error.call(context, xhr, "error");
                    }
                    var respText = error ? "error" : "success";
                    settings.complete.call(context, xhr, respText);
                }
            };

            if (settings.withCredentials) {
                xhr.withCredentials = true;
            }

            if (settings.contentType) {
                settings.headers["Content-Type"] = settings.contentType;
            }

            if (settings.beforeSend.call(context, xhr, settings) === false) {
                xhr.abort();
                return false;
            }

            if (settings.timeout > 0) {
                abortTimeout = window.setTimeout(function () {
                    xhr.onreadystatechange = empty;
                    xhr.abort();
                    settings.error.call(context, xhr, "timeout");
                }, settings.timeout);
            }


            if (window.XDomainRequest) {
                var callback = function (status, statusText, responses) {
                    xdr.onload = xdr.onerror = xdr.ontimeout = function () {};
                    xdr = undefined;
                    settings.success(JSON.parse(responses.text));
                };
                var xdr = new XDomainRequest();
                xdr.onload = function () {
                    callback(200, "OK", {
                        text: xdr.responseText
                    }, "Content-Type: " + xdr.contentType);
                };
                xdr.onerror = function () {
                    callback(404, "Not Found");
                };
                xdr.onprogress = noop;
                xdr.ontimeout = function () {
                    callback(0, "timeout");
                };
                xdr.timeout = settings.timeout || Number.MAX_VALUE;
                xdr.open(settings.type, settings.url);
                xdr.send((settings.hasContent && settings.data) || null);
            } else {
                xhr.open(settings.type, settings.url, settings.async);
                for (var name in settings.headers) {
                    if (typeof settings.headers[name] === "string") {
                        xhr.setRequestHeader(name, settings.headers[name]);
                    }
                }
                xhr.send(settings.data);
            }

        } catch (e) {
            settings.error.call(context, xhr, "error", e);
        }


    };

    window.abjax = abjax;
})();
