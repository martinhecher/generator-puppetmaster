'use strict';
var util = require('util');
var yeoman = require('yeoman-generator'),
	chalk = require('chalk'),
	path = require('path'),
	_ = require('underscore');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var UimoduleGenerator = yeoman.generators.NamedBase.extend({
	init: function() {
		this.log(chalk.white('You called the "uimodule" subgenerator with the argument "' + this.name + '".'));
	},

	files: function() {
		var target_dir = path.join(this.destinationRoot(), '/app/modules/contrib/' + this.name.toLowerCase());
		this.mkdir(target_dir);
		this.log(chalk.green('Created ' + target_dir));

		this.log(chalk.green('Generating and copying template files:'));

		// FIXXME: normalize path!
		var tmpl_path = __dirname + '/templates/main.js',
			tmpl = this.readFileAsString(tmpl_path),
			context = {
				name: this.name,
				name_lowercase: this.name.toLowerCase(),
				type: 'Contrib'
			};

		// Render main.js:
		var rendered_tmpl = this.engine(tmpl, context);
		this.write(target_dir + '/main.js', rendered_tmpl);
		// console.log('rendered_tmpl: ' + rendered_tmpl);

		// Render template/mainview.js:
		tmpl_path = __dirname + '/templates/mainview.js';
		tmpl = this.readFileAsString(tmpl_path);
		rendered_tmpl = this.engine(tmpl, context);
		this.write(target_dir + '/mainview.js', rendered_tmpl);
		// console.log('rendered_tmpl: ' + rendered_tmpl);

		// Render template/main.hbs:
		tmpl_path = __dirname + '/templates/templates/main.hbs';
		tmpl = this.readFileAsString(tmpl_path);
		rendered_tmpl = this.engine(tmpl, context);
		this.write(target_dir + '/templates/main.hbs', rendered_tmpl);
		// console.log('rendered_tmpl: ' + rendered_tmpl);
	}
});

module.exports = UimoduleGenerator;