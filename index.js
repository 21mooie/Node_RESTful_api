const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

var server = http.createServer(function(req,res){
     
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

    
});


server.listen(config.port,function(){
    console.log("The server is listening on port " + config.port + " in " + config.envName + " mode.");
})

var handlers = {};

handlers.sample = function(data,callback){
    callback(406,{'name':'sample handler'})
};

handlers.notFound = function(data,callback){
    callback(404);
};

var router = {
    'sample' : handlers.sample
};