'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var PuppetmasterGenerator = yeoman.generators.Base.extend({
  init: function() {
    this.pkg = require('../package.json');

    this.on('end', function() {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  greet: function() {
    this.log(this.yeoman);
    this.log(chalk.magenta("Thank's for using the fantastic Puppetmaster generator. Have fun i uživaj!"));

    // TODO: ask for dependent projects and write them to package.json
  }
});

module.exports = PuppetmasterGenerator;