var chainRouter = require("pluginchain");
var router = require("router");
var sys = require("sys");
var objA = {name: "lipo"};
var objB = {name: "pedro"};
//var nodement ={id:0};


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
    
    ndt.next(new Error);
  }, 1000); 
  sys.puts("pc return");
}

function pd( obj1, obj2, ndt){
  sys.puts("pd called: extern: redirecting to chain");
  setTimeout(function(){
    obj1.name += " pd";
    
    ndt.next(f);
  }, 1000); 
  sys.puts("pd return");
}

function pf( obj1, obj2, ndt){
  sys.puts("pf called: inner redirecting to plugin");
  setTimeout(function(){
    obj1.name += " pf";
    
    ndt.next('pd');
  }, 1000); 
  sys.puts("pf return");
}



/* EXEC*/

chainRouter.createPluginContainer(f)
chainRouter.addPlugin(f,pa,pb); // plugins api
chainRouter.addPlugin(f,pa,pc, 'post');

chainRouter.createPluginContainer(g)
chainRouter.addPlugin(g,pa,pf); // plugins api
chainRouter.addPlugin(g,pd,pb, 'post');
//sys.puts("g plugins");
//sys.puts(g.plugins.post[0].toString());

// ???? 
// add a pre plugin to error chain
chainRouter.addPlugin(chainRouter.errorChainMain,pe);

//var fChain = chainRouter.createControllerChain(f);//sync
//fChain(objA, objB);

// TODO unify
var gChain = chainRouter.doChain(g);//sync
gChain(objA, objB);

sys.puts("make more...");

/* general plugins
route, hat list all controllers, get route, get controller, add plugin

route is bindung set of request ->controller

routes is a list of controllers;
a controller hat plugin, helpers

plugin is piece of code exeecuted before or after
add plugins to controllers 
async??
we want sync plugins,-> no!
if plugin is async, return not finish
add callback, next
only global share ist args: req, res
// redirectses 
// next mejor para chain
// cortar la cadena. Si, 
// reanudar tambien 

intern Api chainLinks === plugin extern Api
// desactivar  cadena ? para redirecciones

la cadena se corta si no das el next
// el resultado esta en el args, como se entrega 
// metodo chain.end 


routr mechanimsh async 

add plugings
// helpers in res
*/

/*
//Routes request->chain
// chain element plugin
// error of the last, reference to next
// only change args
// good 
// special plugins? central plugin, ja
// redirection to function chain,
// redirection , return tio chain
// robust handle of signature.
// general.plugins atttached to routes.

function f(err, args, next){
  if (err) throw new Error(); 
  // do intensiv
  do(args, function(){
     sys.puts("f called");
     next(args);
  });
  
  // the callback oben
}
*/
// colector handle with error. a default is
//need I callback in plugins SYNC?

//need i to loop

