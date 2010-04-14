var sys = require('sys');
var NODEMENT_STORE = "nodement_store";

/*
function writeHead(){
  var args = Array.prototype.slice.call(arguments);
}
*/
exports.create = create; 
 
// node response 
function create(router, req, noderes){
 
  var res ={};
  createSealedProperty(res, 'status', '200');
 
  createSealedProperty(res, 'body', '' );
  createSealedProperty(res, 'headers', {});
  createSealedProperty(res, 'matches', []);
  createSealedProperty(res, NODEMENT_STORE , {});
/*
  createSealedProperty(res, 'writeHead', function (){
    var args = Array.prototype.slice.call(arguments);
    // node.js writeHead call a number of this functions. Make this the node.js response
    response.writeHead.apply(response, args); 
  });
  createSealedProperty(res, 'write', function (){
    var args = Array.prototype.slice.call(arguments);
    response.write.apply(response, args);
  });
  
  createSealedProperty(res, 'end', function (){
    var args = Array.prototype.slice.call(arguments);
    response.end.apply(response, args); 
  });
  */
  createSealedProperty(res, 'set', function (){
    var args = Array.prototype.slice.call(arguments);
    res[NODEMENT_STORE][args[0]] = args[1];
  });

  createSealedProperty(res, 'get', function (){
    var args = Array.prototype.slice.call(arguments);
    return res[NODEMENT_STORE][args[0]];
  });
  
  router.modulePrototypesContainer.modules.forEach(function(moduleName){
      var obj = Object.create(router.modulePrototypesContainer[moduleName]);
      
      //obj.request = req;
     // obj.response = noderes;
      obj.ndt = res;
      res[moduleName] = obj;
    });

    res.request = req;
    res.response = noderes;
  
  
  return res;
}

function createSealedProperty(obj, prop, value){
  Object.defineProperty( obj, prop, {
    value: value,
    writable:true,
    configurable: false,
    enumerable: true
});
}
