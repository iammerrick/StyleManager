(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        root.StyleManager = factory();
    }
}(this, function () {
    var arrayToString = function(arr) {
     return arr.join('\n');
    };
    
    var fragment = function(key, css) {
      var buffer = [];
      buffer.push('/* Source: ' + key + ' */');
      buffer.push(css);
      return arrayToString(buffer);
    };
    var AbstractRenderer = function() {};
    
    AbstractRenderer.prototype.name = function(name) {
    
      if ( ! name) {
        return this.el.id || false;
      }
    
      this.el.id = name;
    };
    
    AbstractRenderer.prototype.clean = function() {
      var child;
      while (this.el.firstChild) {
        child = this.el.firstChild;
        this.el.removeChild(child);
      }
    };
    
    AbstractRenderer.prototype.getElement = function() {
      return this.el;
    };
    var Renderer = function() {
      var head;
      
      this.el = document.createElement('style');
      
      head = document.getElementsByTagName('head')[0];
      head.appendChild(this.el);
    };
    
    Renderer.prototype = new AbstractRenderer();
    
    Renderer.prototype.render = function(stylesheets, changed) {
      var i, stylesheet;
      while (changed.length > 0) {
        i = changed.length - 1;
        stylesheet = stylesheets[changed[i]];
        
        if (stylesheet.previous) {
          this.el.removeChild(stylesheet.previous.node);
        }
        
        this.el.appendChild(stylesheet.node);
        changed.splice(i, 1);
      }
    };
    var IERenderer = function() {
      this.el = document.createStyleSheet();
    };
    
    IERenderer.prototype = new AbstractRenderer();
    
    IERenderer.prototype.render = function(stylesheets, changed) {
      var buffer = [];
      var key;
      
      for (key in stylesheets) {
        buffer.push(stylesheets[key].source);
      }
      
      buffer = arrayToString(buffer);
      
      this.clean();
      
      this.el.cssText = buffer;
    };
    
    
     
    var StyleManager = function(name) {
      this.setRenderer(name);
      
      this.stylesheets = {};
      this.changed = [];
    };
    
    StyleManager.prototype.setRenderer = function(name) {
      if (document.createStyleSheet) {
        this.renderer = new IERenderer();
      } else {
        this.renderer = new Renderer();
      }
      
      this.renderer.name(name);
    };
    
    StyleManager.prototype.register = function(key, source) {
      var previous = false;
      source = fragment(key, source);
      
      this.changed.push(key);
      
      if (this.stylesheets[key]) {
        previous = this.stylesheets[key];
      }
      
      this.stylesheets[key] = {
        source: source,
        node: document.createTextNode(source)
      };
      
      this.stylesheets[key].previous = previous;
      
      this.render();
      
      return this;
    };
    
    StyleManager.prototype.name = function(name) {
      return this.renderer.name(name);
    };
    
    StyleManager.prototype.clean = function() {
      this.renderer.clean();
    };
    
    StyleManager.prototype.render = function() {
      
      this.renderer.render(this.stylesheets, this.changed);
      
      return this;
    };
    
    StyleManager.prototype.getRenderer = function() {
      return this.renderer;
    };
    return StyleManager;
}));