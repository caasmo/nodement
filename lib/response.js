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

exports.createResponse = createResponse 
 


// node response 
function create(response){
  var res ={};
  var status = sealProperty(res, 'status', '200');
  //stream? 
  var body = sealProperty(res, 'body' );
  var headers = sealProperty(res, 'headers', []);
  var writeHead = sealProperty(res, 'writeHead', response.writeHead);
  var write = sealProperty(res, 'write', response.write);
  var close = sealProperty(res, 'close', response.close);
  return {
    status: status,
    headers: headers,
    body: body,
    writeHead: witeHead,
    write: write,
    close: close
  };
}


function sealProperty(obj, prop, value){
  Object.defineProperty( obj, prop, {
    //value: value;
    writable:true,
    configurable: false;
});
}
