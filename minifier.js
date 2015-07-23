var fs = require('fs');

// Globals, find a better way todo this asap!
myInput = '';
myCharA = '';
myCharB = '';
myCharC = '';
myCharD = '';
myLast = '';
myLastNws = '';
myLastReadChar = '';
myOutput = '';
myPosition = 0;

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

function getChar() {
	if (myPosition < myInput.length) {
		myLastReadChar = myInput.charAt(myPosition++);
		return myLastReadChar;
	}
	else {
		return undefined;
	}
}

function putChar(char) {
	myOutput = myOutput.concat(char);
}

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
  putChar(myCharA);
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
  myCharD = getChar();
}

function defined(thing) {
	return (typeof thing !== 'undefined');
}

// put string and regexp literals
// when this sub is called, myCharA is on the opening delimiter character
function putLiteral() {
	var delimiter = myCharA; // ', " or /
	action1();
	do {
		while (defined(myCharA) && myCharA == '\\') {
			action1();
			action1();
		}
		action1();
	} while (myLast !== delimiter);
	if (myLast !== delimiter) {
		throw 'unterminated ' + (delimiter == '\'' ? 'single quoted string' : delimiter == '"' ? 'double quoted string' : 'regular expression') + ' literal, stopped';
	}
}

// If a is a whitespace then collapse all following whitespace.
// If any of the whitespace is a new line then ensure a is a new line
// when this function ends.
function collapseWhitespace() {
	while (defined(myCharA) && isWhitespace(myCharA) && 
		   defined(myCharB) && isWhitespace(myCharB)) {
		if (isEndspace(myCharA) || isEndspace(myCharB)) {
			myCharA = '\n';
		}
		action4(); // delete b
	}
}

// Advance a to non-whitespace or end of file.
// Doesn't print any of this whitespace.
function skipWhitespace() {
  while (defined(myCharA) && isWhitespace(myCharA)) {
    action3();
  }
}

// Advance a to non-whitespace or end of file
// If any of the whitespace is a new line then print one new line.
function preserveEndspace() {
  collapseWhitespace();
  if (defined(myCharA) && isEndspace(myCharA) && defined(myCharB) && !isPostfix(myCharB) ) {
    action1();
  }
  skipWhitespace();
}

function onWhitespaceConditionalComment() {
  return (defined(myCharA) && isWhitespace(myCharA) &&
          defined(myCharB) && myCharB == '/' &&
          defined(myCharC) && (myCharC == '/' || myCharC == '*') &&
          defined(myCharD) && myCharD == '@');
}

// ------------------------------------------------------------------------------------------

