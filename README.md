# generator-puppetmaster

This [Yeoman](http://yeoman.io) generator is a helper tool that manages development projects that are build up on multiple sub-projects which are stored somewhere on the web (e.g. github, gitlab, subversion server, etc.). 'puppetmaster' takes care of 

* fetching, 
* updating,
* etc.

of all sub-projects via the Yeoman generator interface (see below for concrete examples). Moreover, 'puppetmaster' is (or will be, depending on the feature) capable of

* generating a single release out of all sub-projects,
* easy creation (via the command line) of new projects on different platforms (e.g. github, gitlab, etc.)
* integrating custom task that you need for your workflow.

The 'puppetmaster' generator is configured via the 'package.json' file of a project.

NOTE: The current version (v0.3.0) supports the 'fetch' operation for 'git' based repositories. The project is constantly improving, though, as I actively use it to manage my web-development projects.

If you have ideas for useful operations 'puppetmaster' should support, feel free to open an issue or fork the repository and implement a new feature. It's really easy, have a look at [Yeoman Generator Documentation] (http://yeoman.io/generators.html).

## Installation

To setup 'puppetmaster' you need to have a working installation of 'Yeoman'. Have a look at the [installation instructions and dependencies here] (https://github.com/yeoman/yeoman/wiki/Getting-Started).

After that it's quite simple, type

> yo install -g generator-puppetmaster

to install the generator.

## Example Usage

### Creating a new project

Create a new folder and execute

> npm init

within that folder. This will create a 'package.json' file in the folder with the provided information. We will use this 'package.json' file to configure our 'multi-project' environment. Open the file and add a section 'puppetmaster' to it. Within this section we add our first so called 'workspace' (for more information on workspaces see the following sections). Your result will look very similar to this content, which is a fully working project named 'my-puppetmaster-project' with two sub-projects 'generator-puppetmaster' and 'tomato':

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
            "url": "git@myserver.com:martinhecher/app-standalone.git"
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

## License

MIT
