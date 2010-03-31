var sys = require('sys');
var http = require('http');
var url_parse = require("url").parse;
var ALLROUTES_CHAIN_LABEL = "allRoutes";

exports.createRouter = create;

// TODO move to chainer??
function errorChainMain(req, res, ndt){
   process.nextTick(function(){
     sys.puts("errorChainMain called");
     ndt.next();
  });
 ; 
}

function allRoutesMain(req, res, ndt){
  ndt.next();
}

function sendResponse( req, res, ndt){
    
    sys.puts('allRoutesMain');
      len = res.body.length;
      res.writeHead(200, {
      "Content-Length": len,
      "Content-Type": "text/plain"});
      res.write(res.body);
      res.close();  
}


// Create Router
function create(){

  var routes = {};
  
  // create route.   
  function addRoute(name, method, pattern, handler) {
    if (typeof pattern === 'string') {
      pattern = new RegExp("^" + pattern + "$");
    }
    
    var route = {
      name: name, 
      method: method,
      pattern: pattern,
      handler: handler,
      plugins:{pre:[], post:[]}
    };
    
    
    routes[name] = route;
    return route;
  }
  
  // get the roote and save the match in response object
  function doRoute(req, res) {
      var uri = url_parse(req.url);
      var path = uri.pathname;
      
      for (var routeName in routes) {
        var route = routes[routeName];
       
        if (req.method === route.method) {
          
          var match = path.match(route.pattern);
          if (match && match[0].length > 0) {
            // TODO named properties params in response como query string
            res.matches = match;
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
      
      var route = firstArg;  // Object
    }
  
    var hook = 'pre';
    
    var last = args[args.length-1];
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

  function createChain(route){
    //var routes = routes || [];
    var preFuncs = route.plugins.pre || [];
    var postFuncs = route.plugins.post || [];
    var preAllFuncs = routes[ALLROUTES_CHAIN_LABEL].plugins.pre || [];
    var postAllFuncs = routes[ALLROUTES_CHAIN_LABEL].plugins.post || [];
    return  [].concat(preAllFuncs, preFuncs, route.handler, postFuncs, postAllFuncs);
  
  }
  //add error plugin
  addRoute('errorRoute', 'GET', null, errorChainMain);
  // add allRoutes
  addRoute(ALLROUTES_CHAIN_LABEL, 'GET', null, allRoutesMain);
  addPlugin('allRoutes', sendResponse, 'post');
  
  return {
    routes : routes,
    addRoute: addRoute,
    doRoute: doRoute,
    addPlugin: addPlugin,
    createChain: createChain
    //close: close
  };

  
}



