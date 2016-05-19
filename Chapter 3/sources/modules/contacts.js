var fs = require('fs');

function read_json_file()
{
	var file = './data/contacts.json';	
	return fs.readFileSync(file);
}

exports.list = function()
{	
	return JSON.parse(read_json_file());	
};

exports.query = function(number)
{	
	var json = read_json_file();
	var json_result = JSON.parse(json);
	var result = json_result.result;
	
	for (var i = 0; i < result.length; i++)
	{
		var contact = result[i];
		if (contact.primarycontactnumber === number)
		{
			return contact;
		}
	}
	return null;
};

exports.query_by_arg = function(arg, value)
{
	var json = read_json_file();
	var json_result = JSON.parse(json);
	var result = json_result.result;
	
	for (var i = 0; i < result.length; i++)
	{
		var contact = result[i];
		if (contact[arg] === value)
		{
			return contact;
		}
	}
	return null;
};	
	
exports.list_groups = function()
{
	var json = read_json_file();
	var json_result = JSON.parse(json);
	var result = json_result.result;
	
	var resultArray = [];
	
	for (var i = 0; i < result.length; i++)
	{
		var groups = result[i].groups;
		for (var index = 0; index < groups.length; index++)
		{
			if (resultArray.indexOf(groups[index]) ===-1)
			{
				resultArray.push(groups[index]);
			}
		}
	}
	
	return resultArray;
};

exports.get_members = function(group_name)
{
	var json = read_json_file();
	var json_result = JSON.parse(json);
	var result = json_result.result;
	
	var resultArray = [];
	
	for (var i = 0; i < result.length; i++)
	{	
		
		if (result[i].groups.indexOf(group_name) > -1)
		{
			resultArray.push(result[i]);
		}
	}
	
	return resultArray;
};
