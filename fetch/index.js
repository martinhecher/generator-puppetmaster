'use strict';
var _ = require('underscore'),
    util = require('util'),
    path = require('path'),
    chalk = require('chalk'),
    spawn = require('child_process').spawn,
    gitutil = require('git-utils'),
    puppetmaster = require('../core/puppetmaster');

var FetchGenerator = puppetmaster.SubGenerator.extend({
    init: function() {
        // console.log('[Puppetmaster::FetchGenerator::init] call');

        // Calls the internal initialization of sub-generator funcitonality, including
        // * reading of config files
        // * handling of the 'workspace' argument
        // * etc.
        this._initSubGenerator();

        this.defaultLocalRoot = 'projects';
        this.fetchedRepos = {};
    },

    info: function() {
        this.log(chalk.gray('\nUsing "generator-puppetmaster" version: v' + this.pkgGenerator.version));
        this.log(chalk.magenta('\nJednu projektu, molim. I tri kugle sladoleda!'));
        this.log(chalk.magenta('Requesting workspaces: ' + JSON.stringify(this.workspaces)) + '\n');
    },

    fetch: function() {
        function onGitClose(reponame, code) {
            if (!code) {
                this.log(chalk.green('Fetched "' + reponame + '".'));
            } else {
                this.log(chalk.red('Something went wrong while fetching "' + reponame + '".'));
            }
        }

        function onGitOutput(type, data) {
            if (type === 'stdout') {
                this.log(chalk.white(data));
            } else if (type === 'stderr') {
                this.log(chalk.red(data));
            }
        }

        var virgin_checkout = true;

        this._mapOnWorkspaceProjects(function(repo_url, local_root, repo_name) {
            // console.log('fetching: ' + url + ' into ' + local_root + '/' + repo_name);

            // First check if the repository already exists at the endpoint:
            var repository = gitutil.open(path.join(local_root, repo_name));

            if (repository) {
                console.log('Repository "' + repo_name + '" already exists, leaving as is.');
                virgin_checkout = false;
                return;
            }

            this.log(chalk.green('Fetching "' + repo_url + '" into folder: "' + local_root + '/' + repo_name + '" ...'));

            var git = spawn('git', ['clone', repo_url, local_root + '/' + repo_name]);
            this.fetchedRepos[repo_url] = 'unnused';

            // TODO: provide better stdout/stderr output interpretation!

            // Yeah, thanks http://passy.svbtle.com/partial-application-in-javascript-using-bind ;-)
            git.on('close', onGitClose.bind(this, repo_name));
            // git.stdout.on('data', onGitOutput.bind(this, 'stdout'));
            git.stderr.on('data', onGitOutput.bind(this, 'stderr'));
        }.bind(this));

        if (!virgin_checkout) {
            this.log(chalk.green('\nTo update repositories that already existed use "yo puppetmaster:pull all" to fetch their latest revision.\n'));
        }
    }
});

// _.extend(FetchGenerator.prototype, ConfigParser);

module.exports = FetchGenerator;