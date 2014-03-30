'use strict';
var util = require('util');
var path = require('path');
var chalk = require('chalk');
var yeoman = require('yeoman-generator');


var FetchGenerator = yeoman.generators.NamedBase.extend({
	init: function() {
		if (typeof this.name === 'undefined') {
			console.log('You have not specified a configuration, proceeding with "all"');
			this.name = 'all';
		}

		// TODO: error handling
		this.pkg = require(path.join(this.destinationRoot(), 'package.json'));

		this.log(chalk.magenta('Jednu "konnector:' + this.name + '", molim. I tri kugle sladoleda!'));
	},

	fetchRepos: function() {
		var repos = this.pkg.projects.repos,
			path = this.pkg.projects.path;

		// TODO: error handling
		this.mkdir(path);

		function onGitClose(reponame, code) {
			if (!code) {
				this.log(chalk.green('Fetched "' + reponame + '".'));
			} else {
				this.log(chalk.red('Something went wrong while fetching "' + reponame + '".'));
			}
		}

		for (var idx = 0; idx < repos.length; idx++) {
			// TODO: support for other providers (factory/registry?)
			var repo_name = repos[idx],
				gitrepo = 'git@gitlab.com:konnektor/' + repo_name + '.git',
				spawn = require('child_process').spawn,
				git = spawn('git', ['clone', gitrepo, path + '/' + repos[idx]]);

			// Yeah, thanks http://passy.svbtle.com/partial-application-in-javascript-using-bind ;-)
			git.on('close', onGitClose.bind(this, repo_name));

			// git.stdout.on('data', function(data) {
			// 	this.log(chalk.green('Fetched "' + repo_name + '".'));
			// }.bind(this));

			// git.stderr.on('data', function(data) {
			// 	this.log(chalk.red('Something went wrong while fetching "' + repo_name + '".'));
			// }.bind(this));
		}
	}
});

module.exports = FetchGenerator;