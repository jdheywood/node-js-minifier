"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.start = start;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _http = require("http");

var http = _interopRequireWildcard(_http);

var _url = require("url");

var url = _interopRequireWildcard(_url);

function start(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");

		//request.setEncoding("utf8");

		//request.addListener("data", function(postDataChunk) {
		//	postData += postDataChunk;
		//	console.log("Received POST data chunk '" + postDataChunk + "'.");
		//});

		//request.addListener("end", function() {
		//route(handle, pathname, response, postData);
		//});

		route(handle, pathname, response, request);
	}

	http.createServer(onRequest).listen(8888);
	console.log("Server has started.");
}
//# sourceMappingURL=server.js.map
