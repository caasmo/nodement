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
  var sid = this.ndt.get("session.id");
  store.get(sid, field, callback);
}

function set(field, value, callback){ 
  sys.puts("set called#####");
  sys.puts(sys.inspect(this));      
  var sid = this.ndt.get("session.id");
  sys.puts("sid#####" + sid);
  store.set(sid, field, value, callback);
}

function getSid(){ 
  return this.ndt.get("session.id");
}

// plugins
function setCookie( ndt){ 
  var sid = ndt.get("session.id") || uuid();
  ndt.headers['Set-Cookie'] = cookie.compileCookie("sid", sid);
  
  sys.puts("setCookie sid=" + sid);
  ndt.next();
}

function extractSessionIdFromCookie(ndt){ 
  // from cookie
  var reqCookie = ndt.request.headers['cookie'];
  var sid = reqCookie ? cookie.parseCookie(reqCookie).sid : uuid(); 
  sys.puts(sid);
  ndt.set("session.id", sid);
  sys.puts(sys.inspect(ndt.nodement_store));     
  ndt.next();
}

