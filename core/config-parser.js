'use strict';
var path = require('path'),
  _ = require('underscore');


var ConfigParser = _.extend({}, {
  _readJSONConfig: function(filename, namespace) {
    // TODO: error handling
    return JSON.parse(this.readFileAsString(filename));
  },

  _selectWorkspaces: function() {
    var res = [];

    if (this.workspaces[0] === 'all') {
      return this.config['workspaces'];
    }

    for (var idx0 = 0; idx0 < this.workspaces.length; idx0++) {
      var name = this.workspaces[idx0],
        cur_length = res.length;

      for (var idx = 0; idx < this.config['workspaces'].length; idx++) {
        var workspace = this.config['workspaces'][idx];
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