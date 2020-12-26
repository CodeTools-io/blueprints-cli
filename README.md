# blueprints-cli

**(work in progress. api, features, and conventions are likely to change)**

**(docs not complete)**

blueprints-cli is a tool for generating files (i.e. blueprint instances) based on templates (i.e. blueprints). One common usage for this tool is generating files for development environments (ex. components, applications, containers, configurations, etc.)

The goal of the project is the automation of file creation, with simplicity, flexibility, and extensibility in mind.

## Installation

`npm install -g @cliffpyles/blueprints-cli`

or

`yarn global add @cliffpyles/blueprints-cli`

## Quick Start

**1) Create a blueprint**

`bp new -g ExampleBlueprint`

**2) Configure the blueprint**

Place files you want to reuse in `~/.blueprints/ExampleBlueprint/files/`

**3) Use the blueprint**

Go to the desired folder and run `bp generate ExampleBlueprint MyInstance`

## Commands

`generate|g [options] <blueprint> <blueprintInstance>` Generate files with a blueprint

`list|ls [namespace]` List all available blueprints

`new [options] <blueprint>` Create a blueprint

`import <globalBlueprint> [localBlueprint]` Create a project blueprint based on a global blueprint

`init [projectPath]` Initialize a local blueprints project

`remove|rm [options] <blueprint>` Remove a blueprint

`help [command]` display help for command

## How it Works

blueprint-cli uses the concept of global and local blueprints. To modify your global blueprints go to `~/.blueprints`. To modify your project blueprints go to `your/project/path/.blueprints`. A blueprint is by definition a directory that is a descendant of a `.blueprints` directory. You can use a blueprint to generate a blueprint instance.

### Generating a Blueprint Instance

You can use a blueprint to create a blueprint instance. This creation is referred to as generating a blueprint instance.

You can think of generating a blueprint instance, as copying and pasting a directory, followed by some optional file and directory modifications. The directory you copy is the blueprint, the directory created when you paste is the blueprint instance.

You generate a blueprint instance by running: `bp generate <blueprintName> <blueprintInstanceName>`

When generating blueprint instances, the tool will look for the blueprint in your current directory first, and then it will look in every parent directory, until it reaches your home directory. It will use the first blueprint it finds, unless you expicitly tell it to use the global blueprint (the blueprint in the home directory).

### Blueprint Structure

```
├── blueprint.json
├── files/
├── hooks.js
```

#### blueprint.json

A file placed at the root of a blueprint. The contents of the this file allow for further configuration of a blueprint.

##### Properties

`description` - A description of the blueprint. Used to describe what the blueprint is when you run `bp list`

`data` - Default data values that will be used when generating a blueprint instance. The data can be used to rename files and directories, or to replace file contents. These values can be overwritten by specifying the values when the `generate` command is run.

#### files/

A directory containing the files and directories that will be copied during blueprint instance generation.

#### hooks.js

A node module that exports various functions that are executed during blueprint instance generation.
