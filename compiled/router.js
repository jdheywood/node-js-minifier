"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.route = route;

function route(handle, pathname, response, request) {
	// TODO: skip requests for pathname == '/favicon.ico'
	console.log("About to route a request for " + pathname);
	if (typeof handle[pathname] === 'function') {
		return handle[pathname](response, request);
	} else {
		console.log("No request handler found for " + pathname);
		response.writeHead(404, { "Content-Type": "text/html" });
		response.write('404 Not found');
		response.end();
	}
}
//# sourceMappingURL=router.js.map
