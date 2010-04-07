var sys = require("sys");
var SEPARATOR = '.';


//exports.createChain = createChain;
exports.chainer = createChainer;

function createChainer(router){

  //var ndt =  router;
  // TODO refactor object
  // TODO remove collector 
  // TODO remove callback. IMplement last plugin write to response as plugin
  function doChain(route){
    
    // scope request because dochain called each request
    //var ndt = {}; // TODO
    var chn = router.createChain(route, router); 
    // debug
    var str = chn.reduce(function(re, current){
      var re = re + current.name + ' ';
      return re; 
      
    }, '');
    sys.puts(str);
    return function(){
      var args = Array.prototype.slice.call(arguments);   
      var context = router.createContext(args[0], args[1]);
      //sys.puts(sys.inspect(context));

      function chain(actions) {
       
        var pos = 0;
        var length = actions.length;
       
        context.next = function next() {
          var argums = Array.prototype.slice.call(arguments);      
          if(argums[0] instanceof Error){
            // Err. Call the error chain
            var errorroute = router.routes['errorRoute'];
            var errCh = doChain(errorroute);
            // TODO add argums[0] as argument
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
              var rout = router.routes[argums[0]];
              var fn = doChain(rout);//sync
              fn.apply(null,args);
              return;
            }  
    
          } else if(typeof argums[0] === 'object'){
            // TODO remove
            // redirect to other chain
            // TODO redirecting to not existent chainPointer
            var fn = doChain(argums[0], callback);//sync
            fn.apply(route.helpers,args);
            return;
          }
         
          pos++;
          if (pos < length) {
            actions[pos].apply(null, [].concat( context));
          } else {
          }
        } // end next()

        process.nextTick(function(){        
          actions[pos].apply(null, [].concat( context));
        });
      } 
      chain(chn);
    };
  }


   return {
    doChain: doChain,
   // ndt: ndt
  }
}


