
var response = require("response");
var ndmt = require("nodement").nodement();

var sys = require("sys");
var objA = {name: "lipo"};
var objB = {name: "pedro"};

function f(obj1, obj2, ndt){
  sys.puts("f called");
  process.nextTick(function(){
    obj1.name += " f";
     //next(new Error());
     //next('end');
     ndt.next();
  });
}

function g(obj1, obj2, ndt){
  sys.puts("g called");
  process.nextTick(function(){
    obj1.name += " g";
     //next(new Error());
     //next('end');
     ndt.next();
  });
}

function pa( obj1, obj2, ndt){ 
  //var h = this;
  sys.puts("pa called");
  
  //sys.puts("exports:" + h.lipo.id);
 // h.lipo.id++;
  //var args = Array.prototype.slice.call(arguments,1);
  setTimeout(function(){
    obj1.name += " pa";
    ndt.next();
  }, 1000); 
  sys.puts("pa return");
}

function pb( obj1, obj2, ndt){
  sys.puts("pb called");
  //sys.puts("exports:" + this.lipo.id); 
  setTimeout(function(){
    obj1.name += " pb";
    //next();
    ndt.next();
  }, 1000); 
  sys.puts("pb return");
}

function pe( obj1, obj2, ndt){
  sys.puts("Error pe called");
  setTimeout(function(){
    obj1.name += " pe";
    
    ndt.next();
  }, 1000); 
  sys.puts("Error pe return");
}

function pc( obj1, obj2, ndt){
  sys.puts("pc called");
  setTimeout(function(){
    obj1.name += " pc";
    sys.puts(JSON.stringify(ndt.route.matches));
    ndt.next(new Error);
  }, 1000); 
  sys.puts("pc return");
}

function pd( obj1, obj2, ndt){
  sys.puts("pd called: extern: redirecting to chain");
  setTimeout(function(){
    obj1.name += " pd";
    
    ndt.next('route2');
  }, 1000); 
  sys.puts("pd return");
}

function pf( obj1, obj2, ndt){
  sys.puts("pf called: inner redirecting to plugin");
  setTimeout(function(){
    obj1.name += " pf";
    ndt.next('this.pd');
  }, 1000); 
  sys.puts("pf return");
}

// TODO one pro server
// dont save in the function, in the chain router.
var chainRouter = ndmt.chainRouter;


var router = ndmt.router;


var url = "/articles/2005/03/";
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
var req = {url: url, method:'GET'};
var route = router.getRoute(req);
chainRouter.ndt.route = route;
var fakeResponse = {writeHead: function(){}, write:function(){sys.puts('hola')}, close:function(){}}
var res = response.create(fakeResponse);

chainRouter.doChain(route)(req, res);

sys.puts("make more...");



