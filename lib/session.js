var uuid = require("uuid").uuid;
var cookie = require("cookie");
var sys = require("sys");
var redisclient = require("redisclient");
var client = redisclient.createClient();


var BACKEND = "redis";

//var memoryStore ={};
// helpers
function get(key, field, callback){ 
  // TODO error ?
  client.hget(key, field, function(err, reply){
    callback(reply);
  });
}

function set(key, field, value, callback){ 
  //sys.puts(sys.inspect(this));  
  client.hset(key, field, value, function(){
  sys.puts("set in redis");  
  callback()});
  
}

// plugins
function setCookie(req, res, ndt){ 
  //sys.puts(sys.inspect(this));  
  var sid = res.get("session.id") || uuid();
  res.headers['Set-Cookie'] = "sid=" + sid;
  sys.puts("sid=" + sid);
  ndt.next();
}

function getSessionId(req, res, ndt){ 
  // from cookie
  var reqCookie = req.headers['cookie'];
  //sys.puts(JSON.stringify(memoryStore));
  var sid;
  if (reqCookie) {
    var ckie = cookie.parseCookie(reqCookie);
    sys.puts('session in cookie found!!');
    sid = ckie.sid;
    /*
    if (memoryStore[sid]){
      sys.puts('your last match:' + memoryStore[sid].match );
    }
    */
  } else {
    // generate
    sid = uuid();
    /*
    memoryStore[sid] = {};
    memoryStore[sid].match = res.matches[1]; 
    */
    
  }
   
  res.set("session.id", sid);
  ndt.next();
  
}


function pb( req, res, ndt){
  sys.puts("pb called");
/*
  this.session.set(res.get("session.id"), "hola", "lipo", function(){
    ndt.next();
  });
*/
  
  var self = this;
 
  //sys.puts("exports:" + this.lipo.id); 
  setTimeout(function(){
    res.body += res.id +" pb";
    //sys.puts(sys.inspect(self.session));
    self.h("hola");
    
    ndt.next();
  }, 1000); 
  sys.puts("pb return");
}

function pc( obj1, res, ndt){
  sys.puts("pc called");
  this.session.get(res.get("session.id"), "hola", function(value){
    sys.puts(sys.inspect(arguments));
    //sys.puts("value from redis:" +  value);
    ndt.next();
  }) 
  
  sys.puts("pc return");
}


function h(obj1){
  // this is the response object
  sys.puts("h: this is a helper");
  //sys.puts(sys.inspect(this));
  sys.puts("h: the session:" + this.get("session.id"));
  process.nextTick(function(){
     sys.puts("h: async lol");
    //res.body += res.id + " f\n";
     //next(new Error());
     //next('end');
     //ndt.next();
  });
}

exports.after = [setCookie, pb];
exports.before = [getSessionId];
exports.pluginName = 'session';
//exports.helpers = {h: h, set: set, get: get };
exports.helpers = {h: h};
