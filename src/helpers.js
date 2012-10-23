var arrayToString = function(arr) {
 return arr.join('\n');
};

var fragment = function(key, css) {
  var buffer = [];
  buffer.push('/* Source: ' + key + ' */');
  buffer.push(css);
  return arrayToString(buffer);
};