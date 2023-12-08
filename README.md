# blueprints-cli

**Disclaimer: Work in progress. Use at your own risk. API, features, and conventions are subject to change.**

**Note: Documentation is incomplete.**

## Overview

blueprints-cli is a tool for generating files from templates, referred to as 'blueprints'. It's commonly used in development environments for creating components, applications, containers, and configurations. The tool aims to automate file creation, focusing on simplicity, flexibility, and extensibility.

## Installation

Install blueprints-cli using npm:

```bash
npm install -g @codetools/blueprints-cli
```

Or, using yarn:

```bash
yarn global add @codetools/blueprints-cli
```

## Quick Start

### 1. Create a Blueprint

Create a new blueprint:

```bash
bp new -g ExampleBlueprint
```

### 2. Configure the Blueprint

Add files for reuse to your blueprint:

```
~/.blueprints/ExampleBlueprint/files/
```

### 3. Use the Blueprint

Generate files in your desired directory:

```bash
bp generate <blueprintName> <blueprintInstanceName>
```

## Commands

Below is a table outlining the available commands, their descriptions, and options:

| Command | Description | Options |
| ------- | ----------- | ------- |
| `generate\|g <blueprint> <blueprintInstance>` | Generate files from a blueprint. | `-d, --dest <destination>`: Specify the directory for the files. |
| `help [command]` | Display help for a command. | None |
| `import <globalBlueprint> [localBlueprint]` | Import a global blueprint to a local project. | None |
| `init [projectPath]` | Initialize a local blueprints project. | None |
| `list\|ls [namespace]` | List all available blueprints. | `-l, --long`: Show more details about each blueprint. |
| `new <blueprint>` | Create a new blueprint. | `-g, --global`: Create the blueprint globally. <br> `-s, --source [sourcePath]`: Specify an initial source path for blueprint files. |
| `remove\|rm <blueprint>` | Remove a blueprint. | `-g, --global`: Remove a global blueprint. |

## How it Works

### Global and Local Blueprints

- Global blueprints are stored in `~/.blueprints`.
- Local project blueprints are stored in `your/project/path/.blueprints`.

A blueprint is a directory under a `.blueprints` directory. It can be used to generate a 'blueprint instance'.

### Generating a Blueprint Instance

Generate an instance by running:

```bash
bp generate <blueprintName> <blueprintInstanceName>
```

The tool searches for the blueprint in the current and parent directories up to the home directory. It uses the first blueprint it finds unless directed to use a global blueprint.

### Blueprint Structure

```
├── blueprint.json
├── files/
├── hooks.js
```

#### blueprint.json

This file at the blueprint root allows for configuration.

##### Properties

- `description`: Describes the blueprint for `bp list`.
- `data`: Default data for generating an instance. These can be overridden during generation.

#### files/

Contains files and directories copied during instance generation.

#### hooks.js

A Node module exporting functions executed during instance generation.
