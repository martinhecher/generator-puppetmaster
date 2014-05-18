# generator-puppetmaster

This [Yeoman](http://yeoman.io) generator is a tool that manages software projects existing of multiple sub-projects. The idea is to have all sub-projects stored in (currently git-base) repositories and to have one project that is the 'parent' project, holding together the sub-projects. The parent project holds a configuration file ('package.json') that describes which sub-projects contribute to the whole project and how they are configured (e.g. name, repository location). 

Sub-projects can be separated into so called 'workspaces'. This allows for a flexible management of projects in a team, where there are different responsibilities within the team. For instance, if you project consists of a data backend server and a web-based frontend there could be two workspaces called 'backend' and 'frontend', containing different sub-projects each. The database developers only need to cope with the  'backend' workspace, the frontend developers will work with the 'frontend' workspace. This separation allows for a clean separation between responsibilities in the project.

The current version of 'puppetmaster' takes care of 

* fetching and
* updating

git-based workspaces (see below for concrete examples). In future versions 'puppetmaster' will be capable of

* generating a single release out of all sub-projects,
* easy creation (via the command line) of new projects on different platforms (e.g. github, gitlab, etc.)
* integrating custom task that you need for your workflow (e.g. resetting a database, deploy to heroku, etc.)

If you have ideas for useful operations 'puppetmaster' should support, feel free to open an issue or fork the repository and implement a new feature. It's really easy, have a look at [Yeoman Generator Documentation] (http://yeoman.io/generators.html).

## Installation

To setup 'puppetmaster' you need to have a working installation of 'Yeoman'. Have a look at the [installation instructions and dependencies here] (https://github.com/yeoman/yeoman/wiki/Getting-Started).

After that it's quite simple, type

> yo install -g generator-puppetmaster

to install the generator.

## Example Usage

### Creating a new project

Create a new 'parent' folder and execute

> npm init

within that folder. This will create a 'package.json' file in the folder with the provided information. We will use this 'package.json' file to configure our 'multi-workspace' environment. Open the file and add a section 'puppetmaster' to it. Within this section we add our first workspace (for more information on workspaces see the following sections). Your result will look very similar to this content, which is a fully working project named 'my-puppetmaster-project' with two sub-projects 'generator-puppetmaster' and 'tomato':

```json
{
    "name": "my-puppetmaster-project",
    "version": "0.1.0",
    "description": "Project description",
    "main": "index.js",
    "devDependencies": {},
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "repository": {
        "type": "git",
        "url": "git@github.com:myname/mytestproject.git"
    },
    "author": "Martin Hecher",
    "license": "MIT",
    "puppetmaster": {
        "globalSettings": {
            "localRoot": "projects"
        },
        "workspaces": [{
            "id": "default",
            "settings": {
                "defaultNamespace": "git@github.com:martinhecher"
            },
            "projects": [
                "generator-puppetmaster",
                "tomato"
            ]
        }]
    }
}
```

With this configuration in place you can do a

> yo puppetmaster:fetch

inside the project folder and it will create the folder 'projects' and clone the two repositories

* git@github.com:martinhecher/generator-puppetmaster and
* git@github.com:martinhecher/tomato

into the 'projects' folder.

### Configuration options

All the configuration takes place below the 'puppetmaster' property of your 'package.json' file. This section describes the two possible configuration groups currently available: 'globalSettings' and 'workspaces'.

#### globalSettings

Here you can configure the project globally and set some sane defaults. Currently supported are:

"localRoot": the folder into which the sub-projects will get cloned into. If the folder does not exist it will be created.

#### workspaces

For projects with multiple developers it turned out to be helpful to provide so called 'workspaces'. With this feature each developer can customize her own 'workspace', consisting of a sub-set of the sub-projects that are making up the whole project. There should be one 'workspace' configuration that has the id 'default', because this workspace will be used when you type

> yo puppetmaster:fetch

on the commandline. You can provide one or more names of the workspace(s) you want to fetch, e.g.:

> you puppetmaster:fetch main testing

will fetch the 'main' workspace and the 'testing' workspace, if available in the configuration. If not, an error message is given. Specifying no workspace configuration on the command line automatically selects the 'default' configuration.

The 'package.json' example in the 'Creating a new project' section is one supported format of how to configure 'puppetmaster'. Under the hood the workspace configuration is more flexible, to (hopefully) catch many use cases of today's webdevelopment. The configuration below shows a more elaborated example on how to configure a project:

```json
{ "workspaces": [{
        "id": "default",
        "settings": {
            "defaultNamespace": "git@myserver.com:martin.hecher",
            "localRoot": "projects"
        },
        "projects": [
            "app-standalone",
            "app-framework"
        ]
    }, {
        "id": "myfeature",
        "settings": {
            "localRoot": "projects/myfeature"
        },
        "projects": [{
            "id": "app-standalone",
            "url": "git@myserver.com:martinhecher/app-standalone.git"
        },{
            "id": "app-framework",
            "url": "git@myserver.com:martinhecher/app-framework.git"
        }]
    }, {
        "id": "external-libs",
        "projects": [{
            "id": "generator-puppetmaster",
            "url": "git@github.com:martinhecher/generator-puppetmaster.git",
            "localRoot": "external-libs"
        }]
    }]
}
```

The above example uses the most general form of a sub-project configuration in the 'myfeature' and the 'external-libs' workspace:

```json
{
    "id": "external-libs",
    "projects": [{
        "id": "generator-puppetmaster",
        "url": "git@github.com:martinhecher/generator-puppetmaster.git",
        "localRoot": "external-libs"
    }]
}
```

Here the 'projects' array consists of objects, each with an 'id', 'url', and 'localRoot' property. In the 'default' workspace configuration those options are automatically derived from the 'settings' object, in the 'external-libs' workspace those options are explicitly given. Local configuration overrides global configuration.

### Updating workspaces

Since v0.4.0 'puppetmaster' can update workspace projects (if they are git-based). To update a specific workspace simply type

> yo puppetmaster:pull _workspace_id_

For each project in the workspace a

> git pull

will be triggered.

The workspace selection for updating works the same as for fetching projects:

> yo puppetmaster:pull

with no workspace name given will update the 'default' workspace.

> yo puppetmaster:pull all

will update all configured workspaces.

## License

MIT
