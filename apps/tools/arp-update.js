String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

json


const RosApi = require('node-routeros').RouterOSAPI;
const fs = require ('fs');
const conn = new RosApi({
    host: '11.0.0.1',
    user: 'auto',
    password: 'orion123',
    port:8000
});

conn.connect().then(() => {
   console.log ("connected") ;
   var arplist = {};
   conn.write("/ip/arp/print").then (data => {
      data.forEach ((e)=>{
        try{
	arplist[e['mac-address'].toUpperCase().replaceAll(":","-")]=e.address; } catch(x){}
      });
      fs.writeFileSync("../dhcpserver/static.json",JSON.stringify(arplist, null,4));
      process.exit(0);
  }).catch((err)=>{
     console.log(err);
  });
}).catch((err) => {
    // Got an error while trying to connect
    console.log(err);
});



