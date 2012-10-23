//= helpers.js
//= renderers/AbstractRenderer.js
//= renderers/Renderer.js
//= renderers/IERenderer.js
 
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