'use strict';
var path = require('path'),
  chalk = require('chalk'),
  _ = require('underscore');


var ConfigParser = _.extend({}, {
  _readJSONConfig: function(filename, namespace) {
    // TODO: error handling
    return JSON.parse(this.readFileAsString(filename));
  },

  _selectWorkspaces: function(config, predicates) {
    var res = [],
      allWorkspaces = config['workspaces'];

    if (predicates[0] === 'all') {
      return allWorkspaces;
    }

    for (var idx0 = 0; idx0 < this.workspaces.length; idx0++) {
      var name = predicates[idx0],
        cur_length = res.length;

      for (var idx = 0; idx < allWorkspaces.length; idx++) {
        var workspace = allWorkspaces[idx];
        if (workspace.id === name) {
          res.push(workspace);
          continue;
        }
      }

      if (cur_length === res.length) {
        this.log(chalk.red('Workspace "' + name + '" is not configured, skipping request.'));
      }
    }

    return res;
  },

  _mapOnWorkspaceProjects: function(cb) {
    var global_settings = this.config['globalSettings'] || {},
      workspaces = null;

    workspaces = this._selectWorkspaces(this.config, this.workspaces);

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

        cb(repo_endpoint, local_root, repo_name);
      }
    }
  }
});

module.exports = ConfigParser;