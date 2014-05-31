define([
    'backbone.marionette',
    'workbenchui',
    'core/uimodulebase',
    './mainview.js'
], function(Marionette, WorkbenchUI, UIModuleBase, MainView) {

    WorkbenchUI.module('<%= type %>.<%= name %>', UIModuleBase);

    var MyModule = WorkbenchUI.module("<%= type %>.<%= name %>");

    WorkbenchUI.addInitializer(function() {
        // 1. Register module with the ModuleManager:
        WorkbenchUI.execute('module:register', '<%= type %>.<%= name %>');

        // 2. Register eventhandler to show the view:
        WorkbenchUI.vent.on('module:<%= name_lowercase%>:show', function(region) {
            console.log('module:<%= name_lowercase%>:show');

            if (!MyModule._mainView) {
                MyModule._mainView = new MainView();
            }

            if (typeof region !== 'undefined') {
                region.show(MyModule._mainView);
            } else {
                this.mainRegion.show(MyModule._mainView);
            }
        }.bind(this));

        console.log('[WorkbenchUI.<%= type %>.<%= name %>] started');
    });

    // TODO: not working with this version of Marionette...
    // MyModule.addFinalizer(function() {
    //     WorkbenchUI.mainRegion.close();

    //     console.log('[WorkbenchUI.<%= type %>.<%= name %>] stopped');
    // });

    // NOTE: No explicit return value is given here vor the AMD module. The module
    // is registered with the Marionette.Application and accessible via its
    // WorkbenchUI.module('...') syntax.
});