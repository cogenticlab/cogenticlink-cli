# Cogentic CLI

CLI for interacting with CogenticLab Tool Library API.

## Setup

Manage named libraries (API tokens):

```bash
# Set a library (two equivalent forms)
cogentic libraries set myhub=abc123 "My Cogentic Hub"
cogentic libraries set myhub abc123 "My Cogentic Hub"

# Set as default
cogentic libraries default myhub

# List libraries
cogentic libraries list
```

## Commands

### Library Management

```bash
cogentic libraries set <name=token> [description]
cogentic libraries get [name]
cogentic libraries remove <name>
cogentic libraries list
cogentic libraries default [name]
```

### Tool Operations

All tool commands accept --library <name> to use a specific library; otherwise the default library is used.

```bash
# List categories
cogentic categories [--library myhub]

# List tools
cogentic list [category] [--library myhub]

# Describe a tool
cogentic describe <tool> [--library myhub]

# Call a tool
cogentic call <tool> --params '{"key":"value"}' [--library myhub]
```

### Examples

```bash
# Set up library
cogentic libraries set prod=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 "Production hub"
cogentic libraries default prod

# Use tools
cogentic categories
cogentic list "Database"
cogentic describe sql_query
cogentic call sql_query --params '{"query":"SELECT * FROM users"}'

# Use another library temporarily
cogentic categories --library staging
```
