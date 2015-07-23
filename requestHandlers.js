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
	var outputPath = "/Dev/node-js-minifier/tmp/";
	// TODO - upload file as original name

	console.log("Request handler 'upload' was called.");
	
	var form = new formidable.IncomingForm();
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
	
		console.log(files.upload.name);

		/* Possible error on Windows systems: tried to rename to an already existing file */
		fs.rename(files.upload.path, "/Dev/node-js-minifier/tmp/out.js", function(error) {
			if (error) {
				fs.unlink("/Dev/node-js-minifier/tmp/out.js");
				fs.rename(files.upload.path, "/Dev/node-js-minifier/tmp/out.js");
			}
		});
	
		/* So here is where we need to minify our incoming javascript */
		var jsinput = jsfile.readFile("/Dev/node-js-minifier/tmp/out.js");
		var result = jsfile.minify('/Dev/node-js-minifier/tmp/out.js', true);

		// TODO write minified version as filename .min.js instead of out-min.js
		fs.writeFile('/Dev/node-js-minifier/tmp/out-min.js', result, function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log("The file was saved!");
		}); 

		/* and write it back as the response of the upload */
		response.writeHead(200, {"content-type": "text/javascript"});
		var readStream = fs.createReadStream('/Dev/node-js-minifier/tmp/out-min.js');
    	readStream.pipe(response);
	});
}

function show(response) {
	console.log("Request handler 'show' was called.");
	response.writeHead(200, {'content-type': 'text/javascript'});
	fs.createReadStream('/Dev/node-js-minifier/tmp/out.js').pipe(response);
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

	var infix_cases = ['a','1','+','-','/', ',', ';', ':', '=', '&', '%', '*', '<', '>', '\?', '\|', '\n'];
	var infix_results = [];
	for (var i = 0; i < infix_cases.length; i++) {
		infix_results.push(jsfile.isInfix(infix_cases[i]));
	};

	var prefix_cases = ['a','1','+', '\{', '\(', '\[', '!'];
	var prefix_results = [];
	for (var i = 0; i < prefix_cases.length; i++) {
		prefix_results.push(jsfile.isPrefix(prefix_cases[i]));
	};	

	var postfix_cases = ['a','1','+', '\}', '\)', '\]'];
	var postfix_results = [];
	for (var i = 0; i < postfix_cases.length; i++) {
		postfix_results.push(jsfile.isPostfix(postfix_cases[i]));
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

	var result = jsfile.minify('/Dev/node-js-minifier/tmp/out.js', false);
	console.log('-----------------------------------');
	console.log(result);

	var body = '<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" content="text/html; '+
		'charset=UTF-8" />'+
		'</head>'+
		'<body>'+
		'<p>test: isAlphanumeric: cases = ' + alphanumeric_cases + ', results = ' + alphanumeric_results + '</p>'+
		'<p>test: isEndspace: cases = ' + endspace_cases + ', results = ' + endspace_results + '</p>'+
		'<p>test: isWhitespace: cases = ' + whitespace_cases + ', results = ' + whitespace_results + '</p>'+
		'<p>test: isInfix: cases = ' + infix_cases + ', results = ' + infix_results + '</p>'+
		'<p>test: isPrefix: cases = ' + prefix_cases + ', results = ' + prefix_results + '</p>'+
		'<p>test: isPostfix: cases = ' + postfix_cases + ', results = ' + postfix_results + '</p>'+

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