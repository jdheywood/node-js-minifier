var exec = require("child_process").exec;

function start(response) {
	console.log("Request handler 'start' was called.");
	
	exec("ls -lah", function (error, stdout, stderr) {
	//exec("find /", { timeout: 10000, maxBuffer: 20000*1024 }, function (error, stdout, stderr) {
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write(stdout);
		response.end();
		
		console.log("Request handler 'start' non-blocking response returned.");
	});
	
	console.log("Request handler 'start' finished.");
}

function upload(response) {
	console.log("Request handler 'upload' was called.");

	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello Upload......");
	response.end();
}

exports.start = start;
exports.upload = upload;