var chainRouter = require("chain"),
    ndtRouter = require("router"),
    context = require("context"),
    session = require("session"),
    fs = require('fs'),
    path = require('path'),
    http = require('http');

var sys = require("sys");

exports.nodement = function() {
  
  // router
  var router = ndtRouter.createRouter();
  sys.puts(router.ALLROUTES_CHAIN);
  //add error plugin
  router.addRoute('errorRoute', 'GET', null, errorChainMain);
  // add allRoutes
  router.addRoute(router.ALLROUTES_CHAIN, 'GET', null, allRoutesMain);
  router.addModule(router.ALLROUTES_CHAIN, session);
  router.addPlugin(router.ALLROUTES_CHAIN, addStandardHeaders, sendResponse, 'after');

  // chainer
  var chRouter = chainRouter.chainer(router); 

  var server = http.createServer(function (req, res) {
    sys.puts('req');
    //sys.puts(sys.inspect(res));
    
    // wrap the node context object
    var cxt = context.create(router, req, res); 
    
    cxt.id = Math.floor(Math.random() * 10000);

    var route = router.doRoute(req, cxt);
    chRouter.doChain(route)( cxt);
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
    //server: server,
    listen: listen,
    close: close,
    router: router,
    chainRouter: chRouter,
  }; 
}

// TODO a module with standard plugins
function errorChainMain(ndt){
   process.nextTick(function(){
     sys.puts("errorChainMain called");
     ndt.next();
  });
}


function allRoutesMain(ndt){
  ndt.next();
}

function addStandardHeaders( ndt){
    len = ndt.body.length;
    ndt.response.headers["Content-Length"] = len;  
    ndt.response.headers["Content-Type"] = "text/plain";
    ndt.next();  
}

function sendResponse(  ndt){
      //sys.puts('allRoutesMain');
      ndt.response.writeHead(200, ndt.headers);
      ndt.response.write(ndt.body);
      ndt.response.end();  
}
