
/**
 * 
 dependencies.
 */



var express = require('express')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , logger = require('morgan')
  , methodOverride = require('method-override')
  , errorHandler = require('errorhandler')
  , levelup = require('levelup');
var app = express();
var url = require('url');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(methodOverride());
app.use(bodyParser.json());

// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

var db = levelup('./data',  {valueEncoding: 'json'});
db.put('+359777123456', {
        "firstname": "Joe",
        "lastname": "Smith",
        "title": "Mr.",
        "company": "Dev Inc.",
        "jobtitle": "Developer",
        "primarycontactnumber": "+359777123456",
        "othercontactnumbers": [
            "+359777456789",
            "+359777112233"
        ],
        "primaryemailaddress": "joe.smith@xyz.com",
        "emailaddresses": [
            "j.smith@xyz.com"
        ],
        "groups": [
            "Dev",
            "Family"
        ]
    });

app.get('/contacts/:number', function(request, response) {	

	console.log(request.url + ' : querying for ' + request.params.number);

	db.get(request.params.number, function(error, data) {

					if (error) {
						response.writeHead(404, {
							'Content-Type' : 'text/plain'});
						response.end('Not Found');
						return;
					} 
					
					response.setHeader('content-type', 'application/json');	
					response.send(data);
				  });
});

console.log('Running at port ' + app.get('port'));
http.createServer(app).listen(app.get('port'));

