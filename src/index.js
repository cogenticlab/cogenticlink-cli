export {
  setLibrary,
  removeLibrary,
  listLibraries,
  getLibraryToken,
} from './libraries.js';

export { fetchCategories, fetchTools, fetchToolDescription, callTool } from './api.js';

import { program } from 'commander';
import { setupLibrariesCommand } from './commands/libraries.js';
import { categoriesCommand } from './commands/categories.js';
import { listCommand } from './commands/list.js';
import { describeCommand } from './commands/describe.js';
import { callCommand } from './commands/call.js';

export function runCli() {
  setupLibrariesCommand(program);
  categoriesCommand(program);
  listCommand(program);
  describeCommand(program);
  callCommand(program);
  program.parse();
}