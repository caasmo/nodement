var sys = require("sys");
var response = require("response");
var ndmt = require("nodement").nodement();
var session = require("session");


var objA = {name: "lipo"};
var objB = {name: "pedro"};

function f(obj1, res, ndt){
  sys.puts("f called");
  this.session.h();
  sys.puts("h returned");
  process.nextTick(function(){
    sys.puts("f callback called");
    res.body += res.id + " f\n";
     //next(new Error());
     //next('end');
     ndt.next();
  });
}

function g(obj1, res, ndt){
  sys.puts("g called");
  process.nextTick(function(){
    res.body += res.id +" g";
     //next(new Error());
     //next('end');
     ndt.next();
  });
}

function pa( req, res, ndt){ 
  sys.puts("pa called");
  sys.puts(JSON.stringify(res.matches));

  setTimeout(function(){
    res.body += res.id +" pa";
    ndt.next();
  }, 1000); 
  sys.puts("pa return");
}

function pb( obj1, res, ndt){
  sys.puts("pb called");
  //sys.puts("exports:" + this.lipo.id); 
  setTimeout(function(){
    res.body += res.id +" pb";
    //next();
    ndt.next();
  }, 1000); 
  sys.puts("pb return");
}

function pe( obj1, res, ndt){
  sys.puts("Error pe called");
  setTimeout(function(){
    res.body += res.id +" pe";
    sys.puts("closing---bye");
    ndt.next();
  }, 1000); 
  sys.puts("Error pe return");
}

function pc( obj1, res, ndt){
  sys.puts("pc called");
  setTimeout(function(){
    res.body += res.id +" pc";
    //sys.puts(JSON.stringify(ndt.route.matches));
    ndt.next(new Error);
  }, 1000); 
  sys.puts("pc return");
}

function pd( obj1,res, ndt){
  sys.puts("pd called: extern: redirecting to chain");
  setTimeout(function(){
    res.body += res.id +" pd";
    
    ndt.next('route2');
  }, 1000); 
  sys.puts("pd return");
}

function pf( obj1, res, ndt){
  sys.puts("pf called: inner redirecting to plugin");
  setTimeout(function(){
   res.body += res.id +" pf";
    ndt.next('this.pd');
  }, 1000); 
  sys.puts("pf return");
}

var router = ndmt.router;

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

router.addPlugin('errorRoute', pe, 'post');
// add plugin to all routes route

var route3 =  router.addRoute('route3','GET', regexp3, f);
router.addPluginModule(route3, session);

ndmt.listen(8080);
sys.puts("make more...");



