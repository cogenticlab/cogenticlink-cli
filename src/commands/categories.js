import chalk from 'chalk';
import { fetchCategories } from '../api.js';
import { getTokenForLibrary } from '../libraries.js';

export function categoriesCommand(program) {
  program
    .command('categories')
    .description('Fetch all tool categories')
    .option('-l, --library <name>', 'Use a specific library (defaults to default library)')
    .action(async (options) => {
      const token = await getTokenForLibrary(options.library);
      if (!token) {
        console.error(chalk.red('Error: No API token available. Set a library with "cogenticlink libraries set" and optionally a default.'));
        process.exit(1);
      }

      try {
        const categories = await fetchCategories(token);
        console.log(chalk.bold('\n📁 Tool Categories:\n'));
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