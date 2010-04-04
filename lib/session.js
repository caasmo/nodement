var uuid = require("uuid").uuid;
var cookie = require("cookie");
var sys = require("sys");

var memoryStore ={};


function setCookie(req, res, ndt){ 
  
  var sid = res.sessionId || uuid();
  res.headers['Set-Cookie'] = "sid=" + sid;
  sys.puts("sid=" + sid);
  ndt.next();
}

function getCookieSessionId(req, res, ndt){ 
  var reqCookie = req.headers['cookie'];
  sys.puts(JSON.stringify(memoryStore));
  var sid;
  if (reqCookie) {
    var ckie = cookie.parseCookie(reqCookie);
    sys.puts(' session in cookie found!!');
    sid = ckie.sid;
    if (memoryStore[sid]){
      sys.puts('your last match:' + memoryStore[sid].match );
    }
    
  } else {
    // generate
    sid = uuid();
    memoryStore[sid] = {};
    memoryStore[sid].match = res.matches[1]; 
    
    
  }
  res.sessionId = sid;
  ndt.next();
  
}


function pa( req, res, ndt){ 
  sys.puts("pa called");
  //sys.puts(JSON.stringify(res.matches));
  sys.puts(uuid());

  setTimeout(function(){
    res.body += res.id +" pa";
    
  }, 1000); 
  sys.puts("pa return");
}


function pb( obj1, res, ndt){
  sys.puts("pb called");
  //sys.puts("exports:" + this.lipo.id); 
  setTimeout(function(){
    res.body += res.id +" pb";
    //next();
    ndt.next();
  }, 1000); 
  sys.puts("pb return");
}

function h(obj1, res, ndt){
  sys.puts("h: this is a helper");
  process.nextTick(function(){
     sys.puts("h: async lol");
    //res.body += res.id + " f\n";
     //next(new Error());
     //next('end');
     //ndt.next();
  });
}

exports.after = [setCookie,pb];
exports.before = [getCookieSessionId];
exports.pluginName = 'session';
exports.helpers = {h: h, memoryStore: memoryStore };
