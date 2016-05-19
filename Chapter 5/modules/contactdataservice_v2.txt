exports.remove = function (model, _primarycontactnumber, response) {
	console.log('Deleting contact with primary number: ' 
			+ _primarycontactnumber);	
	model.findOne({primarycontactnumber: _primarycontactnumber}, function(error, data) {
		if (error) {
			console.log(error);
			if (response != null) {
				response.writeHead(500, {'Content-Type' : 'text/plain'});			
				response.end('Internal server error');
			}
			return;
		} else {	
			if (!data) {
				console.log('not found');				
				if (response != null)
				{
					response.writeHead(404, {'Content-Type' : 'text/plain'});			
					response.end('Not Found');
				}
				return;
			} else {	
				data.remove(function(error){
					if (!error) {
						data.remove();						
											
					}
					else {
						console.log(error);
					}
				});				
				
				if (response != null){
					response.send('Deleted');	
				}				
				return;
			}
		}		
	});	
}

exports.update = function (model, requestBody, response) {
	
	var primarynumber = requestBody.primarycontactnumber;
	model.findOne({primarycontactnumber: primarynumber}, function(error, data) {
		if (error) {
			console.log(error);
			if (response != null) {
				response.writeHead(500, {'Content-Type' : 'text/plain'});			
				response.end('Internal server error');
			}
			return;
		} else {
			var contact = toContact(requestBody, model);
			if (!data) {
				console.log('Contact with primary number: ' + primarynumber + 
						' does not exist. The contact will be created.');				
				
				contact.save(function(error) {
					if (!error)
					contact.save();
				});
				
				if (response != null) {
					response.writeHead(201, {'Content-Type' : 'text/plain'});
					response.end('Created');
				}
				return;
			}
			//poulate the document with the updated values
			
			data.firstname = contact.firstname;
			data.lastname = contact.lastname;
			data.title = contact.title;
			data.company = contact.company;
			data.jobtitle = contact.jobtitle;
			data.primarycontactnumber = contact.primarycontactnumber;
			data.othercontactnumbers = contact.othercontactnumbers;
			data.emailaddresses = contact.emailaddresses;
			data.primaryemailaddress = contact.primaryemailaddress;
			data.groups = contact.groups;
			
			data.save(function (error) {
				if (!error) {
					console.log('Successfully updated contact with primary number: '+ primarynumber);
					data.save();
				} else {
					console.log('error on save');
				}
			});
			if (response != null) {
				response.status(200).send('Updated');
			}
		}
	});
};

exports.create = function (model, requestBody, response) {
	var contact = toContact(requestBody, model);
	var primarynumber = requestBody.primarycontactnumber;
	contact.save(function(error) {
		
		if (!error) {			
				contact.save();				
		} else {			
			console.log('Checking if contact saving failed due to already existing primary number:' + primarynumber);
			model.findOne({primarycontactnumber: primarynumber}, function(error, data) {
				if (error) {
					console.log(error);
					if (response != null) {						
						response.writeHead(500, {'Content-Type' : 'text/plain'});			
						response.end('Internal server error');
					}					
					return;
				} else {					
					var contact = toContact(requestBody, model);
					if (!data) {						
						console.log('The contact does not exist. It will be created');						
						contact.save(function(error) {
							if (!error) {
								contact.save();
							} else {
								console.log(error);
							}							
						});
						
						if (response != null) {
							response.writeHead(201, {'Content-Type' : 'text/plain'});
							response.end('Created');
						}
						return;
					} else {					
						console.log('Updating contact with primary contact number:' + primarynumber);
						data.firstname = contact.firstname;
						data.lastname = contact.lastname;
						data.title = contact.title;
						data.company = contact.company;
						data.jobtitle = contact.jobtitle;
						data.primarycontactnumber = contact.primarycontactnumber;
						data.othercontactnumbers = contact.othercontactnumbers;
						data.emailaddresses = contact.emailaddresses;
						data.primaryemailaddress = contact.primaryemailaddress;
						data.groups = contact.groups;
						
						data.save(function (error) {
							if (!error) {							
								data.save();
								response.end('Updated');
								console.log('Successfully Updated contat with primary contact number: ' + primarynumber);
							} else {
								console.log('Error while saving contact with primary contact number:' + primarynumber);
								console.log(error);
							}
						});
					}
				}
			});	
		}
	});
};

