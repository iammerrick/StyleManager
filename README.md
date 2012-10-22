# StyleManager

StyleManager is a low level library that manages a style tag, useful for thick client development where CSS styles are explicit dependencies for components.

## Download

- [StyleManager.js](http://raw.github.com/iammerrick/StyleManager/master/build/StyleManager.js)
- [StyleManager.min.js](http://raw.github.com/iammerrick/StyleManager/master/build/StyleManager.min.js)

## Usage

StyleManager is meant to be leveraged by build tools to assist in managing styles for complex thick client applications.

### constructor

```javascript

var styles = new StyleManager();
```

### register

```javascript
styles.register('component', 'h1 { color: #FF6600; }');
```

### render

```javascript
// Add the element to the DOM
document.getElementsByTagName('head')[0].appendChild(styles.el);

// Render the styles
styles.render();
```

## Build

`npm install && grunt build`

## Author

- Name: Merrick Christensen
- Twitter: [@iammerrick](http://twitter.com/iammerrick)

## Credits

The work done at [Instructure](https://github.com/instructure/canvas-lms/blob/stable/app/coffeescripts/util/registerTemplateCss.coffee) and [Rdio](http://rdio.com).

## License

Available via the MIT or new BSD license.