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
 
var StyleManager = function() {
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
  this.stylesheets = {};
  this.changed = [];
};

StyleManager.prototype.register = function(key, source) {
  var previous;
  source = fragment(key, source);
  
  this.changed.push(key);
  
  if (this.stylesheets[key]) {
    previous = this.stylesheets[key];
  }
  
  this.stylesheets[key] = {
    source: source,
    node: document.createTextNode(source)
  };
  
  if (previous) {
    this.stylesheets[key].previous = previous;
  }
  
  
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
    
    if (stylesheet.previous) {
      this.el.removeChild(stylesheet.previous.node);
    }
    
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