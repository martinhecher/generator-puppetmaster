'use strict';
var path = require('path'),
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
    };

    return res;
  }
});

module.exports = ConfigParser;