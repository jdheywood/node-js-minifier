"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _server = require("./server");

var _router = require("./router");

var _requestHandlers = require("./requestHandlers");

var handler = _interopRequireWildcard(_requestHandlers);

var handle = {};
handle["/"] = handler.start;
handle["/start"] = handler.start;
handle["/upload"] = handler.upload;
handle["/show"] = handler.show;
handle["/test"] = handler.test;
handle["/minify"] = handler.process;

(0, _server.start)(_router.route, handle);
//# sourceMappingURL=index.js.map
