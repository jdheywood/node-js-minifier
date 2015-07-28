"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.start = start;
exports.upload = upload;
exports.show = show;
exports.test = test;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _minifier = require("./minifier");

var _fs = require("fs");

var fs = _interopRequireWildcard(_fs);

var _formidable = require("formidable");

var formidable = _interopRequireWildcard(_formidable);

function start(response) {
	console.log("Request handler 'start' was called.");

	var body = '<html>' + '<head>' + '<meta http-equiv="Content-Type" content="text/html; ' + 'charset=UTF-8" />' + '</head>' + '<body>' + '<form action="/upload" method="post" enctype="multipart/form-data">' + '<input type="file" name="upload">' + '<input type="submit" value="Upload file" />' + '</form>' + '</body>' + '</html>';

	response.writeHead(200, { "Content-Type": "text/html" });
	response.write(body);
	response.end();
}

function upload(response, request) {
	console.log("Request handler 'upload' was called.");

	var form = new formidable.IncomingForm();
	form.parse(request, function (error, fields, files) {
		console.log("parsing done");

		/* Possible error on Windows systems: tried to rename to an already existing file */
		fs.rename(files.upload.path, "/Dev/node-js-minifier/tmp/out.js", function (error) {
			if (error) {
				fs.unlink("/Dev/node-js-minifier/tmp/out.js");
				fs.rename(files.upload.path, "/Dev/node-js-minifier/tmp/out.js");
			}

			/* So here is where we need to minify our incoming javascript */
			var result = '';
			try {
				result = (0, _minifier.minify)('/Dev/node-js-minifier/tmp/out.js', true);
			} catch (err) {
				console.log('****************************');
				console.log(err);
			} finally {
				fs.writeFile('/Dev/node-js-minifier/tmp/out-min.js', result, function (err) {
					if (err) {
						return console.log(err);
					}
					console.log("The file was saved!");
				});

				/* and write it back as the response of the upload */
				response.writeHead(200, { "content-type": "text/javascript" });
				var readStream = fs.createReadStream('/Dev/node-js-minifier/tmp/out-min.js');
				readStream.pipe(response);
			}
		});
	});
}

function show(response) {
	console.log("Request handler 'show' was called.");
	response.writeHead(200, { 'content-type': 'text/javascript' });
	fs.createReadStream('/Dev/node-js-minifier/tmp/out-min.js').pipe(response);
}

