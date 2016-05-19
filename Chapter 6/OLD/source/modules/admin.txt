exports.remove = function (model, _username, response) {
	console.log('Deleting user: '+ _username);
	
	model.findOne({username: _username}, function(error, data) {
		if (error) {
			console.log(error);
			if (response != null) {
				response.writeHead(500, {'Content-Type' : 'text/plain'});			
				response.end('Internal server error');
			}
			return;
		} else {	
			if (!data) {
				console.log('User' + _username + ' not found');				
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
	
	var _username = requestBody.username;
	console.log (requestBody);
	model.findOne({username: _username}, function(error, data) {
		if (error) {
			console.log(error);
			if (response != null) {
				response.writeHead(500, {'Content-Type' : 'text/plain'});			
				response.end('Internal server error');
			}
			return;
		} else {
			var user = toAuthUser(requestBody, model);
			if (!data) {
				console.log('User: ' + _username + 
						' does not exist. It will be created.');				
				
				user.save(function(error) {
					if (!error)
					user.save();
				});
				
				if (response != null) {
					response.writeHead(201, {'Content-Type' : 'text/plain'});
					response.end('Created');
				}
				return;
			}

			data.username = user.username;
			data.password = user.password;
			data.role = user.role;			
			
			data.save(function (error) {
				if (!error) {
					console.log('Successfully updated user: '+ _username);
					data.save();
				} else {
					console.log('Error on save operation');
				}
			});
			if (response != null) {
				response.send('Updated');
			}
		}
	});
};

exports.create = function (model, requestBody, response) {
	var user = toAuthUser(requestBody, model);
	var _username = requestBody.username;
	user.save(function(error) {
		
		if (!error) {			
			user.save();				
		} else {			
			console.log('Checking if user saving failed due to already existing user:' + _username);
			model.findOne({username: _username}, function(error, data) {
				if (error) {
					console.log(error);
					if (response != null) {						
						response.writeHead(500, {'Content-Type' : 'text/plain'});			
						response.end('Internal server error');
					}					
					return;
				} else {					
					var user = toAuthUser(requestBody, model);
					if (!data) {						
						console.log('The user does not exist. It will be created');						
						user.save(function(error) {
							if (!error) {
								user.save();
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
						console.log('Updating user:' + _username);
						
						data.username = user.username;
						data.password = user.password;
						data.role = user.role;
											
						data.save(function (error) {
							if (!error) {							
								data.save();
								response.end('Updated');
								console.log('Successfully updated user: ' + _username);
							} else {
								console.log('Error while saving user:' + _username);
								console.log(error);
							}
						});
					}
				}
			});	
		}
	});
};


function toAuthUser(body, AuthUser) {	
	
	return new AuthUser(
			{
				username: body.username,
				password: body.password,
				role: body.role
			});
}