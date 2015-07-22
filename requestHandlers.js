var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable"),
	jsfile = require("./jsfile");

function start(response) {
	console.log("Request handler 'start' was called.");
	
	var body = '<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" content="text/html; '+
		'charset=UTF-8" />'+
		'</head>'+
		'<body>'+
		'<form action="/upload" method="post" enctype="multipart/form-data">'+
		'<input type="file" name="upload">'+
		'<input type="submit" value="Upload file" />'+
		'</form>'+
		'</body>'+
		'</html>';
	
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function upload(response, request) {
	console.log("Request handler 'upload' was called.");
	
	var form = new formidable.IncomingForm();
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
		
		/* Possible error on Windows systems: tried to rename to an already existing file */
		fs.rename(files.upload.path, "/Dev/Node/tmp/out.js", function(error) {
			if (error) {
				fs.unlink("/Dev/Node/tmp/out.js");
				fs.rename(files.upload.path, "/Dev/Node/tmp/out.js");
			}
		});
	
		/* So here is where we need to minify our incoming javascript */
		jsfile.foo();
		var jsinput = jsfile.readFile("/Dev/Node/tmp/out.js");
		//console.log(jsinput);

		response.writeHead(200, {"content-type": "text/javascript"});
		var readStream = fs.createReadStream('/Dev/Node/tmp/out.js');
    	readStream.pipe(response);
	});
}

function show(response) {
	console.log("Request handler 'show' was called.");
	response.writeHead(200, {'content-type': 'text/javascript'});
	fs.createReadStream('/Dev/Node/tmp/out.js').pipe(response);
}

function test(response) {

	var alphanumeric_cases = ['abc123', '/*~#-', '123', 'abc'];
	var alphanumeric_results = [];
	for (var i = 0; i < alphanumeric_cases.length; i++) {
		alphanumeric_results.push(jsfile.isAlphanumeric(alphanumeric_cases[i]));
	};

	var endspace_cases = ['\n', '\r', '\f', ' ', ';', '', '-'];
	var endspace_results = [];
	for (var i = 0; i < endspace_cases.length; i++) {
		endspace_results.push(jsfile.isEndspace(endspace_cases[i]));
	};

	var whitespace_cases = [' ', '\t', '\n', '\r', '\f', 'a', '1'];
	var whitespace_results = [];
	for (var i = 0; i < whitespace_cases.length; i++) {
		whitespace_results.push(jsfile.isWhitespace(whitespace_cases[i]));
	};


	var getChar_case = 'hello world';
	var getChar_result = '';
	for (var i = 0; i < getChar_case.length; i++) {
		getChar_result = getChar_result + jsfile.getChar(getChar_case, i);
	}

	var putChar_result = '';
	for (var i = 0; i < getChar_case.length; i++) {
		putChar_result = jsfile.putChar(putChar_result, jsfile.getChar(getChar_case, i));
	}


	var body = '<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" content="text/html; '+
		'charset=UTF-8" />'+
		'</head>'+
		'<body>'+
		'<p>test: isAlphanumeric: cases = ' + alphanumeric_cases + ', results = ' + alphanumeric_results + '</p>'+
		'<p>test: isEndspace: cases = ' + endspace_cases + ', results = ' + endspace_results + '</p>'+
		'<p>test: isWhitespace: cases = ' + whitespace_cases + ', results = ' + whitespace_results + '</p>'+

		'<p>test: getChar: case = ' + getChar_case + ', result = ' + getChar_result + '</p>'+
		'<p>test: getChar: case = ' + getChar_case + ', putChar: result = ' + putChar_result + '</p>'+

		'</body>'+
		'</html>';
	
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.test = test;