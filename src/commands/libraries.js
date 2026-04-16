import chalk from 'chalk';
import {
  setLibrary,
  removeLibrary,
  listLibraries,
} from '../libraries.js';

function parseKeyValuePairs(args) {
  const result = {};
  for (const arg of args) {
    if (arg.includes('=')) {
      const [key, ...valueParts] = arg.split('=');
      const value = valueParts.join('=');
      if (key && value !== undefined) {
        result[key] = value;
      }
    }
  }
  return result;
}

export function setupLibrariesCommand(program) {
  const libCmd = program.command('libraries').description('Manage named API libraries');

  // Default action: list libraries in markdown
libCmd.action(async () => {
  const libraries = await listLibraries();
  console.log('# Tool Libraries');
  if (Object.keys(libraries).length === 0) {
    console.log('*No libraries configured.*');
  } else {
    for (const [name, lib] of Object.entries(libraries)) {
      const description = lib.description;
      if (description && description.trim() !== '') {
        console.log(`- ${name}: ${description}`);
      } else {
        console.log(`- ${name}`);
      }
    }
  }
});

  // Set command with key=value arguments
  libCmd
    .command('set')
    .allowUnknownOption()
    .description('Set a library token. Usage: set name=<name> token=<token> [description=<desc>]')
    .action(async () => {
      const args = process.argv.slice(process.argv.indexOf('set') + 1);
      const params = parseKeyValuePairs(args);

      const libraryName = params.name;
      const token = params.token;
      const description = params.description || '';

      if (!libraryName || !token) {
        console.error(chalk.red('Error: Both "name" and "token" are required.'));
        console.error(chalk.yellow('Usage: cogenticlink libraries set name=<name> token=<token> [description=<desc>]'));
        process.exit(1);
      }

      await setLibrary(libraryName, token, description);
      console.log(chalk.green(`✓ Library "${libraryName}" saved to ~/.cogenticlab/config.json`));
    });

  // Get token for a library
  libCmd
    .command('get <name>')
    .description('Show token for a library')
    .action(async (name) => {
      const libraries = await listLibraries();
      const lib = libraries[name];
      if (lib) {
        console.log(chalk.blue(`Library: ${name}`));
        console.log(`  Token: ${lib.token}`);
        if (lib.description) console.log(`  Description: ${lib.description}`);
      } else {
        console.log(chalk.yellow(`Library "${name}" not found`));
      }
    });

  // Remove library
  libCmd
    .command('remove <name>')
    .description('Remove a library')
    .action(async (name) => {
      const removed = await removeLibrary(name);
      if (removed) {
        console.log(chalk.green(`✓ Library "${name}" removed`));
      } else {
        console.log(chalk.yellow(`Library "${name}" not found`));
      }
    });
}