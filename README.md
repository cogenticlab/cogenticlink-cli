# cogenticlink

CLI for interacting with the [CogenticLab Tool Library API](https://link.cogenticlab.io).

Progressive disclosure is achieved through the hierarchy of Tool Library → Tool Category → Tool.

Manage named Tool libraries, browse available tools, and execute tool calls – all from the command line.

[![npm version](https://img.shields.io/npm/v/cogenticlink.svg)](https://www.npmjs.com/package/cogenticlink)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔐 **Library management** – store multiple API tokens with optional descriptions.
- 📁 **Browse categories** – list all tool categories for a library.
- 🔧 **List tools** – see available tools and their tags in a category.
- 📖 **Describe tool** – view description and input schema (JSON) for any tool.
- ⚡ **Call tool** – execute tools with JSON parameters.
- 🧩 **No default library** – always specify which library to use, no ambiguity.

## Installation

### Global install (recommended for frequent use)
```bash
npm install -g cogenticlink
```

### Run with npx (no installation)
```bash
npx cogenticlink <command>
```

### Configuration

Libraries are stored in ~/.cogenticlab/link/config.json:
```json
{
  "libraries": {
    "myhub": {
      "token": "your-api-token",
      "description": "My Cogentic Hub"
    }
  }
}
```
You manage libraries with the cogenticlink libraries subcommands – no manual file editing needed.

## Commands

### Library Management

| Command                                                   | Description                                |
|-----------------------------------------------------------|--------------------------------------------|
| cogenticlink libraries                                    | List all libraries (markdown format)       |
| `cogenticlink libraries set <name> <token> [description]` | Add or update a library                    |
| `cogenticlink libraries get <name>`                       | 	Show token and description for a library  |
| `cogenticlink libraries remove <name>`                    | Delete a library                           |
| `cogenticlink libraries list`                               | Plain‑text list of libraries (alternative) |

### Tool Operations (all require `<library>` as first argument)

| Command                                             | Description                                                        |
|-----------------------------------------------------|--------------------------------------------------------------------|
| `cogenticlink categories <library>`                | Fetch all tool categories (JSON)                                   |
| `cogenticlink tools <library> <category>`          | List tools in a category (default: All Tools). Output is Markdown. |
| `cogenticlink describe <library> <tool>`            | Show tool description and input schema (Markdown)                  |
| `cogenticlink call <library> <tool> [parameters]` | Execute tool with optional JSON parameters (default {})            |

### Examples

1. Add a library
```bash
cogenticlink libraries set prod eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 "Production hub"
```
2. List libraries
```bash
cogenticlink libraries
```
Output:
```markdown
# Tool Libraries
- prod: Production hub
- staging
```
3. See tool categories
```bash
cogenticlink categories prod
```
4. List tools in a category
```bash
cogenticlink tools prod "Database Tools"
```
5. Describe a tool
```bash
cogenticlink describe prod sql_query
```
6. Call a tool (with parameters)
```bash
cogenticlink call prod sql_query '{"query":"SELECT * FROM users"}'
```

## Help

### Display general help:
```bash
cogenticlink --help
```
### Help for a specific command:
```bash
cogenticlink help libraries set
cogenticlink help call
```

## Requirements
- Node.js 18 or higher
- An API token from Cogentic Hub

## Troubleshooting

| Problem                    | Solution                                                                |
|----------------------------|-------------------------------------------------------------------------|
| Library not found          | Run `cogenticlink libraries` to see existing names.                     |
| Invalid token              | Re‑set the library with the correct token.                              |
| Tool not found             | Use `cogenticlink tools <library>` to verify the tool name.            |
| Invalid JSON in parameters | Ensure parameters are valid JSON (use single quotes around the string). |

## License

MIT