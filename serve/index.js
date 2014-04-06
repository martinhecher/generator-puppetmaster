'use strict';
var util = require('util');
var yeoman = require('yeoman-generator'),
	spawn = require('child_process').spawn;


var ServeGenerator = yeoman.generators.Base.extend({
	init: function() {
		// console.log('You called the serve subgenerator with the argument ' + this.name + '.');
	},

	serveBackend: function() {
		var p = spawn('node', ['app/app.js'], {
			cwd: this.destinationRoot() + '/projects/backend/'
		});

		p.stdout.on('data', function(data) {
			console.log('stdout: ' + data);
		});

		p.stderr.on('data', function(data) {
			console.log('stderr: ' + data);
		});

		p.on('close', function(code) {
			console.log('child process exited with code ' + code);
		});
	},

	serveFrontend: function() {
		var p = spawn('grunt', ['server'], {
			cwd: this.destinationRoot() + '/projects/frontend/'
		});

		p.stdout.on('data', function(data) {
			console.log('stdout: ' + data);
		});

		p.stderr.on('data', function(data) {
			console.log('stderr: ' + data);
		});

		p.on('close', function(code) {
			console.log('child process exited with code ' + code);
		});
	}
});

module.exports = ServeGenerator;