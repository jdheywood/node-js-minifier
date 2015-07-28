module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.initConfig({
    "babel": {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          "compiled/index.js": "index.js",
          "compiled/minifier.js": "minifier.js",
          "compiled/requestHandlers.js": "requestHandlers.js",
          "compiled/router.js": "router.js",
          "compiled/server.js": "server.js"
        }
      }
    }
  });

  grunt.registerTask("default", ["babel"]);

};