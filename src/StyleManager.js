/**
 * StyleManager
 */
var StyleManager = function() {
  var el;
  
  if (document.createStyleSheet) {
    el = document.createStyleSheet();
  }
  else {
    el = document.createElement('style');
  }
  
  this.el = el;
  this.stylesheets = {};
};

StyleManager.prototype.register = function(key, source) {
  this.stylesheets[key] = source;
  return this;
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
  
  if (this.el.hasOwnProperty('cssText')) {
    this.el.cssText = output;
  } else {
    this.el.appendChild(document.createTextNode(output));
  }
  
  return this;
};