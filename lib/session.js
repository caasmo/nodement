var uuid = require("uuid").uuid,
    cookie = require("cookie"),
    sys = require("sys");
    redisclient = require("redisclient"),
    client = redisclient.createClient();


//var BACKEND = "redis";


exports.after = [setCookie];
exports.before = [getSessionId];
exports.pluginName = 'session';
exports.helpers = { get:get, set:set , h1: h1, h2:h2 };

// helpers
function get(field, callback){ 
  sys.puts("get called#####");
  var sid = this.response.get("session.id");
  client.hget(sid, field, function(err, reply){
    callback(err, reply);
  });
}

function set(field, value, callback){ 
  sys.puts("set called#####");
  var sid = this.response.get("session.id");
  client.hset(sid, field, value, function(){
    sys.puts("set in redis");  
    callback(err, reply);
  });
  
}

// plugins
function setCookie(req, res, ndt){ 
  var sid = res.get("session.id") || uuid();
  res.headers['Set-Cookie'] = "sid=" + sid;
  sys.puts("sid=" + sid);
  ndt.next();
}

function getSessionId(req, res, ndt){ 
  // from cookie
  var reqCookie = req.headers['cookie'];
  var sid = reqCookie ? cookie.parseCookie(reqCookie).sid : uuid(); 
  res.set("session.id", sid);
  ndt.next();
}

