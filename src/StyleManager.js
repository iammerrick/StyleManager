/**
 * StyleManager
 */
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
};

StyleManager.prototype.register = function(key, source) {
  this.stylesheets[key] = source;
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
  var output = [];
  var key, src;

  for (key in this.stylesheets) {
    src = this.stylesheets[key];
    output.push('/* Source: ' + key + ' */');
    output.push(src);
  }
  
  output = output.join('\n');
  
  this.clean();
  
  if (this.el.cssText !== undefined) {
    this.el.cssText = output;
  } else {
    this.el.appendChild(document.createTextNode(output));
  }
  
  return this;
};