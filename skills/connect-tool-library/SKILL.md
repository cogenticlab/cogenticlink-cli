---
name: connect-tool-library
description: Interact with remote tool libraries cogenticlink CLI. Use this skill when you need to manage API libraries (tokens), browse available tools, and execute tool calls.
metadata:
  openclaw:
    requires:
      bins:
        - cogenticlink
      config:
        - ~/.cogenticlab/config.json
---

# Connect Tool Library Skill (via cogenticlink CLI)

## Prerequisites

- Install the `cogenticlink` CLI globally: `npm install -g cogenticlink-cli` or run via `npx cogenticlink-cli` (the skill will use the command as available).
- The CLI stores library tokens in `~/.cogenticlab/config.json` in JSON format:
  ```json
  {
    "libraries": {
      "library_name": {
        "token": "actual_token_string",
        "description": "optional description"
      }
    }
  }
  ```

## Managing API Libraries (Tokens)

Before using any tool, you must add a library (API token) using the cogenticlink CLI:

1. Set a library (name, token, optional description)
```bash
cogenticlink libraries set <name> <token> [description]
```
Example:
```bash
cogenticlink libraries set myhub abc123 "My Cogentic Hub"
```

2. List all libraries (markdown output)
```bash
cogenticlink libraries
```

3.  Remove a library
```bash
cogenticlink libraries remove <name>
```

## Executing Tool Calls

All tool commands require the library name as a positional argument.

1. Fetch Tool Categories

```bash
cogenticlink categories <library>
```
Returns a list of categories.

2. Fetch Tool List

```bash
cogenticlink list <library> [category]
```

If category is omitted, defaults to All Tools.
Returns Markdown with format:

```markdown
# Available Tools
- tool_name: tag
## Tags
- tag: tag_description
```

3. Obtain Tool Description & Input Schema

```bash
cogenticlink describe <library> <tool>
```

Returns Markdown containing the tool's description and JSON schema for parameters.

4. Call a Tool

```bash
cogenticlink call <library> <tool> [parameters]
```
parameters is an optional JSON string (default "{}").Example: 
```bash
cogenticlink call myhub sql_query '{"query":"SELECT * FROM users"}'
```
Response is JSON; check for isError: true in error cases.

## Workflow for the Agent

1. Check/Create Library – If no library exists, instruct the user to set one:
```bash
cogenticlink libraries set <name> <token> [description]
```
(If the token is unknown, ask the user to create a tool library in Cogentic Hub. Download and install Cogentic Hub first (https://github.com/cogenticlab/cogentichub/)`)

2. Fetch Tool Categories – Run cogenticlink categories <library> to see available categories. If none selected, use All Tools.
3. Fetch Tool List – Run cogenticlink list <library> [category] to see tools and their tags.
4. Obtain Tool Description (optional) – Run cogenticlink describe <library> <tool> to understand required parameters.
5. Call Tool – Run cogenticlink call <library> <tool> '<json-params>' to execute.

## Response Handling
Successful responses return JSON with a content array.
Errors return isError: true with details in content.

## Troubleshooting with the CLI
1. Library not found – Run cogenticlink libraries to list existing libraries.
2. Invalid token – Re‑set the library with the correct token.
3. Tool not found – Verify the tool name using cogenticlink list <library>.
4. Invalid parameters – Check the tool's input schema with cogenticlink describe <library> <tool>.
