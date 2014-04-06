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

    this.pkg = require(path.join(this.destinationRoot(), 'package.json'));
    // console.log(JSON.stringify(this.pkg, null, 4));
  },

  greet: function() {
    this.log(this.yeoman);
    this.log(chalk.magenta("Thank's for using the fantastic 'Puppetmaster' generator. Dobar tek i uživaj!"));
  },

  checkConfig: function() {
    var cb = this.async();

    var prompts = [];

    if (typeof this.pkg.projects !== 'undefined' &&
      this.pkg.projects.repos.length) {
      prompts.push({
        type: 'confirm',
        name: 'fetchProjects',
        message: 'We found a configured environment, do you want to fetch the projects?',
        default: true
      });
    }

    this.prompt(prompts, function(props) {
      this.fetchProjects = props.fetchProjects;

      cb();
    }.bind(this));
  },

  fetchProjects: function() {
    if (this.fetchProjects) {
      this.log(chalk.magenta("Let's install those projects now!"));

      this.invoke("puppetmaster:fetch", {
        args: ['all'],
        options: {
          nested: true,
          appName: this.appName
        }
      });
    }
  }
});

module.exports = PuppetmasterGenerator;