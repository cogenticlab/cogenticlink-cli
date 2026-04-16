import chalk from 'chalk';
import { fetchTools } from '../api.js';
import { getLibraryToken } from '../libraries.js';

export function listCommand(program) {
  program
    .command('list [category]')
    .description('List tools in a category (default: All Tools)')
    .requiredOption('-l, --library <name>', 'Library name (required)')
    .action(async (category = 'All Tools', options) => {
      const token = await getLibraryToken(options.library);
      if (!token) {
        console.error(chalk.red(`Error: Library "${options.library}" not found or has no token.`));
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