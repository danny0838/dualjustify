(function($, undefined){

var script_path = (function(){
    var js = document.getElementsByTagName('script');
    return js[js.length - 1].getAttribute('src').match(/(.*)(?:^|\/|\\)bookmarklet.js$/)[1];
})();

// copy options value
var options = {};
if (window.dualJustify) {
    for (var i in window.dualJustify) options[i] = window.dualJustify[i];
    delete(window.dualJustify);
}

// load javascript library
loadJQuery();

function loadJQuery() {
    $ = window.jQuery;
    if (!$) loadJS(script_path + '/jquery.js', loadDualJustify);
    else loadDualJustify();
}

function loadDualJustify() {
    $ = window.jQuery;
    if (!$.dualJustify) loadJS(script_path + '/justify.js', init);
    else init();
}

function init() {
    $(function(){
        $.dualJustify(options);
    });
}

function loadJS() {
    var head = document.getElementsByTagName('head')[0] || document.body,
        args = arguments,
        loaded = {},
        callback = args[args.length - 1];

    if (typeof callback !== 'function') callback = null;
    else delete(args[args.length - 1]);

    for (var i in args) {
        var js = document.createElement('script'), url = args[i];
        loaded[url] = false;
        if (callback) {
            js.onload = checkonload;  // most browsers
            js.onreadystatechange = checkonreadystatechange;  // IE 6 & 7
        }
        js.src = url;
        head.appendChild(js);
        // head.removeChild(js);
    }

    function checkonreadystatechange() {
        var url = this.getAttribute('src');
        if (this.readyState == 'complete' && !loaded[url]) {
            loaded[url] = true;
            checkcallback();
        }
    }

    function checkonload() {
        var url = this.getAttribute('src');
        if (!loaded[url]) {
            loaded[url] = true;
            checkcallback();
        }
    }

    function checkcallback() {
        var fail = false;
        for (var i in loaded) {
            if (!loaded[i]) {
                fail = true;
                break;
            }
        }
        if (!fail) {
            callback();
        }
    }
}

})();