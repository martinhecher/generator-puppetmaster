'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var FetchGenerator = yeoman.generators.NamedBase.extend({
	init: function() {
		console.log('You called the fetch subgenerator with the argument ' + this.name + '.');
	},

	files: function() {
		var spawn = require('child_process').spawn,
			ls = spawn('git', ['clone', 'git@github.com:martinhecher/' + this.name + '.git', '../' + this.name]);

		ls.stdout.on('data', function(data) {
			console.log('stdout: ' + data);
		});

		ls.stderr.on('data', function(data) {
			console.log('stderr: ' + data);
		});

		ls.on('close', function(code) {
			console.log('child process exited with code ' + code);
		});
	}
});

module.exports = FetchGenerator;