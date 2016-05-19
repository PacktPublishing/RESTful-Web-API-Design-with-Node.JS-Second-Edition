var http = require('http');
var port = 8180;

function handle_GET_request(response) {
	response.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	response.end('Get action was requested');
}

function handle_POST_request(response) {
	response.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	response.end('Post action was requested');
}

function handle_PUT_request(response) {
	response.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	response.end('Put action was requested');
}

function handle_HEAD_request(response) {
	response.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	response.end('Head action was requested');
}

function handle_DELETE_request(response) {
	response.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	response.end('Delete action was requested');
}

function handle_bad_request(response) {
	response.writeHead(400, {
		'Content-Type' : 'text/plain'
	});
	response.end('Bad request');
}

function handle_request(request, response) {

	switch (request.method) {
	case 'GET':
		handle_GET_request(response);
		break;
	case 'POST':
		handle_POST_request(response);
		break;
	case 'PUT':
		handle_PUT_request(response);
		break;
	case 'DELETE':
		handle_DELETE_request(response);
		break;
	case 'HEAD':
		handle_HEAD_request(response);
		break;
	default:
		handle_bad_request(response);
		break;
	}
	console.log('Request processing ended');
}

http.createServer(handle_request).listen(port, '127.0.0.1');

console.log('Started Node.js http server at http://127.0.0.1:' + port);
