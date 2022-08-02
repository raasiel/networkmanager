var path = require('path');
var environment = process.env.ENV || "home";
var configPath = path.normalize(__dirname + "/../../deploy/env/" + environment + "/dnsserver.config.json");
var config = require(configPath);

let dns2 = require('dns2');
let clientOptions = {
    dns: config.source.ip,
    port: config.source.port
};

const { Packet } = dns2;

const server = dns2.createServer({
    udp: true,
    handle: (request, send, rinfo) => {

        let dns = new dns2(clientOptions);
        (async () =>
        {
            if (config.interrupts[request.questions[0].name]!=null){
                let response = Packet.createResponseFromRequest(request);
                let [question] = request.questions;
                let {name} = question;
                send(response);
            }
            else {
                let result = await dns.resolveA(request.questions[0].name);
                let response = Packet.createResponseFromRequest(request);
                let [question] = request.questions;
                let {name} = question;
                response.answers = result.answers;
                send(response);
            }
        })();
    }
});

server.on('request', (request, response, rinfo) => {
    console.log(request.header.id, request.questions[0]);
});

server.on('requestError', (error) => {
    console.log('Client sent an invalid request', error);
});

server.on('listening', () => {
    console.log(server.addresses());
});

server.on('close', () => {
    console.log('server closed');
});

server.listen(config.listen);

