var sys = require("sys");
//var ndmt = require("nodement").nodement();

function pa( req, res, ndt){ 
  sys.puts("pa called");
  sys.puts(JSON.stringify(res.matches));
  

  setTimeout(function(){
    res.body += res.id +" pa";
    ndt.next();
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

exports.after = [pb];
exports.before = [pa,pb];
exports.pluginName = 'session';
exports.helpers = {h: h};
