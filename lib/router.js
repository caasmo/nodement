var sys = require('sys');
var http = require('http');
var url_parse = require("url").parse;

exports.createRouter = create;

// TODO move to chainer??
function errorChainMain(obj1, obj2, ndt){
   process.nextTick(function(){
     sys.puts("errorChainMain called");
     ndt.next();
  });
 ;
  
}

// Create Router
function create(){

  //var routes = [];
  var routes = {};
  
  // cresate route.   
  function addRoute(name, method, pattern, handler) {
    if (typeof pattern === 'string') {
      pattern = new RegExp("^" + pattern + "$");
    }
    
    var route = {
      name: name, // weg
      method: method,
      pattern: pattern,
      handler: handler,
      plugins:{pre:[], post:[]}
    };
    
    
    routes[name] = route;
    return route;
  }
  
  function getRoute(req) {
      var uri = url_parse(req.url);
      var path = uri.pathname;
      
      for (var routeName in routes) {
        var route = routes[routeName];
        //sys.puts(JSON.stringify(route));
        //var route = routes[i];
        if (req.method === route.method) {
          
          var match = path.match(route.pattern);
          if (match && match[0].length > 0) {
            route.matches = match;
            return route;
          }
        }
      }
 
      return false;
  }

  // add plugin to handler
  function addPlugin (){
    var args = Array.prototype.slice.call(arguments);
    var firstArg =  args.shift(); 
    if (typeof firstArg === 'string') {
      var route = routes[firstArg];
    } else {
      //sys.puts(typeof firstArg);
      var route = firstArg;  // Object
    }
    //if (typeof args[0] !== 'function') return;
    
    //sys.puts(JSON.stringify(route));
    var hook = 'pre';
    
    var last = args[args.length-1];
    //sys.puts(last.name);
    if (typeof last === 'string'){
      args.pop();
      if(last === 'post' ){
        hook = 'post';
      }
    }  
   
    if (hook === 'post'){
      Array.prototype.push.apply(route.plugins.post, args);
    } else {
     
      Array.prototype.push.apply(route.plugins.pre, args);
    }  
  
  }

    
  
  //add error plugin
  addRoute('errorRoute', 'GET', null, errorChainMain)
  
  return {
    routes : routes,
    addRoute: addRoute,
    getRoute: getRoute,
    addPlugin: addPlugin
    //close: close
  };

  
}


