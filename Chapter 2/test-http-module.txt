var sinon = require('sinon');

exports.test_handle_GET_request = function (test) {
	
	var response = {'writeHead' : function () {}, 'end': function() {}};
	var responseMock = sinon.mock(response);      
    
    responseMock.expects('end').once().withArgs('Get action was requested');
    responseMock.expects('writeHead').once().withArgs(200, {
		'Content-Type' : 'text/plain'
	});
    
    var request = {};
    var requestMock = sinon.mock(request);
    requestMock.method = 'GET';
    
    var http_module = require('../modules/http-module');
    
    http_module.handle_request(requestMock, response);
    
    responseMock.verify();
    test.done();
};

