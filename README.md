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
| `generate\|g <blueprint> <blueprintInstance>` | Generate files from a blueprint. | `-d, --dest <destination>`: Specify the directory for the files.<br>`<args>`: Additional arguments for template data and metadata. |
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

### Template Data

Template data, passed as key-value pairs during the `generate` command, customizes the content of the generated files by replacing specific placeholders in the blueprint files.

### Metadata

Metadata, derived from the blueprint instance name, automatically formats these placeholders to adhere to various naming conventions, ensuring consistency across the generated files.

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

## Basic Example: Creating Project Status Reports

### Scenario

You're regularly creating status reports for different projects. Each report should be friendly and informative, including the project's name, its status, and the report's date.

### End Result

A report at `./ProjectAlpha/2023-12-08-Report.txt`, containing:

```plaintext
Hello Team!

Here's the latest update on Project Alpha:
- Status as of now: On Track
- Report Date: 2023-12-08

Keep the momentum going!
```

### Step 1: Creating the Blueprint

First, we create the blueprint:

```bash
bp new -g statusReportBlueprint
```

Now we have a blueprint created at `~/.blueprints/statusReportBlueprint`

### Step 2: Defining the Blueprint's Templates
- Create a file at `~/.blueprints/statusReportBlueprint/files/__blueprintInstance__/__date__-Report.txt`
- File Content (`__date__-Report.txt`):
  ```plaintext
  Hello Team!

  Here's the latest update on {{projectName}}:
  - Status as of now: {{status}}
  - Report Date: {{date}}

  Keep the momentum going!
  ```

### Step 3: Generating the Report

To create a report for "Project Alpha" on a specific date, we run:

```bash
bp generate statusReportBlueprint ProjectAlpha projectName="Project Alpha" status="On Track" date=2023-12-08
```

Here's what happens:

- The command interprets `ProjectAlpha` and `2023-12-08` to dynamically create:
  - A filename: `ProjectAlpha/2023-12-08-Report.txt`.
  - A report content that warmly addresses "Project Alpha" and mentions the specific date.
- The `status` value is also seamlessly integrated into the report, completing the picture.

The result is a customized, friendly status report.
