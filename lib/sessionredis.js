// TODO inject client
var client = require("redisclient").createClient();
var sys = require("sys");

exports.get = get;
exports.set = set;

function get(sid, field, callback){ 
  sys.puts("get redis called#####");
  try{
    client.hget(sid, field, callback);
  } catch(e) {
    sys.puts(e.message);
    callback(e);
  } 
 
}

function set(sid, field, value, callback){ 
  sys.puts("set redis called#####");
  try{
    client.hset(sid, field, value, callback);
  } catch(e) {
    sys.puts(e.message);
    callback(e);
  } 
}
