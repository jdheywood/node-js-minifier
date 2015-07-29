import { minify, isAlphanumeric, isEndspace, isWhitespace, isInfix, isPrefix, isPostfix, getChar, putChar, defined, miniOutput } from "./minifier";
import * as fs from "fs";
import * as formidable from "formidable";

export function start(response) {
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

export function upload(response, request) {
	console.log("Request handler 'upload' was called.");
	
	var form = new formidable.IncomingForm();
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
	
		// delete previously saved file for sanity
		fs.lstat("/Dev/node-js-minifier/tmp/out.js", function(err, stats) {
		    if (!err && stats.isFile()) {
		    	console.log('unlinking out.js');
		        fs.unlinkSync("/Dev/node-js-minifier/tmp/out.js");
		    }

			fs.rename(files.upload.path, "/Dev/node-js-minifier/tmp/out.js", function (error) {
				if (error) {
					fs.unlink("/Dev/node-js-minifier/tmp/out.js");
					fs.rename(files.upload.path, "/Dev/node-js-minifier/tmp/out.js");
					console.log('error renaming incoming file!');
				}
			});

			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("Received file:<br/>");
			response.write("<a href='/minify'>Minify this now by clicking here</a>");
			response.end();
		});
	});
}

export function process(response) {
	var result = '';
	try {
		result = minify("/Dev/node-js-minifier/tmp/out.js", true);
	} catch (err) {
		console.log(err);
	} finally {

		fs.open("/Dev/node-js-minifier/tmp/out-min.js", 'w+', function(err, fd) {
			if (err) {
				console.log('error opening min file');
			}

			fs.ftruncate(fd, 0, function(err){
		      	if (err) {
		      		console.log('error truncating min file');
		      	} 

				fs.writeFile('/Dev/node-js-minifier/tmp/out-min.js', result, function(err) {
					if (err) {
						console.log('error writing min file');
					}

					/* and write it back as the response of the upload */
					response.writeHead(200, { "content-type": "text/javascript" });
					var readStream = fs.createReadStream('/Dev/node-js-minifier/tmp/out-min.js');
					readStream.pipe(response);
				});

			});

		});
	}
}

export function show(response) {
	console.log("Request handler 'show' was called.");
	response.writeHead(200, {'content-type': 'text/javascript'});
	fs.createReadStream('/Dev/node-js-minifier/tmp/out-min.js').pipe(response);
}

export function test(response) {

	var alphanumeric_cases = ['abc123', '/*~#-', '123', 'abc'];
	var alphanumeric_results = [];
	for (let x of alphanumeric_cases) {
		alphanumeric_results.push(isAlphanumeric(x));
	}

	var endspace_cases = ['\n', '\r', '\f', ' ', ';', '', '-'];
	var endspace_results = [];
	for (let x of endspace_cases) {
		endspace_results.push(isEndspace(x));
	};

	var whitespace_cases = [' ', '\t', '\n', '\r', '\f', 'a', '1'];
	var whitespace_results = [];
	for (let x of whitespace_cases) {
		whitespace_results.push(isWhitespace(x));
	};

	var infix_cases = ['a','1','+','-','/', ',', ';', ':', '=', '&', '%', '*', '<', '>', '\?', '\|', '\n'];
	var infix_results = [];
	for (let x of infix_cases) {
		infix_results.push(isInfix(x));
	};

	var prefix_cases = ['a','1','+', '\{', '\(', '\[', '!'];
	var prefix_results = [];
	for (let x of prefix_cases) {
		prefix_results.push(isPrefix(x));
	};	

	var postfix_cases = ['a','1','+', '\}', '\)', '\]'];
	var postfix_results = [];
	for (let x of postfix_cases) {
		postfix_results.push(isPostfix(x));
	};

	var defined_cases = [ '', ' ', '0', false, undefined ];
	var defined_results = [];
	for (let x of defined_cases) {
		defined_results.push(defined(x));
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
		'<p>test: isInfix: cases = ' + infix_cases + ', results = ' + infix_results + '</p>'+
		'<p>test: isPrefix: cases = ' + prefix_cases + ', results = ' + prefix_results + '</p>'+
		'<p>test: isPostfix: cases = ' + postfix_cases + ', results = ' + postfix_results + '</p>'+
		'<p>test: defined: cases = ' + defined_cases + ', results = ' + defined_results + '</p>'+
		'</body>'+
		'</html>';
	
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}
