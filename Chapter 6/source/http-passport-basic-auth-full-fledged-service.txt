var express = require('express')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , logger = require('morgan')
  , methodOverride = require('method-override')
  , errorHandler = require('errorhandler')
  , mongoose = require('mongoose')
  , _v1 = require('./modules/contactdataservice_v1')
  , _v2 = require('./modules/contactdataservice_v2')
  , admin = require('./modules/admin')
  , CacheControl = require("express-cache-control")
  , fs = require('fs')
  , Grid = require('gridfs-stream')
  , expressPaginate = require('express-paginate')
  , mongoosePaginate = require('mongoose-paginate')
  
var passport = require('passport')
  , BasicStrategy = require('passport-http').BasicStrategy;
    

var app = express();
var url = require('url');
var cache = new CacheControl().middleware;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(methodOverride());
app.use(expressPaginate.middleware(10,100)); 
app.use(bodyParser.json());
app.use(passport.initialize());
// development only
if ('development' == app.get('env')) {
  app.use(errorHandler());
}


mongoose.connect('mongodb://localhost/contacts');
var mongodb = mongoose.connection;

var contactSchema = new mongoose.Schema({
	primarycontactnumber: {type: String, index: {unique: true}},
	firstname: String,
	lastname: String,
	title: String,
	company: String,
	jobtitle: String,	
	othercontactnumbers: [String],
	primaryemailaddress: String,
	emailaddresses: [String],
	groups: [String],
});
var authUserSchema = new mongoose.Schema({	
	username:  {type: String, index: {unique: true}},
	password: String,
	role: String,
});

var AuthUser = mongoose.model('AuthUser', authUserSchema);

passport.use(new BasicStrategy(
  function(username, password, done) {    
		AuthUser.findOne({username: username, password:  password}, 
						function(error, user) {
							if (error) {
								console.log(error);			
								return done(error);
							} else {			
								if (!user) {
									console.log('unknown user');
									return done(error);					
								} else {
									console.log(user.username + ' authenticated successfully');
									return done(null, user);
								}
							}
						});  
}));


contactSchema.plugin(mongoosePaginate);

var Contact = mongoose.model('Contact', contactSchema);

app.get('/v1/contacts/', passport.authenticate('basic', { session: false }), function(request, response) {
	var get_params = url.parse(request.url, true).query;	

	if (Object.keys(get_params).length == 0)
	{		
		_v1.list(Contact, response);	
	}
	else
	{
		var key = Object.keys(get_params)[0];
		var value = get_params[key];
		
		JSON.stringify(_v2.query_by_arg(Contact, 
										key, 
										value, 
										response));		
	}
});
 
app.get('/v1/contacts/:primarycontactnumber', passport.authenticate('basic', { session: false }), function(request, response) {

	console.log(request.url + ' : querying for ' + request.params.number);
	_v1.findByNumber(Contact, request.params.primarycontactnumber, response);	
});

app.post('/v1/contacts/', passport.authenticate('basic', { session: false }), function(request, response) {
	_v1.update(Contact, request.body, response)	
});

app.put('/v1/contacts/', passport.authenticate('basic', { session: false }), function(request, response) {
	_v1.create(Contact, request.body, response)	
});

app.del('/v1/contacts/:primarycontactnumber', passport.authenticate('basic', { session: false }), function(request, response) {
    _v1.remove(Contact, request.params.primarycontactnumber, response);
});

//version 2 default routing

app.get('/contacts/:primarycontactnumber', passport.authenticate('basic', { session: false }), function(request, response) {

	console.log(request.url + ' : querying for ' + request.params.number);
	_v2.findByNumber(Contact, request.params.primarycontactnumber, response);	
});

app.post('/contacts/', passport.authenticate('basic', { session: false }), function(request, response) {
	_v2.update(Contact, request.body, response)	
});

app.put('/contacts/', passport.authenticate('basic', { session: false }), function(request, response) {
	_v2.create(Contact, request.body, response)	
});

app.del('/contacts/:primarycontactnumber', passport.authenticate('basic', { session: false }), function(request, response) {
    _v2.remove(Contact, request.params.primarycontactnumber, response);
});

app.get('/contacts/:primarycontactnumber/image', passport.authenticate('basic', { session: false }), function(request, response){
	var gfs = Grid(mongodb.db, mongoose.mongo);
	_v2.getImage(gfs, request.params.primarycontactnumber, response);

})

