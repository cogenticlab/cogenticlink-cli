import chalk from 'chalk';
import { fetchToolDescription } from '../api.js';
import { getTokenForLibrary } from '../libraries.js';

export function describeCommand(program) {
  program
    .command('describe <tool>')
    .description('Get description and input schema for a tool')
    .option('-l, --library <name>', 'Use a specific library (defaults to default library)')
    .action(async (tool, options) => {
      const token = await getTokenForLibrary(options.library);
      if (!token) {
        console.error(chalk.red('Error: No API token available. Set a library with "cogenticlin libraries set" and optionally a default.'));
        process.exit(1);
      }

      try {
        const description = await fetchToolDescription(token, tool);
        console.log(chalk.bold(`\n📖 Tool: ${tool}\n`));
        console.log(description);
      } catch (error) {
        console.error(chalk.red(`Request failed: ${error.message}`));
        process.exit(1);
      }
    });
}