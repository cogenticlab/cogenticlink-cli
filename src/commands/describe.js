import chalk from 'chalk';
import { fetchToolDescription } from '../api.js';
import { getLibraryToken } from '../libraries.js';

export function describeCommand(program) {
  program
    .command('describe <library> <tool>')
    .description('Get description and input schema for a tool from a library')
    .action(async (library, tool) => {
      const token = await getLibraryToken(library);
      if (!token) {
        console.error(chalk.red(`Error: Library "${library}" not found or has no token.`));
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