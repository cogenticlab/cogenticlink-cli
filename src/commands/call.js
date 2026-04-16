import chalk from 'chalk';
import { callTool } from '../api.js';
import { getTokenForLibrary } from '../libraries.js';

export function callCommand(program) {
  program
    .command('call <tool>')
    .description('Execute a tool with parameters (JSON string)')
    .option('-p, --params <json>', 'Parameters as JSON string', '{}')
    .option('-l, --library <name>', 'Use a specific library (defaults to default library)')
    .action(async (tool, options) => {
      const token = await getTokenForLibrary(options.library);
      if (!token) {
        console.error(chalk.red('Error: No API token available. Set a library with "cogenticlink libraries set" and optionally a default.'));
        process.exit(1);
      }

      let params;
      try {
        params = JSON.parse(options.params);
      } catch (e) {
        console.error(chalk.red('Invalid JSON in --params'));
        process.exit(1);
      }

      try {
        const result = await callTool(token, tool, params);
        console.log(chalk.bold(`\n⚙️  Calling tool: ${tool}\n`));
        console.log(JSON.stringify(result, null, 2));
      } catch (error) {
        console.error(chalk.red(`Request failed: ${error.message}`));
        process.exit(1);
      }
    });
}