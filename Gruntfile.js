module.exports = function(grunt) {
	var requirejs = require("requirejs"),
		exec = require("child_process").exec,
		fatal = grunt.fail.fatal,
		log = grunt.log,
		verbose = grunt.verbose,
		buildConfigMain = grunt.file.readJSON("app.build.js");

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json')
	});

	grunt.registerTask(
	    "build",
    	"Run the r.js build script",
	    function() {
	        var done = this.async();
	        log.writeln("Running build...");
	        requirejs.optimize(buildConfigMain, function( output ) {
	            log.writeln( output );
	            log.ok("Main build complete.");
	            done();
	        }, function( err ) {
	            fatal( "Main build failure: " + err );
	        });

	        // This is run after the build completes
	        //grunt.task.run([ "transfer" ]);
	    }
	);

	// Transfer the build folder to the right location on the server
	grunt.registerTask(
	    "transfer",
	    "Transfer the updated files in ./built folder to ./assets and then remove it",
	    function() {
	        var done = this.async();
	        // Delete the build folder locally after transferring
	        exec("rsync -rlv --delete --delete-after --delete-excluded --exclude=/styles/sass ./built/ ./assets && rm -rf ./built",
	        function( err, stdout, stderr ) {
	            if ( err ) {
	                fatal("Problem with rsync: " + err + " " + stderr );
	            }
	            verbose.writeln( stdout );
	            log.ok("Rsync complete.");
	            done();
	        });
	    }
	);

};