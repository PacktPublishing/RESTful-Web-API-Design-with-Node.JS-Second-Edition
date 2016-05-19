var express = require('express');
var url = require('url');
var app = express();

app.get('/hello', function(request, response){
	var get_params = url.parse(request.url, true).query;	
	
	if (Object.keys(get_params).length == 0)
	{		
		response.end('Hello all');	
	}
	else
	{	
		response.end('Hello ' + get_params.name);		
	}	
});

app.listen(3000);