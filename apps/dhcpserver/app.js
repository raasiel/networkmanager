var dhcp = require('dhcp');
var environment = process.env.ENV || "office";
var staticMap = require(__dirname + "../deploy/" + environment + "/static.json");
console.log(["static",staticMap]);
 
function fnStaticDetermine (clientMac, req){
	console.log (["static" , clientMac, req]);
	return null;
}

var s = dhcp.createServer({
  // System settings
  range: [
    "11.10.214.50", "11.10.214.150"
  ],
  static: new fnStaticDetermine(),
 
  // Option settings (there are MUCH more)
  netmask: '255.0.0.0',
  router: [
    '11.0.0.1'
  ],
  dns:["8.8.8.8","8.8.4.4"],
  hostname:"netrunner",
  //forceOptions: ["hostname"],
  broadcast:"11.255.255.255",
  server:"11.0.0.1",
  bootFile: function (req) {
    console.log(["boot",req]);
    if (req.clientId === 'foo bar') {
      return 'x86linux.0';
    } else {
      return 'x64linux.0';
    }
  }
});

console.log(["dhcp.config",s["config"],s]);

 
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

process.on('SIGINT', () => {
  s.close();
});