app.post('/contacts/:primarycontactnumber/image', passport.authenticate('basic', { session: false }), function(request, response){
	var gfs = Grid(mongodb.db, mongoose.mongo);
	_v2.updateImage(gfs, request, response);
})

app.del('/contacts/:primarycontactnumber/image', passport.authenticate('basic', { session: false }), function(request, response){
		var gfs = Grid(mongodb.db, mongoose.mongo);
		_v2.deleteImage(gfs, mongodb.db, request.params.primarycontactnumber, response);
})

app.get('/contacts', cache('minutes',1), passport.authenticate('basic', { session: false }), function(request, response) {
	var get_params = url.parse(request.url, true).query;
	console.log('redirecting to /v2/contacts');
	response.writeHead(302, {'Location' : '/v2/contacts/'});
	response.end('Version 2 is found at URI /v2/contacts/ ');		
});

app.get('/contacts/:primarycontactnumber',  passport.authenticate('basic', { session: false }), function(request, response) {

	console.log(request.url + ' : querying for ' + request.params.number);
	_v2.findByNumber(Contact, request.params.primarycontactnumber, response);	
});



//version 2 explicit routing

app.get('/v2/contacts', cache('minutes',1), passport.authenticate('basic', { session: false }), function(request, response) {
	
	var get_params = url.parse(request.url, true).query;	
	if (Object.keys(get_params).length == 0)
	{		
		_v2.paginate(Contact, request, response);
	}
	else
	{		
		if (get_params['limit'] != null || get_params['page'] !=null)
		{
			_v2.paginate(Contact, request, response);
		}
		else
		{
			var key = Object.keys(get_params)[0];
			var value = get_params[key];
			
			_v2.query_by_arg(Contact, 
											key, 
											value, 
											response);
		}
	}
});


app.get('/v2/contacts/:primarycontactnumber/image', function(request, response){
	var gfs = Grid(mongodb.db, mongoose.mongo);
	_v2.getImage(gfs, request.params.primarycontactnumber, response);

})


app.post('/v2/contacts/:primarycontactnumber/image', function(request, response){
	var gfs = Grid(mongodb.db, mongoose.mongo);
	_v2.updateImage(gfs, request, response);
})


app.del('/v2/contacts/:primarycontactnumber/image', function(request, response){
		var gfs = Grid(mongodb.db, mongoose.mongo);
		_v2.deleteImage(gfs, mongodb.db, request.params.primarycontactnumber, response);
})

	
app.get('/v2/contacts/:primarycontactnumber', function(request, response) {

	console.log(request.url + ' : querying for ' + request.params.number);
	_v2.findByNumber(Contact, request.params.primarycontactnumber, response);	
});

app.post('/v2/contacts/', function(request, response) {
	_v2.update(Contact, request.body, response)	
});

app.put('/v2/contacts/', function(request, response) {
	_v2.create(Contact, request.body, response)	
});

app.del('/v2/contacts/:primarycontactnumber', function(request, response) {
    _v2.remove(Contact, request.params.primarycontactnumber, response);
});

//user administration

app.post('/admin', passport.authenticate('basic', { session: false }), function(request, response) {
	
	authorize(request.user, response);
	if (!response.closed) {
		admin.update(AuthUser, request.body, response);
	}
});

app.put('/admin', passport.authenticate('basic', { session: false }), function(request, response) {
	authorize(request.user, response);
	if (!response.closed) {
		admin.create(AuthUser, request.body, response);
	}
});

app.del('/admin/:username', passport.authenticate('basic', { session: false }), function(request, response) {
	authorize(request.user, response);
	if (!response.closed) {
		admin.remove(AuthUser, request.params.username, response);
	}
});

function authorize(user, response) {
	if ((user == null) || (user.role != 'Admin')) {
		response.writeHead(403, {
			'Content-Type' : 'text/plain'});
		response.end('Forbidden');
		return;
	}
}

function toContact(body)
{
	return new Contact(
			{
				firstname: body.firstname,
				lastname: body.lastname,
				title: body.title,
				company: body.company,
				jobtitle: body.jobtitle,
				primarycontactnumber: body.primarycontactnumber,
				othercontactnumbers: body.othercontactnumbers,
				primaryemailaddress: body.primaryemailaddress,
				emailaddresses: body.emailaddresses,
				groups: body.groups
			});
}

console.log('Running at port ' + app.get('port'));
http.createServer(app).listen(app.get('port'));