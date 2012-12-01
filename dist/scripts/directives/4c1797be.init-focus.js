'use strict';

imqsBsApp.directive('initFocus', function() {
    var timer;    
    return function(scope, elm, attr) {
        if (timer) clearTimeout(timer);
        
        timer = setTimeout(function() {
            elm.focus();
            console.log('focus', elm);
        }, 0);
    };
});