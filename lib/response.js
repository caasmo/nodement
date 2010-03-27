var sys = require('sys');

function sendResponse(req, res, next) {
      // where is this info body
      "(code, body, content_type, extra_headers)"
      res.writeHead(code, (extra_headers || []).concat(
                           [ ["Content-Type", content_type],
                             ["Content-Length", body.length]
                           ]));
      res.write(body);
      res.close();
}

exports.create = create; 
 


// node response 
function create(response){
  //sys.puts('hi');
  //sys.puts(JSON.stringify(response));
  var res ={};
  createSealedProperty(res, 'status', '200');
  //res.status = 200;
  //sys.puts(JSON.stringify(res.status));
  //res.body;
  //sys.puts(res.status);
  //stream? 
  createSealedProperty(res, 'body', '' );
  createSealedProperty(res, 'headers', []);
  //res.headers = [];
    
  // sys.puts(JSON.stringify(res.headers));

  createSealedProperty(res, 'writeHead', response.writeHead);
  createSealedProperty(res, 'write', response.write);
  createSealedProperty(res, 'close', response.close);
  return res;
}

// createSealedProperty
function createSealedProperty(obj, prop, value){
  Object.defineProperty( obj, prop, {
    value: value,
    writable:true,
    configurable: false,
    enumerable: true
});
}
