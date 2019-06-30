var dhcp = require('dhcp');
var path = require('path');

var environment = process.env.ENV || "office";
var staticMapPath = path.normalize(__dirname + "/../../deploy/env/" + environment + "/static.json");
var staticMap = require(staticMapPath);
var configPath = path.normalize(__dirname + "/../../deploy/env/" + environment + "/config.json");
var config = require (configPath);

var s = dhcp.createServer({
  // System settings
  range: config.range,
  static: staticMap,
 
  // Option settings (there are MUCH more)
  netmask: config.netmask,
  router: config.router,
  dns:config.dns,
  hostname:config.hostname,
  //forceOptions: ["hostname"],
  broadcast:config.broadcast,
  server:config.server,
  bootFile: function (req) {
    console.log(["boot",req]);
    if (req.clientId === 'foo bar') {
      return 'x86linux.0';
    } else {
      return 'x64linux.0';
    }
  }
});

 
s.on('message', function(data) {
  console.log(["message",data]);
});

s.on('bound', function(state) {
  console.log("BOUND:");
  console.log(state);
});

s.on("error", function(err, data) {
  console.log(err, data);
});

s.on("listening", function(sock) {
  var address = sock.address();
  console.info('Server Listening: ' + address.address + ':' + address.port);
});

s.on("close", function() {
  console.log('close');
});

s.listen();

process.on('SIGINT', ()=> {
  s.close();
});
