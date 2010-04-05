var sys = require("sys");
/**
express github
*/
/**
* Parse an HTTP _cookie_ string into a hash.
*
* @param {string} cookie
* @return {hash}
* @api public
*/
exports.parseCookie = function(cookie) {
  return cookie.replace(/^ *| *$/g, '').split(/ *; */).reduce(function(hash, pair){
    var parts = pair.split(/ *= */)
    hash[parts[0]] = parts[1]
    return hash
  }, {})
}

/**
* Compile cookie _name_, _val_ and _options_ to a string.
*
* @param {string} name
* @param {string} val
* @param {hash} options
* @return {string}
* @api public
*/
exports.compileCookie = function(name, val, options) {
  if (!options) return name + '=' + val
  return name + '=' + val + '; ' + options.map(function(val, key){
    if (val instanceof Date)
      val = val.toString()
        .replace(/^(\w+)/, '$1,')
        .replace(/(\w+) (\d+) (\d+)/, '$2-$1-$3')
        .replace(/GMT.*$/, 'GMT')
    return val === true ? key : key + '=' + val
  }).join('; ')
}
