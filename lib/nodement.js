var chainRouter = require("chain");
var ndtRouter = require("router");
var response = require("response");

var fs = require('fs');
var path = require('path');
var http = require('http');

var sys = require("sys");

exports.nodement = function() {
  
  var router = ndtRouter.createRouter();
  var chRouter = chainRouter.chainer(router); 
  

  var server = http.createServer(function (req, res) {
    sys.puts('req');
    
    // wrap the node response object
    var ndtRes = response.create(res);
    ndtRes.id = Math.floor(Math.random() * 10000);
    var route = router.doRoute(req,ndtRes);
    chRouter.doChain(route)(req, ndtRes);

  }); 
 
  function addRoute(method, pattern, handler) {
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
    //server: server,
    listen: listen,
    close: close,
    router: router,
    chainRouter: chRouter,
   
  };
  
  
}
