function handle_GET_request(request, response) {
	response.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	response.end('Get action was requested');
}

function handle_POST_request(request, response) {
	response.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	response.end('Post action was request');
}

function handle_PUT_request(request, response) {
	response.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	response.end('Put action was request');
}

function handle_HEAD_request(request, response) {
	response.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	response.end('Head action was request');
}

function handle_DELETE_request(request, response) {
	response.writeHead(200, {
		'Content-Type' : 'text/plain'
	});
	response.end('Delete action was request');
}

function handle_bad_request(request, response) {
	response.writeHead(400, {
		'Content-Type' : 'text/plain'
	});
	response.end('Bad request');
}

exports.handle_request = function (request, response) {

	switch (request.method) {
	case 'GET':
		handle_GET_request(request, response);
		break;
	case 'POST':
		handle_POST_request(request, response);
		break;
	case 'PUT':
		handle_PUT_request(request, response);
		break;
	case 'DELETE':
		handle_DELETE_request(request, response);
		break;
	case 'HEAD':
		handle_HEAD_request(request, response);
		break;
	default:
		handle_bad_request(request, response);
		break;
	}
	console.log('Request processing by http-module ended');
};