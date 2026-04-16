import chalk from 'chalk';
import { fetchCategories } from '../api.js';
import { getLibraryToken } from '../libraries.js';

export function categoriesCommand(program) {
  program
    .command('categories')
    .description('Fetch all tool categories')
    .requiredOption('-l, --library <name>', 'Library name (required)')
    .action(async (options) => {
      const token = await getLibraryToken(options.library);
      if (!token) {
        console.error(chalk.red(`Error: Library "${options.library}" not found or has no token.`));
        process.exit(1);
      }

      try {
        const categories = await fetchCategories(token);
        if (Array.isArray(categories)) {
          categories.forEach(cat => console.log(`  - ${cat}`));
        } else {
          console.log(categories);
        }
      } catch (error) {
        console.error(chalk.red(`Request failed: ${error.message}`));
        process.exit(1);
      }
    });
}