import chalk from 'chalk';
import { fetchTools } from '../api.js';
import { getLibraryToken } from '../libraries.js';

export function listCommand(program) {
  program
    .command('list <library> <category>')
    .description('List tools in a category for a library (default category: All Tools)')
    .action(async (library, category = 'All Tools') => {
      const token = await getLibraryToken(library);
      if (!token) {
        console.error(chalk.red(`Error: Library "${library}" not found or has no token.`));
        process.exit(1);
      }

      try {
        const result = await fetchTools(token, category);
        console.log(result);
      } catch (error) {
        console.error(chalk.red(`Request failed: ${error.message}`));
        process.exit(1);
      }
    });
}