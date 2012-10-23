(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        root.StyleManager = factory();
    }
}(this, function () {
    /*jshint devel:true*/
    /**
     * StyleManager
     */
     
    var arrayToString = function(arr) {
     return arr.join('\n');
    };
     
    var fragment = function(key, css) {
      var buffer = [];
      buffer.push('/* Source: ' + key + ' */');
      buffer.push(css);
      return arrayToString(buffer);
    };
     
    var StyleManager = function(name) {
      var el, head;
      
      if (document.createStyleSheet) {
        el = document.createStyleSheet();
      }
      else {
        el = document.createElement('style');
        head = document.getElementsByTagName('head')[0];
        head.appendChild(el);
      }
      
      
      this.el = el;
      
      this.name(name);
      this.stylesheets = {};
      this.changed = [];
    };
    
    StyleManager.prototype.name = function(name) {
      
      if ( ! name) {
        return this.el.id || false;
      }
      
      this.el.id = name;
    };
    
    StyleManager.prototype.register = function(key, source) {
      source = fragment(key, source);
      
      this.changed.push(key);
      
      if (this.stylesheets[key] && !this.el.cssText) {
        this.el.removeChild(this.stylesheets[key].node);
      }
      
      this.stylesheets[key] = {
        source: source,
        node: document.createTextNode(source)
      };
      
      this.render();
      
      return this;
    };
    
    StyleManager.prototype.clean = function() {
      var child;
      while (this.el.firstChild) {
        child = this.el.firstChild;
        this.el.removeChild(child);
      }
    };
    
    StyleManager.prototype.render = function() {
      
      if (this.el.cssText !== undefined) {
        return this.renderIE();
      }
      
      while (this.changed.length > 0) {
        var i = this.changed.length - 1;
        var stylesheet = this.stylesheets[this.changed[i]];
        
        this.el.appendChild(stylesheet.node);
        this.changed.splice(i, 1);
      }
      
      return this;
    };
    
    StyleManager.prototype.renderIE = function() {
      var buffer = [];
      var key;
      
      for (key in this.stylesheets) {
        buffer.push(this.stylesheets[key].source);
      }
      
      buffer = arrayToString(buffer);
      
      this.clean();
      
      this.el.cssText = buffer;
    };
    return StyleManager;
}));