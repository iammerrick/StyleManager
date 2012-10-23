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