function minify(filename, stripDebug) {
	// read the file
	myInput = readFile(filename);

	// set up the buffer
	myCharA = getChar();
	while (defined(myCharA) && isWhitespace(myCharA)) {
		myCharA = getChar();
	}
	myCharB = getChar();
	myCharC = getChar();
	myCharD = getChar();
	myLast = undefined;
	myLastNws = undefined;

	var ccFlag = false;

	while (defined(myCharA)) {

		if (defined(myCharA)) {

			if (isWhitespace(myCharA)) {
				throw 'minifier bug: minify loop starting with whitespace, barfed!';
			}

			// Each branch handles trailing whitespace and ensures a is on non-whitespace or is undefined when branch finishes
			if (myCharA == '/') { // a division, comment, or regexp literal
		      	if (defined(myCharB) && myCharB == '/') { // slash-slash comment
		        	ccFlag = defined(myCharC) && myCharC == '@'; // tests in IE7 show no space allowed between slashes and at symbol
		        	do {
		          		ccFlag ? action2() : action3();
		        	} while (defined(myCharA) && !isEndspace(myCharA));
		        	if (defined(myCharA)) { // a is a new line
		          		if (ccFlag) {
		            		action1(); // cannot use preserveEndspace() here because it might not print the new line
		            		skipWhitespace();
		          		}
		          		else if (defined(myLast) && !isEndspace(myLast) && !isPrefix(myLast)) {
		            		preserveEndspace();
		          		}
		          		else {
		            		skipWhitespace();
		          		}
		        	}
		      	}
				else if (defined(myCharB) && myCharB == '*') { // slash-star comment
		    		ccFlag = defined(myCharC) && myCharC == '@'; // test in IE7 shows no space allowed between star and at symbol
		    		do {
		      			ccFlag ? action2() : action3();
		    		} while (defined(myCharB) && (myCharA != '*' && myCharB != '/'));
		    		if (defined(myCharB)) { // a is asterisk and b is foreslash
		      			if (ccFlag) {
		        			action2(); // the *
		        			action2(); // the /
		        			// inside the conditional comment there may be a missing terminal semi-colon
		        			preserveEndspace();
		      			}
		      			else { // the comment is being removed
		        			action3(); // the *
		        			myCharA = ' ';  // the /
		        			collapseWhitespace();
		        			if (defined(myLast) && defined(myCharB) &&
		            			((isAlphanumeric(myLast) && (isAlphanumeric(myCharB) || myCharB == '.')) ||
		             			(myLast == '+' && myCharB == '+') || (myLast == '-' && myCharB == '-'))) { // for a situation like 5-/**/-2 or a/**/a
		          				// When entering this block a is whitespace.
		          				// The comment represented whitespace that cannot be removed. Therefore replace the now gone comment with a whitespace.
		          				action1();
		        			}
		        			else if (defined(myLast) && !isPrefix(myLast)) {
		          				preserveEndspace();
		        			}
		        			else {
		          				skipWhitespace();
		        			}
		      			}
		    		}
		    		else {
		      			throw 'unterminated comment, stopped';
		    		}
		  		}
		  
		  		else if ( defined(myLastNws) && (myLastNws == ')' || myLastNws == ']' || myLastNws == '.' || isAlphanumeric(myLastNws)) ) { // division
		    		action1();
		    		collapseWhitespace();
		    		// don't want a division to become a slash-slash comment with following conditional comment
		    		onWhitespaceConditionalComment() ? action1() : preserveEndspace();
		  		}
		  		else { // regexp literal
		    		putLiteral();
		    		collapseWhitespace();
		    		// don't want closing delimiter to become a slash-slash comment with following conditional comment
		    		onWhitespaceConditionalComment() ? action1() : preserveEndspace();
		  		}
			}
			else if (myCharA == '\'' || myCharA == '"' ) { // string literal
		  		putLiteral();
		  		preserveEndspace();
			}
			else if (myCharA == '+' || myCharA == '-') { // careful with + + and - -
		  		action1();
		  		collapseWhitespace();
		  		if (defined(myCharA) && isWhitespace(myCharA)) {
		    		(defined(myCharB) && myCharB == myLast) ? action1() : preserveEndspace();
		  		}
			}
			else if (isAlphanumeric(myCharA)) { // keyword, identifiers, numbers
		  		action1();
		  		collapseWhitespace();
		  		if (defined(myCharA) && isWhitespace(myCharA)) {
		    		// if b is '.' could be (12 .toString()) which is property invocation. If space removed becomes decimal point and error.
		    		(defined(myCharB) && (isAlphanumeric(myCharB) || myCharB == '.')) ? action1() : preserveEndspace();
		  		}
			}
			else if (myCharA == ']' || myCharA == '}' || myCharA == ')') { // no need to be followed by space but maybe needs following new line
		  		action1();
		  		preserveEndspace();
			}
			else if (stripDebug && myCharA == ';' &&
		       		defined(myCharB) && myCharB == ';' &&
		       		defined(myCharC) && myCharC == ';') {
		  		action3(); // delete one of the semi-colons
		  		myCharA = '/'; // replace the other two semi-colons
		  		myCharB = '/'; // so the remainder of line is removed
			}
			else { // anything else just prints and trailing whitespace discarded
		  		action1();
		  		skipWhitespace();
			}
		}
	}

	if (defined(myLastReadChar) && myLastReadChar == '\n') {
    	putChar('\n');
  	}

  	return myOutput;
} // fin

exports.readFile = readFile;
exports.isAlphanumeric = isAlphanumeric;
exports.isEndspace = isEndspace;
exports.isWhitespace = isWhitespace;
exports.isInfix = isInfix;
exports.isPrefix = isPrefix;
exports.isPostfix = isPostfix;
exports.getChar = getChar;
exports.putChar = putChar;
exports.defined = defined;
exports.minify = minify;