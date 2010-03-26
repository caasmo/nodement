var sys = require('sys');
var fs = require('fs');
var http = require('http');
var url_parse = require("url").parse;

function router(){

  var routes = [];
    
  // Adds a route the the current server
  function addRoute(method, pattern, handler) {
    if (typeof pattern === 'string') {
      pattern = new RegExp("^" + pattern + "$");
    }
    var route = {
      method: method,
      pattern: pattern,
      handler: handler
    };
   
    routes.push(route);
  }

  return {
    addRoute: addRoute,
    //listen: listen,
    //close: close
  };

  
}

function doRoute() {
      uri = url_parse(req.url);
      path = uri.pathname;
      
      for (var i = 0, l = routes.length; i < l; i += 1) {
        var route = routes[i];
        if (req.method === route.method) {
          var match = path.match(route.pattern);
          if (match && match[0].length > 0) {
            match.shift();
            match = match.map(unescape);
            match.unshift(res);
            match.unshift(req);
            /*
            if (route.format !== undefined) {
              var body = "";
              req.setBodyEncoding('utf8');
              req.addListener('data', function (chunk) {
                body += chunk;
              });
              req.addListener('end', function () {
                if (route.format === 'json') {
                  body = JSON.parse(unescape(body));
                }
                match.push(body);
                route.handler.apply(null, match);
              });
              return;
            }
            */
            route.handler.apply(null, match);
            return;
          }
        }
      }
 
      notFound(req, res);
}
