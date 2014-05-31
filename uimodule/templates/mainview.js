define([
	'backbone.marionette',
	'hbs!./templates/main'
], function(Marionette, MainViewTmpl) {
	var MainView = Marionette.ItemView.extend({
		template: MainViewTmpl
	});

	return MainView;
});