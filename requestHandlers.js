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



	var a = jsfile.isAlphanumeric('abc123');
	console.log(a);

	var b = jsfile.isAlphanumeric('/*');
	console.log(b);

	var c = jsfile.isEndspace('\n');
	console.log(c);

	var body = '<html>'+
		'<head>'+
		'<meta http-equiv="Content-Type" content="text/html; '+
		'charset=UTF-8" />'+
		'</head>'+
		'<body>'+
		'<p>test: isAlphanumeric: a=' + a + ', b=' + b + '</p>'+
		'<p>test: isEndspace: c=' + c + '</p>'+
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