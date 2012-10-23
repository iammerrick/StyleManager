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