import chalk from 'chalk';
import { fetchTools } from '../api.js';
import { getTokenForLibrary } from '../libraries.js';

export function listCommand(program) {
  program
    .command('list [category]')
    .description('List tools in a category (default: All Tools)')
    .option('-l, --library <name>', 'Use a specific library (defaults to default library)')
    .action(async (category = 'All Tools', options) => {
      const token = await getTokenForLibrary(options.library);
      if (!token) {
        console.error(chalk.red('Error: No API token available. Set a library with "cogentic libraries set" and optionally a default.'));
        process.exit(1);
      }

      try {
        const result = await fetchTools(token, category);
        console.log(chalk.bold(`\n🔧 Tools in "${category}":\n`));
        console.log(result);
      } catch (error) {
        console.error(chalk.red(`Request failed: ${error.message}`));
        process.exit(1);
      }
    });
}