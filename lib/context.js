var sys = require('sys');
var NODEMENT_STORE = "nodement_store";

/*
function writeHead(){
  var args = Array.prototype.slice.call(arguments);
}
*/
exports.create = create; 
 
// node response 
function create(router, req, response){
 
  var cxt ={}, ndtres = {}, store ={};


  createSealedProperty(ndtres, 'status', '200');
 
  createSealedProperty(ndtres, 'body', '' );
  createSealedProperty(ndtres, 'headers', {});
  createSealedProperty(ndtres, 'matches', []);

  createSealedProperty(ndtres, 'writeHead', function (){
    var args = Array.prototype.slice.call(arguments);
    // node.js writeHead call a number of this functions. Make this the node.js response
    response.writeHead.apply(response, args); 
  });
  createSealedProperty(ndtres, 'write', function (){
    var args = Array.prototype.slice.call(arguments);
    response.write.apply(response, args);
  });
  
  createSealedProperty(ndtres, 'end', function (){
    var args = Array.prototype.slice.call(arguments);
    response.end.apply(response, args); 
  });
 
  createSealedProperty(store, NODEMENT_STORE , {});
  createSealedProperty(store, 'set', function (k, v){
    //var args = Array.prototype.slice.call(arguments);
    store[NODEMENT_STORE][k] = v;
  });

  createSealedProperty(store, 'get', function (k){
    //var args = Array.prototype.slice.call(arguments);
    return store[NODEMENT_STORE][k];
  });
  
  router.modulePrototypesContainer.modules.forEach(function(moduleName){
    var obj = Object.create(router.modulePrototypesContainer[moduleName]);
      
    obj.request = req;
    obj.response = ndtres;
    obj.store = store;
    
    //cxt[moduleName] = obj;
    createSealedProperty(cxt, moduleName , obj);
  });
  /*
  cxt.request = req;
  cxt.response = ndtres;
  cxt.store = store;
  */
  createSealedProperty(cxt, 'request' , req);
  createSealedProperty(cxt, 'response' , ndtres);
  createSealedProperty(cxt, 'store' , store);
  
  return cxt;
}

function createSealedProperty(obj, prop, value){
  Object.defineProperty( obj, prop, {
    value: value,
    writable:true,
    configurable: false,
    enumerable: true
});
}
