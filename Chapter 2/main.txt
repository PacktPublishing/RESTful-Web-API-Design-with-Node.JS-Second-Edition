	var httpModule = require('./modules/http-module');
	
	var http = require('http');
	var port = 8080;
	
	http.createServer(httpModule.handle_request).listen(port, '127.0.0.1');