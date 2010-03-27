var chainRouter = require("pluginchain");
var router = require("router").createRouter();
var response = require("response");

var fs = require('fs');
var path = require('path');
var http = require('http');

var sys = require("sys");


exports.nodement = function getServer() {

  var server = http.createServer(function (req, res) {
    var ndtRes = response.create(res);
  


  });



  function listen(port, host) {
      port = port || 8080;
      host = host || "127.0.0.1";
      server.listen(port, host);
      
  }
    
  function close() {
      return server.close();
  }
  
  return {
    router: router,
    chainRouter: chainRouter,
    listen: listen,
    close: close,
  };
  

}
