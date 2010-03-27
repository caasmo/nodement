var sys = require("sys");


exports.errorChainMain = errorChainMain;
exports.addPlugin = addPlugin;
exports.createPluginContainer = createPluginContainer;
exports.doChain = doChain;
exports.createChain = createChain;

var PLUGINS_PROPERTY_NAME = "_ndt_plugins";

function errorChainMain(obj1, obj2, doChain){
  // TODO dont allow check this is helpers
  sys.puts("errorChainMain called");
  //sys.puts("id: " + this.lipo.id);
 // delete(this.lipo);
  //this.lipo.id = 3; 
  //sys.puts(errorChainMain.name);
  //sys.puts("name: " + this.name);
  sys.puts("bye");
  
}

// create the chain
createPluginContainer(errorChainMain);

function addPlugin (){
  var args = Array.prototype.slice.call(arguments);
  if (typeof args[0] !== 'function') return;
  var func = args.shift();
  var hook = 'pre';
  
  var last = args[args.length-1];
  
  if (typeof last === 'string'){
    args.pop();
    if(last === 'post' ){
      hook = 'post';
    }
  }  
 
  if (hook === 'post'){
    Array.prototype.push.apply(func.plugins.post, args);
  } else {
    Array.prototype.push.apply(func.plugins.pre, args);
  }  
  
}

function createPluginContainer(func){
   if (func.plugins === undefined){
    func.plugins =  {};
    if(func.plugins.pre === undefined){
      func.plugins.pre = [];
    }
     if(!func.plugins.post){
      func.plugins.post = [];
    }
  }
}

// TODO a ndt object pro server
var ndt = exports.ndt = {};

// TODO remove collector 
// sustitue for a default function -> chain 
function doChain(func, collector){
  collector = collector || errorChainMain;
  
  return function(){
    var args = Array.prototype.slice.call(arguments);
    var chn = createChain(func);

    // TODOn rename callback errorHandler
    function chain(actions, callback) {
      // TODO
      if (!(actions instanceof Array)) {}
      var callback = (typeof(callback) == 'function' ? callback : null);//error
    
      var pos = 0;
      var length = actions.length;

      ndt.next = function next() {
        //sys.puts('next');
        var argums = Array.prototype.slice.call(arguments);      
        //switch (typeof result) {
        if(argums[0] instanceof Error){
          // Err. Call the error chain
          var errCh = doChain(errorChainMain);//sync
          errCh.apply(null,args);
          return;

        } else if(typeof argums[0] === 'string'){
          // spring to a named function of this chain
          var targetExists = false;       
          for(var i = 0; i< actions.length; i++){          
            if(actions[i].name === argums[0]){
              targetExists = true;
              pos = i-1; // with p++ below
              break;            
            }
          }
          
          if (!targetExists)  return; // error chain TODO

        } else if(typeof argums[0] === 'function'){
          // redirect to other chain
          // TODO redirecting to not existent chainPointer
          var fn = doChain(argums[0]);//sync
          fn.apply(null,args);
          return;
        }
       
        pos++;
        if (pos < length) {
          actions[pos].apply(null, [].concat( args, ndt));
        }
      }

      process.nextTick(function(){
        actions[pos].apply(null, [].concat(args, ndt));
      });
    } 
    chain( chn, collector);
  };
}

function createChain(func){
  //var routes = routes || [];
  var preFuncs = func.plugins.pre || [];
  var postFuncs = func.plugins.post || [];
  //var preRoutesFuncs = routes.plugins.pre || [];
  // var postRouesFuncs = routes.plugins.post || [];
  return  [].concat( preFuncs, func, postFuncs);
}