exports.findByNumber = function (model, _primarycontactnumber, response) {
	
	model.findOne({primarycontactnumber: _primarycontactnumber}, function(error, result) {
		if (error) {			
			console.error(error);
			response.writeHead(500, {'Content-Type' : 'text/plain'});			
			response.end('Internal server error');
			return;
		} else {
			if (!result) {
				if (response != null) {
					response.writeHead(404, {'Content-Type' : 'text/plain'});			
					response.end('Not Found');					
				}
				return;
			}
				
			if (response != null){
				response.setHeader('Content-Type', 'application/json');
				response.send(result);				
			}						
		}
	});	
};

exports.list = function (model, response) {
	model.find({}, function(error, result) {
		if (error) {
			console.error(error);
			return null;	
		}
		if (response != null) {
			response.json({
				object: 'contacts',					        
		        result: result
		    });
		}		
	});
}

exports.paginate = function (model, request, response) {
			
	model.paginate({},
			{page: request.query.page, limit: request.query.limit},
			function(error, result) {
				if (error) {
					console.error(error);
					response.writeHead(500, {
						'Content-Type' : 'text/plain'});
					response.end('Internal server error');
					return;	
				}
					
				response.json({
					object: 'contacts',
					page_count: 20,		        
				    result: result
				});
				
	});
}

function toContact(body, Contact) {	
	
	return new Contact(
			{
				firstname: body.firstname,
				lastname: body.lastname,
				title: body.title,
				company: body.company,
				jobtitle: body.jobtitle,
				primarycontactnumber: body.primarycontactnumber,
				primaryemailaddress: body.primaryemailaddress,				
				emailaddresses: body.emailaddresses,
				groups: body.groups,
				othercontactnumbers: body.othercontactnumbers				
			});
}

exports.query_by_arg = function (model, key, value, response) {
	//build a JSON string with the attribute and the value
	var filterArg = '{\"'+key + '\":' +'\"'+ value + '\"}';	
	var filter = JSON.parse(filterArg);
	
	model.find(filter, function(error, result) {
		if (error) {			
			console.error(error);
			response.writeHead(500, {'Content-Type' : 'text/plain'});			
			response.end('Internal server error');
			return;
		} else {
			if (!result) {
				if (response != null) {
					response.writeHead(404, {'Content-Type' : 'text/plain'});			
					response.end('Not Found');					
				}
				return;
			}
				
			if (response != null){
				response.setHeader('Content-Type', 'application/json');
				response.send(result);				
			}						
		}
	});	
}

exports.updateImage = function(gfs, request, response) {
	var _primarycontactnumber = request.params.primarycontactnumber;
	console.log('Updating image for primary contact number:' + _primarycontactnumber);
	request.pipe(gfs.createWriteStream({
		_id : _primarycontactnumber,
		filename : 'image',
		mode : 'w'
	}));
	response.send("Successfully uploaded image for primary contact number: "
			+ _primarycontactnumber);

};

exports.getImage = function(gfs, _primarycontactnumber, response) {
	console.log('Requesting image for primary contact number: ' + _primarycontactnumber);
	var imageStream = gfs.createReadStream({
		_id : _primarycontactnumber,
		filename : 'image',
		mode : 'r'
	});

	imageStream.on('error', function(error) {
		response.send('404', 'Not found');
		return;
	});

	response.setHeader('Content-Type', 'image/jpeg');
	imageStream.pipe(response);
};

exports.deleteImage = function(gfs, mongodb, _primarycontactnumber, response) {
	console.log('Deleting image for primary contact number:' + _primarycontactnumber);	
    var collection = mongodb.collection('fs.files');
    
    collection.remove({_id: _primarycontactnumber, 
    					filename: 'image'}, function (error, contact) {
        if (error) {
        	console.log(error);
        	return;
        }
        
        if (contact === null) {        	
        	response.send('404', 'Not found');		  
			return;        	
        }
        else {
        	console.log('Successfully deleted image for primary contact number: ' + _primarycontactnumber);
        }	        
    });
    				
    response.send('Successfully deleted image for primary contact number: ' + _primarycontactnumber);
}
