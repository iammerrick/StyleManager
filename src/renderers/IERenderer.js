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

