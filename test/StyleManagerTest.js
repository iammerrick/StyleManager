/*jshint expr:true */
describe('StyleManager', function() {
  var sm;  
  
  beforeEach(function() {
    sm = new StyleManager();
  });
  
  describe('constructor', function() {
    it('should create a new style tag', function() {
      expect(sm.getRenderer().getElement()).to.exist;
    });
    
    it('should create a new style tag with an id', function() {
      var winning = new StyleManager('winning');
      
      expect(winning.name()).to.equal('winning');
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

      expect(sm.getRenderer().getElement().innerHTML).to.equal('/* Source: feature */\n.some-feature { color: #FF6600; }');
      expect(sm.getRenderer().getElement().tagName).to.equal('STYLE');
    });
    
    it('should not render duplicates if render is called twice', function() {
      sm.register('feature', '.some-feature { color: #FF6600; }')
        .render()
        .render();
    
      expect(sm.getRenderer().getElement().innerHTML).to.equal('/* Source: feature */\n.some-feature { color: #FF6600; }');
      expect(sm.getRenderer().getElement().tagName).to.equal('STYLE');
    });
  });
  
  describe('name', function() {
    it('should set and get the name of the style attribute', function() {
      sm.name('winning');
      expect(sm.name()).to.equal('winning');
    });
    
    it('should set the id of the style attribute', function() {
      sm.name('dominating');
      expect(sm.getRenderer().getElement().id).to.equal('dominating');
    });
  });
});