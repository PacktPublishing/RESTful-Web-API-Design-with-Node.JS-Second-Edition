var express = require('express');
var app = express();

app.get('/hello/:name', function(request, response){
	response.send('hello ' + request.params.name);
});

app.listen(3000);