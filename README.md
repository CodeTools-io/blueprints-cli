# blueprints-cli

**(work in progress. api, features, and conventions are likely to change)**

**(docs not complete)**

blueprints-cli is a tool for generating files (blueprint instances) based on templates (blueprints). One common usage for this tool is generating files for development environments (ex. components, applications, containers, configurations, etc.)

The goals of the project are to allow for automation with simplicity, flexibility, and extensibility in mind.

## Installation

`npm install -g @cliffpyles/blueprints-cli`

or

`yarn global add @cliffpyles/blueprints-cli`

## Quick Start

**Create a blueprint**
`bp new -g ExampleBlueprint`

**Configure the blueprint**
Place files you want to reuse in `~/.blueprints/ExampleBlueprint/files/`

**Use the blueprint**
Go to desired project folder and run `bp generate ExampleBlueprint MyInstance`

## Commands

`generate|g [options] <blueprint> <blueprintInstance>` Generate files with a blueprint

`list|ls [namespace]` List all available blueprints

`new [options] <blueprint>` Create a generic blueprint

`import <globalBlueprint> [localBlueprint]` Create a project blueprint based on a global blueprint

`init [options] [blueprint]` Create blueprint with contents of current directory

`remove|rm [options] <blueprint>` Removes a blueprint

`help [command]` display help for command

## How it Works

Blueprints use the same global and local concept as node modules. To modify your global blueprints go to `~/.blueprints`. To modify your project blueprints go to `your/project/path/.blueprints`.

When generating blueprint instances, the tool will first look in your project blueprints. If a project blueprint isn't found, the tool will look in your global blueprints.

```
blueprint.json - An optional file for modifying the behavior and setting default blueprint data
files/ - Location of files that will be copied when blueprint instances are generated.
```
