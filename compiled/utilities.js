'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.isKeyOrReservedWord = isKeyOrReservedWord;

var dictionary = ['abstract', 'arguments', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield'];

function contains(a, obj) {
	var i = a.length;
	while (i--) {
		if (a[i] === obj) {
			return true;
		}
	}
	return false;
}

function isKeyOrReservedWord(input, position) {
	var remaining = input.substr(position);
	var nextSpacePosition = remaining.indexOf(' ');
	var candidate = remaining.substring(0, nextSpacePosition);
	var isKeyOrReservedWord = contains(dictionary, candidate);
	if (isKeyOrReservedWord) {
		console.log(candidate);
		console.log(position);
		console.log(nextSpacePosition);
		return nextSpacePosition;
	} else {
		return 0;
	}
}
//# sourceMappingURL=utilities.js.map
