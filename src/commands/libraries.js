import chalk from 'chalk';
import {
  setLibrary,
  removeLibrary,
  listLibraries,
} from '../libraries.js';

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

  // Set command with positional arguments
  libCmd
    .command('set <name> <token> [description]')
    .description('Set a library token. Usage: set <name> <token> [description]')
    .action(async (name, token, description) => {
      if (!name || !token) {
        console.error(chalk.red('Error: Both name and token are required.'));
        console.error(chalk.yellow('Usage: cogenticlink libraries set <name> <token> [description]'));
        process.exit(1);
      }

      await setLibrary(name, token, description || '');
      console.log(chalk.green(`✓ Library "${name}" saved to ~/.cogenticlab/config.json`));
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

  // List all libraries (alternative to plain "libraries")
  libCmd
    .command('list')
    .description('List all configured libraries (alternative to plain "libraries")')
    .action(async () => {
      const libraries = await listLibraries();
      if (Object.keys(libraries).length === 0) {
        console.log(chalk.yellow('No libraries configured. Use "cogenticlink libraries set <name> <token>"'));
      } else {
        for (const [name, lib] of Object.entries(libraries)) {
          console.log(`${chalk.bold(name)}: ${lib.description || 'no description'}`);
        }
      }
    });
}