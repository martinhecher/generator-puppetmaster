'use strict';
var puppetmaster = require('../core/puppetmaster'),
	spawn = require('child_process').spawn,
	chalk = require('chalk'),
	path = require('path');


var PullGenerator = puppetmaster.SubGenerator.extend({
	init: function() {
		this._initSubGenerator();
	},

	pull: function() {
		function onGitClose(reponame, code) {
			if (!code) {
				this.log(chalk.green('Pulled "' + reponame + '".'));
			} else {
				this.log(chalk.red('Something went wrong while pulling "' + reponame + '".'));
			}
		}

		function onGitOutput(type, data) {
			if (type === 'stdout') {
				this.log(chalk.white(data));
			} else if (type === 'stderr') {
				this.log(chalk.red(data));
			}
		}

		this.log(chalk.magenta('Processing repositories:'));

		this._mapOnWorkspaceProjects(function(repo_url, local_root, repo_name) {
			// console.log('pull: ' + repo_url + ' into ' + local_root + '/' + repo_name);

			var cur_dir = process.cwd(),
				repo_dir = path.join(this.destinationRoot(), local_root, repo_name);

			// CAUTION: 'destinationRoot()' is not shielded against process.chdir()!
			process.chdir(repo_dir);
			var git = spawn('git', ['pull']);
			process.chdir(cur_dir);

			git.on('close', onGitClose.bind(this, repo_name));
			git.stderr.on('data', onGitOutput.bind(this, 'stderr'));
		}.bind(this));
	}
});

module.exports = PullGenerator;