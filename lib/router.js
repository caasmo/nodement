var sys = require('sys');
var http = require('http');
var url_parse = require("url").parse;

exports.createRouter = create;



// Create Router
function create(){

  var routes = [];
    
  function addRoute(method, pattern, handler) {
    if (typeof pattern === 'string') {
      pattern = new RegExp("^" + pattern + "$");
    }
    
    var route = {
      method: method,
      pattern: pattern,
      handler: handler,
    };
   
    routes.push(route);
  }
  
  function getRoute(req) {
      uri = url_parse(req.url);
      path = uri.pathname;
      
      for (var i = 0, l = routes.length; i < l; i += 1) {
        var route = routes[i];
        if (req.method === route.method) {
          var match = path.match(route.pattern);
          if (match && match[0].length > 0) {
            routes[i].matches = match;
            return routes[i];
          }
        }
      }
 
      return false;
  }
  

  return {
    routes : routes,
    addRoute: addRoute,
    getRoute: getRoute,
    //close: close
  };

  
}


