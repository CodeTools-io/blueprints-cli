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

Generate files in your desired folder:

```bash
bp generate ExampleBlueprint MyInstance
```

## Commands

- `generate|g [options] <blueprint> <blueprintInstance>`: Generate files from a blueprint.
- `list|ls [namespace]`: List all available blueprints.
- `new [options] <blueprint>`: Create a new blueprint.
- `import <globalBlueprint> [localBlueprint]`: Create a local blueprint from a global one.
- `init [projectPath]`: Initialize a local blueprints project.
- `remove|rm [options] <blueprint>`: Remove a blueprint.
- `help [command]`: Display help for a command.

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
