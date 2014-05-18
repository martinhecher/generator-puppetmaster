'use strict';
var _ = require('underscore'),
    path = require('path'),
    chalk = require('chalk'),
    yeoman = require('yeoman-generator'),
    ConfigParser = require('../core/config-parser');

/**
 * A 'SubGenerator' has builtin functionality to
 *   - handle a workspace given as argument
 *   - read the 'puppetmaster' and the generator config file.
 */
var SubGenerator = yeoman.generators.Base.extend({
    _initSubGenerator: function() {
        // console.log('[Puppetmaster::SubGenerator::_init] call');

        this.argument('workspaces', {
            type: Array,
            required: false
        });

        if (!this.workspaces) {
            this.workspaces = ['default'];
        }

        this._initConfigParser();
    },

    _initConfigParser: function() {
        // console.log('[Puppetmaster::SubGenerator::_initConfigParser] call');

        var filename = path.join(this.destinationRoot(), './package.json'),
            filename_generator = path.join(__dirname, '../package.json'),
            namespace = 'puppetmaster';

        this.pkg = this._readJSONConfig(filename, namespace);
        this.config = this.pkg[namespace];

        this.pkgGenerator = this._readJSONConfig(filename_generator, namespace);
    }
});

_.extend(SubGenerator.prototype, ConfigParser);

module.exports = SubGenerator;