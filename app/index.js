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

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
  },

  greet: function() {
    this.log(this.yeoman);
    this.log(chalk.magenta("Thank's for using the fantastic 'Puppetmaster' generator. Dobar tek i uživaj!"));
  },

  askFor: function() {
    var cb = this.async();

    // TODO: ask for dependent projects and write them to puppetmaster.json/package.json
    var prompts = [{
      name: 'blogName',
      message: 'What do you want to call your blog?'
    }];

    this.prompt(prompts, function(props) {
      // `props` is an object passed in containing the response values, named in
      // accordance with the `name` property from your prompt object. So, for us:
      this.blogName = props.blogName;

      cb();
    }.bind(this));
  }
});

module.exports = PuppetmasterGenerator;