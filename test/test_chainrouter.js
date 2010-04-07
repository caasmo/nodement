var sys = require("sys");
var response = require("response");
var ndmt = require("nodement").nodement();
var session = require("session");

/*
var objA = {name: "lipo"};
var objB = {name: "pedro"};
*/


function g(ndt){
  sys.puts("g called");
  process.nextTick(function(){
    res.body += res.id +" g";
     //next(new Error());
     //next('end');
     ndt.next();
  });
}

function pa(ndt){ 
  sys.puts("pa called");
  sys.puts(JSON.stringify(res.matches));

  setTimeout(function(){
    res.body += res.id +" pa";
    ndt.next();
  }, 1000); 
  sys.puts("pa return");
}

function pb(ndt){
  sys.puts("pb called");
  
  setTimeout(function(){
    res.body += res.id +" pb";
    //next();
    ndt.next();
  }, 1000); 
  sys.puts("pb return");
}

function pe(ndt){
  sys.puts("Error pe called");
  setTimeout(function(){
    res.body += res.id +" pe";
    sys.puts("closing---bye");
    ndt.next();
  }, 1000); 
  sys.puts("Error pe return");
}

function pc(  ndt){
  sys.puts("pc called");
  setTimeout(function(){
    res.body += res.id +" pc";
    //sys.puts(JSON.stringify(ndt.route.matches));
    ndt.next(new Error);
  }, 1000); 
  sys.puts("pc return");
}

function pd( ndt){
  sys.puts("pd called: extern: redirecting to chain");
  setTimeout(function(){
    res.body += res.id +" pd";
    
    ndt.next('route2');
  }, 1000); 
  sys.puts("pd return");
}

function pf(ndt){
  sys.puts("pf called: inner redirecting to plugin");
  setTimeout(function(){
   res.body += res.id +" pf";
    ndt.next('this.pd');
  }, 1000); 
  sys.puts("pf return");
}

function f( ndt){
  //sys.puts(sys.inspect(ndt.__proto__));
/*
  setTimeout(function(){
   res.body += res.id +" pf";
    ndt.next();
  }, 1000); 
  */
  ndt.session.set("yo", "guay", function(err, reply){
    sys.puts("f callback called");
    ndt.response.body += ndt.response.id + " f\n";
    ndt.next();
  });

}

function pg( ndt){
  
  sys.puts("pg called:");
  sys.puts(sys.inspect(ndt));
  var si = ndt.session.getSid();
  sys.puts(si + '###');
  
  ndt.session.get("yo", function(err, reply){
    sys.puts("the reply from session.set is :" + reply)
  
    ndt.next();
  });
  /*
  setTimeout(function(){
   res.body += res.id +" pf";
    ndt.next();
  }, 1000);*/
  sys.puts("pg return");
}

function ph(ndt){
  sys.puts("ph called:");
  setTimeout(function(){
    ndt.next();
  }, 5000); 
  sys.puts("ph return");
}

var router = ndmt.router;

var regexp = /^\/articles\/(\d*)\/(\d*)\/$/;
var regexp2 = /^\/blogs\/(\d*)\/(\d*)\/$/;
var regexp3 = /^\/error\/(\d*)\/(\d*)\/$/;


var route =  router.addRoute('route', 'GET', regexp, g);

// TODO accept name or object as 1 argument
router.addPlugin(route, pa,pf); // plugins api
router.addPlugin(route,pd,pb, 'after');

var route2 =  router.addRoute('route2','GET', regexp2, f);
router.addPlugin(route2, pa,pb); // plugins api
router.addPlugin(route2,pa,pc, 'after');

router.addPlugin('errorRoute', pe, 'after');
// add plugin to all routes route

var route3 =  router.addRoute('route3','GET', regexp3, f);
router.addPlugin(route3, ph, pg, 'after');
//sys.puts(sys.inspect(route3));

ndmt.listen(8080);
sys.puts("make more...");



