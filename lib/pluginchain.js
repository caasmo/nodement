var sys = require("sys");
var SEPARATOR = '.';


exports.createChain = createChain;
exports.chainer = createChainer;



function createChainer(router){

  var ndt =  router;

  // TODO remove collector 
  // sustitue for a default function -> chain 
  function doChain(route, errChain){
    //errChain = errChain || errorChainMain;
    
    return function(){
      var args = Array.prototype.slice.call(arguments);
      var chn = createChain(route);
    
      // TODOn rename callback errorHandler
      function chain(actions, callback) {
        // TODO
        if (!(actions instanceof Array)) {}
        var callback = (typeof(callback) == 'function' ? callback : null);//error
      
        var pos = 0;
        var length = actions.length;

        ndt.next = function next() {
         
          var argums = Array.prototype.slice.call(arguments);      
         
          if(argums[0] instanceof Error){
            // Err. Call the error chain
            var errorroute = router.routes['errorRoute'];
            var errCh = doChain(errorroute);
            errCh.apply(null,args);
            return;

          } else if(typeof argums[0] === 'string'){
         
            var index = argums[0].indexOf(SEPARATOR);
            if (index !== -1){
              
               // is a plugin
               var rte = argums[0].substring(0, index);
               if (rte === 'this'){
                 var targetExists = false;
                 var plgn = argums[0].substring(index+1);
               
                 for(var i = 0; i< actions.length; i++){          
                   if(actions[i].name === plgn){
                     targetExists = true;
                     pos = i-1; // with p++ below
                     break;            
                   }
                 }
                  
                  if (!targetExists)  return; // error chain TODO
               } else {
                 return; 
                
                  
               }               
    
            } else {
              var route = router.routes[argums[0]];
              var fn = doChain(route);//sync
              fn.apply(null,args);
              return;
            }  
    
          } else if(typeof argums[0] === 'object'){
            // TODO remove
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
      chain( chn, errChain);
    };
  }


   return {
    doChain: doChain,
    ndt: ndt
  }
}

function createChain(route){
  //var routes = routes || [];
  var preFuncs = route.plugins.pre || [];
  var postFuncs = route.plugins.post || [];
  //var preRoutesFuncs = routes.plugins.pre || [];
  // var postRouesFuncs = routes.plugins.post || [];
  return  [].concat( preFuncs, route.handler, postFuncs);
}
