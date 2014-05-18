'use strict';
var _ = require('underscore'),
    util = require('util'),
    path = require('path'),
    chalk = require('chalk'),
    yeoman = require('yeoman-generator'),
    spawn = require('child_process').spawn,
    gitutil = require('git-utils'),
    ConfigParser = require('../core/config-parser');


var FetchGenerator = yeoman.generators.Base.extend({
    init: function() {
        this.argument('workspaces', {
            type: Array,
            required: false
        });

        if (!this.workspaces) {
            this.workspaces = ['default'];
        }

        var filename = 'package.json',
            namespace = 'puppetmaster';
        this.defaultLocalRoot = 'projects';

        this.fetchedRepos = {};

        this._readConfig(filename, namespace);

        this.log(chalk.magenta('Using "generator-puppetmaster" version: v' + this.pkgPM.version));
        this.log(chalk.magenta('Jednu projektu, molim. I tri kugle sladoleda!'));
        this.log(chalk.magenta('Requesting workspaces: ' + JSON.stringify(this.workspaces)) + '\n');
    },

    fetch: function() {
        var global_settings = this.config['globalSettings'] || {},
            workspaces = null;

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

        workspaces = this._selectWorkspaces();

        for (var idx0 = 0; idx0 < workspaces.length; idx0++) {
            var workspace = workspaces[idx0],
                id = workspace.id || 'default',
                settings = workspace.settings || {},
                projects = workspace.projects;

            // TODO: error handling
            var local_root_dir = settings.localRoot || global_settings.localRoot || this.defaultLocalRoot;
            this.mkdir(local_root_dir);

            for (var idx = 0; idx < projects.length; idx++) {
                var project = projects[idx];

                // 'project' can be either a single string or an object which contains
                // additional info:
                // console.log('type: ' + (typeof project));

                var repo_name = null,
                    repo_endpoint = null,
                    local_root = settings.localRoot || global_settings.localRoot,
                    fresh_checkout = true;

                // TODO: support for other providers (factory/registry?)
                if (typeof project === 'string') {
                    // console.log('project: ' + project);
                    repo_name = project;
                } else if (typeof project === 'object') {
                    // console.log('project: ' + JSON.stringify(project));
                    repo_name = project.id;
                    local_root = project.localRoot || local_root;
                }

                repo_endpoint = project.url || (settings.defaultNamespace || global_settings.defaultNamespace) + '/' + repo_name;

                if (!this.fetchedRepos[repo_endpoint]) {
                    // First check if the repository already exists at the endpoint:
                    var repository = gitutil.open(path.join(local_root, repo_name));

                    if (repository) {
                        console.log('Repository "' + repo_name + '" already exists, leaving as is.');
                        fresh_checkout = false;
                        continue;
                    }

                    this.log(chalk.green('Fetching "' + repo_endpoint + '" into folder: "' + local_root + '/' + repo_name + '" ...'));

                    var git = spawn('git', ['clone', repo_endpoint, local_root + '/' + repo_name]);
                    this.fetchedRepos[repo_endpoint] = 'unnused';

                    // TODO: provide better stdout/stderr output interpretation!

                    // Yeah, thanks http://passy.svbtle.com/partial-application-in-javascript-using-bind ;-)
                    git.on('close', onGitClose.bind(this, repo_name));
                    // git.stdout.on('data', onGitOutput.bind(this, 'stdout'));
                    git.stderr.on('data', onGitOutput.bind(this, 'stderr'));
                }
            }

            if (!fresh_checkout) {
                this.log(chalk.green('\nTo update repositories that already existed use "yo puppetmaster:pull all" to fetch their latest revision.'));
            }
        }
    }
});

_.extend(FetchGenerator.prototype, ConfigParser);

module.exports = FetchGenerator;