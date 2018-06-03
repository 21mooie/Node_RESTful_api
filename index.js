const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const https = require('https');
const fs = require('fs');

var httpServer = http.createServer(function(req,res){
     unifiedServer(req,res);
});

//starts server
httpServer.listen(config.httpPort,function(){
    console.log("The server is listening on port " + config.httpPort + " in " + config.envName + " mode.");
})

var httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'),
    'cert' : fs.readFileSync('./https/cert.pem')
};
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
    unifiedServer(req,res);
}) 

httpsServer.listen(config.httpsPort,function(){
    console.log("The server is listening on port " + config.httpsPort + " in " + config.envName + " mode.");
})

var unifiedServer = function(req,res){
    var parsedUrl = url.parse(req.url,true)

    var path = parsedUrl.pathname;

    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //parse path for any query string peices
    var querySringObject = parsedUrl.query;

    var method = req.method.toLowerCase();

    var headers = req.headers;

    var decoder = new StringDecoder('utf-8');

    var buffer = '';
    
    req.on('data',function(data){
         buffer += decoder.write(data);
    });
    
    req.on('end',function(){
        buffer += decoder.end(); 

        //decides if path requested is defined in api or is 404
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        //construct object to send to handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : querySringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        }

        chosenHandler(data,function(statusCode,payload){
            //use status code of handler or default of 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            //use payload defined by handleror empty
            payload = typeof(payload) == 'object' ? payload : {};

            var payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');    
            res.writeHead(statusCode);
            res.end(payloadString);   
            
            console.log('Returning this response: ' , statusCode, payloadString);
        });
        
        
    });

    
}

var handlers = {};

handlers.ping = function(data,callback){
    callback(200);
}


handlers.notFound = function(data,callback){
    callback(404);
};

var router = {
    'ping' : handlers.ping
};