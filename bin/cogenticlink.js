#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { setupLibrariesCommand } from '../src/commands/libraries.js';
import { categoriesCommand } from '../src/commands/categories.js';
import { listCommand } from '../src/commands/list.js';
import { describeCommand } from '../src/commands/describe.js';
import { callCommand } from '../src/commands/call.js';

program
  .name('cogenticlink')
  .description('CLI for CogenticLab Tool Library API')
  .version('1.0.0');

setupLibrariesCommand(program);
categoriesCommand(program);
listCommand(program);
describeCommand(program);
callCommand(program);

program.parse();