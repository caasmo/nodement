var sys = require('sys'),
    http = require('http'),
    url_parse = require("url").parse,
    ALLROUTES_CHAIN = "allRoutes";

exports.createRouter = create;

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
  function doRoute(req,  context) {
      var uri = url_parse(req.url);
      var path = uri.pathname;
      for (var routeName in routes) {
        var route = routes[routeName];
        if (req.method === route.method) {
          var match = path.match(route.pattern);
          if (match && match[0].length > 0) {
            // TODO named properties params in response como query string
            context.response.matches = match;
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
  
  // application (router) Scope
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
    
  return {
    routes : routes,
    addRoute: addRoute,
    doRoute: doRoute,
    addPlugin: addPlugin,
    addModule: addModule,
    createChain: createChain,
    createContext: createContext,
    modulePrototypesContainer: modulePrototypesContainer,
    ALLROUTES_CHAIN : ALLROUTES_CHAIN

  };
}


