var uuid = require("uuid").uuid;
var cookie = require("cookie");
var sys = require("sys");
var redisclient = require("redisclient");
var client = redisclient.createClient();


var BACKEND = "redis";

//var memoryStore ={};
// helpers
function get(field, callback){ 
   sys.puts("get called#####");
   sys.puts(typeof callback); 
  var sid = this.response.get("session.id");
  client.hget(sid, field, function(err, reply){
    sys.puts(reply+ "replyyyy");
    callback(reply);
  });
}

function set(field, value, callback){ 
  sys.puts("set called#####");
  var sid = this.response.get("session.id");
  sys.puts("sid#####" + sid);
    client.hset(sid, field, value, function(){
      sys.puts("set in redis");  
      callback();
    });
  
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
  sys.puts(sid + "########");    
  sys.puts(sys.inspect(this.__proto__));    
  /*
  // tes insert in session
  this.session_seti("hola", "lipo", function(value){
      
      ndt.next();
     });
  // this["session.set"] nee   
*/
  
  ndt.next();
}


function pb( req, res, ndt){
  sys.puts("pb called");
  sys.puts(sys.inspect(this));
  //sys.puts(sys.inspect(this.__proto__));   
  //sys.puts(typeof this.session.h1);
  this.session.h1();
  //this.h2();
  ndt.next();
  //sys.puts("exports:" + this.lipo.id); 
  
    //res.body += res.id +" pb";
    //sys.puts(sys.inspect(this.geti.toString()));
   // python
    //self.session_h( "hola");

/*  this.get("hola",  function(value){
    sys.puts("value from redis: " + value);
    ndt.next();
  });*/
   
   
  sys.puts("pb return");
}

function h1(obj1){
  // this is the helper container
  sys.puts("h1: this is a helper");
  sys.puts(sys.inspect(this));
  
  sys.puts("h1: the session:" + this.response.get("session.id"));
  process.nextTick(function(){
     sys.puts("h1: async lol");
    
  });
}

function h2(obj1){
  // this is the helper container
  sys.puts("h2: this is a helper");
  //sys.puts(sys.inspect(this));
 // sys.puts("h: the session:" + this.response.get("session.id"));
  process.nextTick(function(){
     sys.puts("h2: async lol");
  });
}


exports.after = [setCookie, pb];
exports.before = [getSessionId];
exports.pluginName = 'session';
//exports.helpers = {h1: h1, h2:h2 };
exports.helpers = { get:get, set:set , h1: h1, h2:h2 };
