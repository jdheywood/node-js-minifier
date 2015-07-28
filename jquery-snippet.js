/*!
 * jQuery JavaScript Library v1.11.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2015-04-28T16:19Z
 */

var deletedIds = [];

var slice = deletedIds.slice;

var concat = deletedIds.concat;

var push = deletedIds.push;

var indexOf = deletedIds.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};

var version = "1.11.3";

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
	// The jQuery object is actually just the init constructor 'enhanced'
	// Need init if jQuery is called (just allow error to be thrown if not included)
	return 'yippee'
};

// Support: Android<4.1, IE<9
// Make sure we trim BOM and NBSP
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/;
var rdashAlpha = /-([\da-z])/gi;

// Used by jQuery.camelCase as callback to replace()
var fcamelCase = function( all, letter ) {
	return letter.toUpperCase();
};

var forInLoopTest = function(incoming) {
	for ( james in incoming ) {
		console.log(james);
	}
};
