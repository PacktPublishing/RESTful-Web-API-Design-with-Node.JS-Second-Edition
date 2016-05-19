var mongoose = require('mongoose');

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
	groups: [String]
});

var Contact = mongoose.model('Contact', contactSchema);


var john_douglas = new Contact({
	firstname: "John",
	lastname: "Douglas",
	title: "Mr.",
	company: "Dev Inc.",
	jobtitle: "Developer",
	primarycontactnumber: "+359777223345",
	othercontactnumbers: [],
	primaryemailaddress: "john.douglas@xyz.com",
	emailaddresses: ["j.douglas@xyz.com"],
	groups: ["Dev"]
});
var db = mongoose.connection;
mongoose.connect('mongodb://localhost/contacts');
john_douglas.save(function(error){
	if (error) {
		console.log('Error while saving contact for Mr. John Douglas');
		console.log(error);
	} 
	else {
		john_douglas.save();
		console.log('Contact for Mr. John Douglas has been successfully	stored');		
	}	
});
