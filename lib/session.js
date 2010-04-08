var uuid = require("uuid").uuid,
    cookie = require("cookie"),
    sys = require("sys"),
    store = require("sessionredis");
    
//var BACKEND = "redis";

exports.after = [setCookie];
exports.before = [extractSessionIdFromCookie];
exports.pluginName = 'session';
exports.helpers = {get:get, set:set, getSid: getSid};

// helpers
function get(field, callback){ 
  sys.puts("get called#####");
  var sid = this.response.get("session.id");
  store.get(sid, field, callback);
}

function set(field, value, callback){ 
  sys.puts("set called#####");
  var sid = this.response.get("session.id");
  store.set(sid, field, value, callback);
}

function getSid(){ 
  return this.response.get("session.id");
}

// plugins
function setCookie( ndt){ 
  var sid = ndt.response.get("session.id") || uuid();
  ndt.response.headers['Set-Cookie'] = cookie.compileCookie("sid", sid);
  
  sys.puts("set cookie sid=" + sid);
  ndt.next();
}

function extractSessionIdFromCookie(ndt){ 
  // from cookie
  var reqCookie = ndt.request.headers['cookie'];
  var sid = reqCookie ? cookie.parseCookie(reqCookie).sid : uuid(); 
  sys.puts(sid);
  ndt.response.set("session.id", sid);
  ndt.next();
}

