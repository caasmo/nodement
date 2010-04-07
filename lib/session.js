var uuid = require("uuid").uuid,
    cookie = require("cookie"),
    sys = require("sys");
    redisclient = require("redisclient"),
    client = redisclient.createClient();
//var BACKEND = "redis";

exports.after = [setCookie];
exports.before = [processSessionId];
exports.pluginName = 'session';
exports.helpers = { get:get, set:set, getSid: getSid};

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
  client.hset(sid, field, value, function(err, reply){
    sys.puts("set in redis");  
    callback(err, reply);
  });
  
}

function getSid(){ 
  return this.response.get("session.id");
}

// plugins
function setCookie( ndt){ 
  var sid = ndt.response.get("session.id") || uuid();
  ndt.response.headers['Set-Cookie'] = "sid=" + sid;
  sys.puts("set cookie sid=" + sid);
  ndt.next();
}

function processSessionId( ndt){ 
  // from cookie
  var reqCookie = ndt.response.headers['cookie'];
  var sid = reqCookie ? cookie.parseCookie(reqCookie).sid : uuid(); 
  sys.puts(sid);
  ndt.response.set("session.id", sid);
  ndt.next();
}

