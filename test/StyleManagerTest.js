/*jshint expr:true */
describe('StyleManager', function() {
  var sm;  
  
  beforeEach(function() {
    sm = new StyleManager();
  });
  
  describe('constructor', function() {
    it('should create a new style tag', function() {
      expect(sm.el).to.exist;
    });
  });
  
  describe('register', function() {
    it('should register the source by a key', function() {
      sm.register('feature', 'h1 a { color: #FF6600; }');
      expect(sm.stylesheets.feature).to.exist;
    });
  });
  
  describe('render', function() {
    it('should render the styles to a style tag', function() {
      sm.register('feature', '.some-feature { color: #FF6600; }')
        .render();

      expect(sm.el.innerHTML).to.equal('/* Source: feature */\n.some-feature { color: #FF6600; }');
      expect(sm.el.tagName).to.equal('STYLE');
    });
  });
});