var sys = require("sys");
var response = require("response");
var ndmt = require("nodement").nodement;


var objA = {name: "lipo"};
var objB = {name: "pedro"};

function f(obj1, res, ndt){
  sys.puts("f called");
  process.nextTick(function(){
    res.msg += " f";
     //next(new Error());
     //next('end');
     ndt.next();
  });
}

function g(obj1, res, ndt){
  sys.puts("g called");
  process.nextTick(function(){
    res.msg += " g";
     //next(new Error());
     //next('end');
     ndt.next();
  });
}

function pa( obj1, res, ndt){ 
  //var h = this;
  sys.puts("pa called");
  
  //sys.puts("exports:" + h.lipo.id);
 // h.lipo.id++;
  //var args = Array.prototype.slice.call(arguments,1);
  setTimeout(function(){
    res.msg += " pa";
    ndt.next();
  }, 1000); 
  sys.puts("pa return");
}

function pb( obj1, res, ndt){
  sys.puts("pb called");
  //sys.puts("exports:" + this.lipo.id); 
  setTimeout(function(){
    res.msg += " pb";
    //next();
    ndt.next();
  }, 1000); 
  sys.puts("pb return");
}

function pe( obj1, res, ndt){
  sys.puts("Error pe called");
  setTimeout(function(){
    res.msg += " pe";
    sys.puts("closing---bye");
    ndt.next();
  }, 1000); 
  sys.puts("Error pe return");
}

function pc( obj1, res, ndt){
  sys.puts("pc called");
  setTimeout(function(){
    res.msg += " pc";
    //sys.puts(JSON.stringify(ndt.route.matches));
    ndt.next(new Error);
  }, 1000); 
  sys.puts("pc return");
}

function pd( obj1,res, ndt){
  sys.puts("pd called: extern: redirecting to chain");
  setTimeout(function(){
    res.msg += " pd";
    
    ndt.next('route2');
  }, 1000); 
  sys.puts("pd return");
}

function pf( obj1, res, ndt){
  sys.puts("pf called: inner redirecting to plugin");
  setTimeout(function(){
   res.msg += " pf";
    ndt.next('this.pd');
  }, 1000); 
  sys.puts("pf return");
}

// TODO one pro server
// dont save in the function, in the chain router.
var chainRouter = ndmt.chainRouter;


var router = ndmt.router;


//var url = "/articles/2005/03/";
//var regexp = new RegExp('^/articles/(\\d*)/(\\d*)/$');
var regexp = /^\/articles\/(\d*)\/(\d*)\/$/;
var regexp2 = /^\/blogs\/(\d*)\/(\d*)\/$/;
var regexp3 = /^\/error\/(\d*)\/(\d*)\/$/;


var route =  router.addRoute('route', 'GET', regexp, g);

// TODO accept name or object as 1 argument
router.addPlugin(route, pa,pf); // plugins api
router.addPlugin(route,pd,pb, 'post');

var route2 =  router.addRoute('route2','GET', regexp2, f);
router.addPlugin(route2, pa,pb); // plugins api
router.addPlugin(route2,pa,pc, 'post');

//sys.puts(JSON.stringify(router.routes));

router.addPlugin('errorRoute', pe, 'post');

/*
var req = {url: url, method:'GET'};
var route = router.getRoute(req);
//chainRouter.ndt.route = route;
var fakeResponse = {writeHead: function(){}, write:function(){sys.puts('hola')}, close:function(){}}
var res = response.create(fakeResponse);
chainRouter.doChain(route)(req, res);
*/

ndmt.listen(8080);
sys.puts("make more...");



