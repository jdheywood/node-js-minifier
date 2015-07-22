var fs = require('fs');

function foo() {
	console.log("bar");
}

function readFile(filename) {
	var file = fs.readFileSync(filename, "utf8");
	return file;
}

function isAlphanumeric(input) {
	var expr = /^([0-9]|[a-z])+([0-9a-z]+)$/i
	return !!input.match(expr);
}

function isEndspace(input) {
	return (input === '\n' || input === '\r' || input === '\f')
}

function isWhitespace(input) {
	return (input === ' ' || input === "\t" || input === "\n" || input === "\r" || input === "\f");
}

function isInfix(input) {
	var expr = /[,;:=&%*<>\?\|\n]/;
	return !!input.match(expr);	
}

function isPrefix(input) {
	var expr = /[\{\(\[!]/; 
	return (!!input.match(expr) || isInfix(input));
}

function isPostfix(input) {
	var expr = /[\}\)\]]/; 
	return (!!input.match(expr) || isInfix(input));
}

function getChar(input, position) {
	return input.charAt(position);
}

function putChar(output, char) {
	return output.concat(char);
}

exports.foo = foo;
exports.readFile = readFile;
exports.isAlphanumeric = isAlphanumeric;
exports.isEndspace = isEndspace;
exports.isWhitespace = isWhitespace;
exports.isInfix = isInfix;
exports.isPrefix = isPrefix;
exports.isPostfix = isPostfix;
exports.getChar = getChar;
exports.putChar = putChar;
