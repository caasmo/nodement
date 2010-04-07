// TODO inject client
var client = require("redisclient").createClient();
var sys = require("sys");

exports.get = get;
exports.set = set;

function get(sid, field, callback){ 
  sys.puts("get redis called#####");
  //var sid = this.response.get("session.id");
  client.hget(sid, field, callback);
}

function set(sid, field, value, callback){ 
  sys.puts("set redis called#####");
  //var sid = this.response.get("session.id");
  client.hset(sid, field, value, callback);
}
