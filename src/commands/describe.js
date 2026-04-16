import chalk from 'chalk';
import { fetchToolDescription } from '../api.js';
import { getLibraryToken } from '../libraries.js';

export function describeCommand(program) {
  program
    .command('describe <tool>')
    .description('Get description and input schema for a tool')
    .requiredOption('-l, --library <name>', 'Library name (required)')
    .action(async (tool, options) => {
      const token = await getLibraryToken(options.library);
      if (!token) {
        console.error(chalk.red(`Error: Library "${options.library}" not found or has no token.`));
        process.exit(1);
      }

      try {
        const description = await fetchToolDescription(token, tool);
        console.log(description);
      } catch (error) {
        console.error(chalk.red(`Request failed: ${error.message}`));
        process.exit(1);
      }
    });
}