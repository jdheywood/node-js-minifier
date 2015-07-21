var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable");

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
		fs.rename(files.upload.path, "/Dev/Node/tmp/test.jpg", function(error) {
			if (error) {
				fs.unlink("/Dev/Node/tmp/test.jpg");
				fs.rename(files.upload.path, "/Dev/Node/tmp/test.jpg");
			}
		});
	
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("Received image:<br/>");
		response.write("<img src='/show' />");
		response.end();
	});
}

function show(response) {
	console.log("Request handler 'show' was called.");
	response.writeHead(200, {'content-type': 'image/jpeg'});
	fs.createReadStream('/Dev/Node/tmp/test.jpg').pipe(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;