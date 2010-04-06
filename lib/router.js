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

function addStandardHeaders( req, res, ndt){
    len = res.body.length;
    res.headers["Content-Length"] = len;  
    res.headers["Content-Type"] = "text/plain";
    ndt.next();  
}

function sendResponse( req, res, ndt){
      sys.puts('allRoutesMain');
      res.writeHead(200, res.headers);
      res.write(res.body);
      res.close();  
}


/** HELPERS */

/*
// TODO one container for each server application
function helperContainer( req, res){
    this.request = req;
    this.response = res;
    self = this;
    // for each module
    this.helpers.forEach(function(moduleName){
      sys.puts(moduleName+'jjjjjjj');
      self[moduleName]={};
      self[moduleName].request = req;
      self[moduleName].response = res;
    });
}
*/
var helperContainer = {
  helpers:[]
};

function insertScopeObject(obj, req, res){
  obj.__proto__.helpers.forEach(function(moduleName){
      //sys.puts(moduleName+'jjjjjjj');
      
      obj[moduleName].request = req;
      obj[moduleName].response = res;
    });

}


//helperContainer.prototype.helpers = [];

function addHelpers(module){
    
    helperContainer[module.pluginName] = {};
    helperContainer["helpers"].push(module.pluginName); 

    for (var p in module.helpers) {  
      if(module.helpers.hasOwnProperty(p)){
        // if function TODO
        helperContainer[module.pluginName][p] = (function(){
            // muss execute the function to create local variable for each p
            // if function not executed, p is always the last value when called. 
            var local = p; 
            return function(){
              //sys.puts(local + "***");
              var args = Array.prototype.slice.call(arguments);
              //sys.puts("calling function");
              module.helpers[local].apply(this,args);
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
      plugins:{pre:[], post:[]},
      helpers :{} // delete TODO
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
  
  function addPluginModule(rte, module){
    //var args = Array.prototype.slice.call(arguments);
    if (typeof rte === 'string') {
      var rte = routes[route];
    }
    Array.prototype.push.apply(rte.plugins.post, module.after);
    Array.prototype.push.apply(rte.plugins.pre, module.before);

    // helpers ara global
    // add the helpers of the module
    addHelpers(module);
    //modulename
    //rte.helpers[module.pluginName] = module.helpers;
    //
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
  addPlugin(ALLROUTES_CHAIN_LABEL, addStandardHeaders, sendResponse, 'post');
  
  return {
    routes : routes,
    addRoute: addRoute,
    doRoute: doRoute,
    addPlugin: addPlugin,
    addPluginModule: addPluginModule,
    createChain: createChain,
    helperContainer: helperContainer,
    insertScopeObject: insertScopeObject
    //close: close
  };

  
}



