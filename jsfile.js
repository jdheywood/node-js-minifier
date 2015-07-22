var fs = require('fs');

// Globals, find a better way todo this asap!
myInput = '';
myCharA = '';
myCharB = '';
myCharC = '';
myCharD = '';
myLast = '';
myLastNws = '';
myOutput = '';
myPosition = 0;

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

/* New line characters before or after these characters can be removed.
   Not + - / in this list because they require special care. */
function isInfix(input) {
	var expr = /[,;:=&%*<>\?\|\n]/;
	return !!input.match(expr);	
}

// New line characters after these characters can be removed.
function isPrefix(input) {
	var expr = /[\{\(\[!]/; 
	return (!!input.match(expr) || isInfix(input));
}

// New line characters before these characters can removed.
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

/* ---------------------------------------------- */

// print a
// move b to a
// move c to b
// move d to c
// new d
//
// i.e. print a and advance
function action1() {
  if (!isWhitespace(myCharA)) {
    myLastNws = myCharA;
  }
  myLast = myCharA;
  action2();
}

// sneeky output a for comments
function action2() {
  putChar(myOutput, myCharA);
  action3();
}

// move b to a
// move c to b
// move d to c
// new d
//
// i.e. delete a
function action3() {
  myCharA = myCharB;
  action4();
}

// move c to b
// move d to c
// new d
//
// i.e. delete b
function action4() {
  myCharB = myCharC;
  myCharC = myCharD;
  myCharD = getChar(myInput, ++myPosition);
}


function minify(filename) {
	// read the file
	myInput = readFile(filename);

	// set up the buffer
	myCharA = getChar(myInput, 0);
	myCharB = getChar(myInput, 1);
	myCharC = getChar(myInput, 2);
	myCharD = getChar(myInput, 3);
	myLast = getChar(myInput, 0);
	myLastNws = getChar(myInput, 0);
	myPosition = 3;

	
}


/* ---------------------------------------------- */

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
exports.minify = minify;