function test(response) {

	var alphanumeric_cases = ['abc123', '/*~#-', '123', 'abc'];
	var alphanumeric_results = [];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = alphanumeric_cases[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var x = _step.value;

			alphanumeric_results.push((0, _minifier.isAlphanumeric)(x));
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator["return"]) {
				_iterator["return"]();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	var endspace_cases = ['\n', '\r', '\f', ' ', ';', '', '-'];
	var endspace_results = [];
	var _iteratorNormalCompletion2 = true;
	var _didIteratorError2 = false;
	var _iteratorError2 = undefined;

	try {
		for (var _iterator2 = endspace_cases[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
			var x = _step2.value;

			endspace_results.push((0, _minifier.isEndspace)(x));
		}
	} catch (err) {
		_didIteratorError2 = true;
		_iteratorError2 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
				_iterator2["return"]();
			}
		} finally {
			if (_didIteratorError2) {
				throw _iteratorError2;
			}
		}
	}

	;

	var whitespace_cases = [' ', '\t', '\n', '\r', '\f', 'a', '1'];
	var whitespace_results = [];
	var _iteratorNormalCompletion3 = true;
	var _didIteratorError3 = false;
	var _iteratorError3 = undefined;

	try {
		for (var _iterator3 = whitespace_cases[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
			var x = _step3.value;

			whitespace_results.push((0, _minifier.isWhitespace)(x));
		}
	} catch (err) {
		_didIteratorError3 = true;
		_iteratorError3 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
				_iterator3["return"]();
			}
		} finally {
			if (_didIteratorError3) {
				throw _iteratorError3;
			}
		}
	}

	;

	var infix_cases = ['a', '1', '+', '-', '/', ',', ';', ':', '=', '&', '%', '*', '<', '>', '\?', '\|', '\n'];
	var infix_results = [];
	var _iteratorNormalCompletion4 = true;
	var _didIteratorError4 = false;
	var _iteratorError4 = undefined;

	try {
		for (var _iterator4 = infix_cases[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
			var x = _step4.value;

			infix_results.push((0, _minifier.isInfix)(x));
		}
	} catch (err) {
		_didIteratorError4 = true;
		_iteratorError4 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
				_iterator4["return"]();
			}
		} finally {
			if (_didIteratorError4) {
				throw _iteratorError4;
			}
		}
	}

	;

	var prefix_cases = ['a', '1', '+', '\{', '\(', '\[', '!'];
	var prefix_results = [];
	var _iteratorNormalCompletion5 = true;
	var _didIteratorError5 = false;
	var _iteratorError5 = undefined;

	try {
		for (var _iterator5 = prefix_cases[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
			var x = _step5.value;

			prefix_results.push((0, _minifier.isPrefix)(x));
		}
	} catch (err) {
		_didIteratorError5 = true;
		_iteratorError5 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
				_iterator5["return"]();
			}
		} finally {
			if (_didIteratorError5) {
				throw _iteratorError5;
			}
		}
	}

	;

	var postfix_cases = ['a', '1', '+', '\}', '\)', '\]'];
	var postfix_results = [];
	var _iteratorNormalCompletion6 = true;
	var _didIteratorError6 = false;
	var _iteratorError6 = undefined;

	try {
		for (var _iterator6 = postfix_cases[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
			var x = _step6.value;

			postfix_results.push((0, _minifier.isPostfix)(x));
		}
	} catch (err) {
		_didIteratorError6 = true;
		_iteratorError6 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
				_iterator6["return"]();
			}
		} finally {
			if (_didIteratorError6) {
				throw _iteratorError6;
			}
		}
	}

	;

	var defined_cases = ['', ' ', '0', false, undefined];
	var defined_results = [];
	var _iteratorNormalCompletion7 = true;
	var _didIteratorError7 = false;
	var _iteratorError7 = undefined;

	try {
		for (var _iterator7 = defined_cases[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
			var x = _step7.value;

			defined_results.push((0, _minifier.defined)(x));
		}
	} catch (err) {
		_didIteratorError7 = true;
		_iteratorError7 = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion7 && _iterator7["return"]) {
				_iterator7["return"]();
			}
		} finally {
			if (_didIteratorError7) {
				throw _iteratorError7;
			}
		}
	}

	var body = '<html>' + '<head>' + '<meta http-equiv="Content-Type" content="text/html; ' + 'charset=UTF-8" />' + '</head>' + '<body>' + '<p>test: isAlphanumeric: cases = ' + alphanumeric_cases + ', results = ' + alphanumeric_results + '</p>' + '<p>test: isEndspace: cases = ' + endspace_cases + ', results = ' + endspace_results + '</p>' + '<p>test: isWhitespace: cases = ' + whitespace_cases + ', results = ' + whitespace_results + '</p>' + '<p>test: isInfix: cases = ' + infix_cases + ', results = ' + infix_results + '</p>' + '<p>test: isPrefix: cases = ' + prefix_cases + ', results = ' + prefix_results + '</p>' + '<p>test: isPostfix: cases = ' + postfix_cases + ', results = ' + postfix_results + '</p>' + '<p>test: defined: cases = ' + defined_cases + ', results = ' + defined_results + '</p>' + '</body>' + '</html>';

	response.writeHead(200, { "Content-Type": "text/html" });
	response.write(body);
	response.end();
}
//# sourceMappingURL=requestHandlers.js.map
