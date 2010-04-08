var sys = require("sys");
var SEPARATOR = '.';

exports.chainer = createChainer;

function createChainer(router){

  // TODO refactor object
  function doChain(route){
    
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
      
      var pos = 0;
      var length = chn.length;

      context.next = function next() {
        var argums = Array.prototype.slice.call(arguments);      
        if(argums[0] instanceof Error){
            // Call the error chain
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
              for(var i = 0; i< chn.length; i++){          
                if(chn[i].name === plgn){
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
    
        } 
         
        pos++;
        if (pos < length) {
          chn[pos].call(null, context);
        } else {
        }
      } // end next()

      process.nextTick(function(){        
        chn[pos].call(null, context);
      });

    };
  }


  return {
    doChain: doChain,
   // ndt: ndt
  }
}


