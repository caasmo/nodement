var sys = require('sys');

function writeHead(){
  var args = Array.prototype.slice.call(arguments);
  
}

exports.create = create; 
 


// node response 
function create(response){
 
  var res ={};
  createSealedProperty(res, 'status', '200');
 
  createSealedProperty(res, 'body', '' );
  createSealedProperty(res, 'headers', {});
  createSealedProperty(res, 'matches', []);
  createSealedProperty(res, 'store', {});
  createSealedProperty(res, 'writeHead', function (){
    var args = Array.prototype.slice.call(arguments);
    // node.js writeHead call a number of this functions. Make this the node.js response
    response.writeHead.apply(response, args); 
  });
  createSealedProperty(res, 'write', function (){
    var args = Array.prototype.slice.call(arguments);
    response.write.apply(response, args);
  });
  
  createSealedProperty(res, 'close', function (){
    var args = Array.prototype.slice.call(arguments);
    response.close.apply(response, args); 
  });

  createSealedProperty(res, 'set', function (){
    var args = Array.prototype.slice.call(arguments);
    res["store"][args[0]] = args[1];
  });

  createSealedProperty(res, 'get', function (){
    var args = Array.prototype.slice.call(arguments);
    return res["store"][args[0]];
  });
  
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
