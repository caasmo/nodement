var chainRouter = require("pluginchain");
var ndtRouter = require("router");
var response = require("response");

var fs = require('fs');
var path = require('path');
var http = require('http');

var sys = require("sys");

exports.nodement = (function() {
  
  var router = ndtRouter.createRouter();
  var chRouter = chainRouter.chainer(router); 
  

  var server = http.createServer(function (req, res) {
    sys.puts('req');

    var ndtRes = response.create(res);
    ndtRes.msg = "";
    ndtRes.id = Math.floor(Math.random() * 10000);
    var route = router.getRoute(req);
    chRouter.doChain(route, function(){
      sys.puts('end...');
      len = ndtRes.msg.length;
      res.writeHead(200, {
      
      "Content-Length": len,
      "Content-Type": "text/plain"});
      res.write(ndtRes.msg);
      res.close();  
    })(req, ndtRes);
   // sys.puts(JSON.stringify(ndtRes));
    //var len = ndtRes.msg.length;
    
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
 
 
  
  var result = {
    //server: server,
    listen: listen,
    close: close,
    router: router,
    chainRouter: chRouter,
   
  };
  
  
  return result;
})()
