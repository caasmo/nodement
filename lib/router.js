var sys = require('sys'),
    http = require('http'),
    url_parse = require("url").parse,
    session = require("session");
    ALLROUTES_CHAIN = "allRoutes";


exports.createRouter = create;

// TODO move to chainer??
function errorChainMain( ndt){
   process.nextTick(function(){
     sys.puts("errorChainMain called");
     ndt.next();
  });
}

function allRoutesMain( ndt){
  ndt.next();
}

function addStandardHeaders( ndt){
    len = ndt.response.body.length;
    ndt.response.headers["Content-Length"] = len;  
    ndt.response.headers["Content-Type"] = "text/plain";
    ndt.next();  
}

function sendResponse(  ndt){
      //sys.puts('allRoutesMain');
      ndt.response.writeHead(200, ndt.response.headers);
      ndt.response.write(ndt.response.body);
      ndt.response.close();  
}

function addHelpers(module, container){
    container[module.pluginName] = {};
    // TODO check module collisions
    container["modules"].push(module.pluginName); 
    for (var p in module.helpers) {  
      if(module.helpers.hasOwnProperty(p)){
        // if function TODO
        container[module.pluginName][p] = (function(){
            // muss execute the function to create local variable for each p
            // if function not executed, p is always the last value when called. 
            var local = p; 
            return function(){           
              var args = Array.prototype.slice.call(arguments);              
              return module.helpers[local].apply(this,args);
            }; 
        })();
      }   
    }
}

// Create Router TODO refactor NEW a object
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
      plugins:{before:[], after:[]},
      //helpers :{} // delete TODO
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
  
    var hook = 'before';
    
    var last = args[args.length-1];
    if (typeof last === 'string'){
      args.pop();
      if(last === 'after' ){
        hook = 'after';
      }
    }  
   
    if (hook === 'after'){
      Array.prototype.push.apply(route.plugins.after, args);
    } else {
      Array.prototype.push.apply(route.plugins.before, args);
    }  
  }
  
  // one per application
  var modulePrototypesContainer = {
    modules : []
  }

  function addModule(rte, module){
    //var args = Array.prototype.slice.call(arguments);
    if (typeof rte === 'string') {
      var rte = routes[rte];
    }
    // plugins
    Array.prototype.push.apply(rte.plugins.after, module.after);
    Array.prototype.push.apply(rte.plugins.before, module.before);
    // helpers
    addHelpers(module, modulePrototypesContainer);
  }

  function createContext(req, res){
    var context = {};
    modulePrototypesContainer.modules.forEach(function(moduleName){
      var obj = Object.create(modulePrototypesContainer[moduleName]);
      obj.request = req;
      obj.response = res;
      context[moduleName] = obj;
    });

    context.request = req;
    context.response = res;
    return context;
  }

  function createChain(route){
    var beforeFuncs = route.plugins.before || [];
    var afterFuncs = route.plugins.after || [];
    var beforeAllFuncs = routes[ALLROUTES_CHAIN].plugins.before || [];
    var afterAllFuncs = routes[ALLROUTES_CHAIN].plugins.after || [];
    return [].concat(beforeAllFuncs, beforeFuncs, route.handler, afterFuncs, afterAllFuncs);
  
  }
    
  // MOVE to nodement object. TODO
  //add error plugin
  addRoute('errorRoute', 'GET', null, errorChainMain);
  // add allRoutes
  addRoute(ALLROUTES_CHAIN, 'GET', null, allRoutesMain);
  addModule(ALLROUTES_CHAIN, session);
  addPlugin(ALLROUTES_CHAIN, addStandardHeaders, sendResponse, 'after');
  

  return {
    routes : routes,
    addRoute: addRoute,
    doRoute: doRoute,
    addPlugin: addPlugin,
    addModule: addModule,
    createChain: createChain,
    createContext: createContext
  };
}


