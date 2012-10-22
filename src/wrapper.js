(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        root.StyleManager = factory();
    }
}(this, function () {
    //= StyleManager.js
    return StyleManager;
}));