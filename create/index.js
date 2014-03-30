'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');


var CreateGenerator = yeoman.generators.NamedBase.extend({
	init: function() {
		console.log('Jednu "konnector", molim. I tri kugle sladoleda!');
	},

	files: function() {
		var repos = [
			'training-material',
			'masterplan',
			'docs',
			'rest-jsapi-gui',
			'backend',
			'frontend',
			'homepage'
		]

		this.mkdir(this.name);

		for (var idx = 0; idx < repos.length; idx++) {
			var gitrepo = 'git@gitlab.com:konnektor/' + repos[idx] + '.git',
				spawn = require('child_process').spawn,
				ls = spawn('git', ['clone', gitrepo, this.name + '/' + repos[idx]]);

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
	}
});

module.exports = CreateGenerator;