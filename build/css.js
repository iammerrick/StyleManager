/*jshint */
/*global define, window, XMLHttpRequest, importScripts, Packages, java,
  ActiveXObject, process, require, console */
define(function() {
  
  var arrayToString = function(arr) {
   return arr.join('\n');
  };
  
  var fragment = function(key, css) {
    var buffer = [];
    buffer.push('/* Source: ' + key + ' */');
    buffer.push(css);
    return arrayToString(buffer);
  };
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
      
  var fs, getXhr,
      progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
      fetchText = function () {
          throw new Error('Environment unsupported.');
      },
      buildMap = {};
  
  if (typeof process !== "undefined" &&
             process.versions &&
             !!process.versions.node) {
      //Using special require.nodeRequire, something added by r.js.
      fs = require.nodeRequire('fs');
      fetchText = function (path, callback) {
          callback(fs.readFileSync(path, 'utf8'));
      };
  } else if ((typeof window !== "undefined" && window.navigator && window.document) || typeof importScripts !== "undefined") {
      // Browser action
      getXhr = function () {
          //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
          var xhr, i, progId;
          if (typeof XMLHttpRequest !== "undefined") {
              return new XMLHttpRequest();
          } else {
              for (i = 0; i < 3; i++) {
                  progId = progIds[i];
                  try {
                      xhr = new ActiveXObject(progId);
                  } catch (e) {}
  
                  if (xhr) {
                      progIds = [progId];  // so faster next time
                      break;
                  }
              }
          }
  
          if (!xhr) {
              throw new Error("getXhr(): XMLHttpRequest not available");
          }
  
          return xhr;
      };
  
      fetchText = function (url, callback) {
          var xhr = getXhr();
          xhr.open('GET', url, true);
          xhr.onreadystatechange = function (evt) {
              //Do not explicitly handle errors, those should be
              //visible via console output in the browser.
              if (xhr.readyState === 4) {
                  callback(xhr.responseText);
              }
          };
          xhr.send(null);
      };
      // end browser.js adapters
  } else if (typeof Packages !== 'undefined') {
      //Why Java, why is this so awkward?
      fetchText = function (path, callback) {
          var encoding = "utf-8",
              file = new java.io.File(path),
              lineSeparator = java.lang.System.getProperty("line.separator"),
              input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
              stringBuffer, line,
              content = '';
          try {
              stringBuffer = new java.lang.StringBuffer();
              line = input.readLine();
  
              // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
              // http://www.unicode.org/faq/utf_bom.html
  
              // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
              // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
              if (line && line.length() && line.charAt(0) === 0xfeff) {
                  // Eat the BOM, since we've already found the encoding on this file,
                  // and we plan to concatenating this buffer with others; the BOM should
                  // only appear at the top of a file.
                  line = line.substring(1);
              }
  
              stringBuffer.append(line);
  
              while ((line = input.readLine()) !== null) {
                  stringBuffer.append(lineSeparator);
                  stringBuffer.append(line);
              }
              //Make sure we return a JavaScript string and not a Java string.
              content = String(stringBuffer.toString()); //String
          } finally {
              input.close();
          }
          callback(content);
      };
  }
  
  return {
    load: function(name, require, load, config) {
      var path = require.toUrl(name);
      
      fetchText(path, function(text) {
        var sm = new StyleManager(path);
        sm.register(path, text);
        load(sm);
      });
    }
  };
  
});