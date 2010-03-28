var chainRouter = require("pluginchain");
var ndtRouter = require("router");
var response = require("response");

var fs = require('fs');
var path = require('path');
var http = require('http');

var sys = require("sys");



// add addRoute here, routes here;

function addRoute(method, pattern, handler) {
     
      
}




exports.nodement = function getServer() {
  var router = ndtRouter.createRouter();
  

  var server = http.createServer(function (req, res) {
    var ndtRes = response.create(res);
  


  });
   
  // a route from url to chain, chain is defined with a function , main function 
  function addRoute(method, pattern, handler) {
    // init plugin system for handler
    chainRouter.createPluginContainer(handler);
    // add general plugins to handler
    
    // proxy  
    router.addRoute(method, pattern, handler);  
  }

  function listen(port, host) {
      port = port || 8080;
      host = host || "127.0.0.1";
      server.listen(port, host);
      
  }
    
  function close() {
      return server.close();
  }
  
  return {
    router: router, // remove access to router, proxy
    chainRouter: chainRouter,
    listen: listen,
    close: close,
  };
  

}
