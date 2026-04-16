import chalk from 'chalk';
import {
  setLibrary,
  removeLibrary,
  listLibraries,
  setDefaultLibrary,
  getDefaultLibraryName,
  // getLibraryToken removed - not used in this file
} from '../libraries.js';

export function setupLibrariesCommand(program) {
  const libCmd = program.command('libraries').description('Manage named API libraries');

  // Set library: accepts "name=token" or "name token" [description]
  libCmd
    .command('set <nameOrPair> [token] [description]')
    .description('Store a library token. Usage: set name=token [description] OR set name token [description]')
    .action(async (nameOrPair, token, description) => {
      let libraryName, libraryToken;
      if (nameOrPair.includes('=') && !token) {
        // format: name=token
        [libraryName, libraryToken] = nameOrPair.split('=', 2);
        if (!libraryToken) {
          console.error(chalk.red('Invalid format. Use: name=token or name token'));
          process.exit(1);
        }
      } else {
        libraryName = nameOrPair;
        libraryToken = token;
        if (!libraryToken) {
          console.error(chalk.red('Token is required. Usage: set name=token or name token'));
          process.exit(1);
        }
      }
      await setLibrary(libraryName, libraryToken, description || '');
      console.log(chalk.green(`✓ Library "${libraryName}" saved to ~/.cogenticlab/config.json`));
    });

  // Get token for a library
  libCmd
    .command('get [name]')
    .description('Show token for a library (or all libraries)')
    .action(async (name) => {
      const libraries = await listLibraries();
      if (name) {
        const lib = libraries[name];
        if (lib) {
          console.log(chalk.blue(`Library: ${name}`));
          console.log(`  Token: ${lib.token}`);
          if (lib.description) console.log(`  Description: ${lib.description}`);
        } else {
          console.log(chalk.yellow(`Library "${name}" not found`));
        }
      } else {
        if (Object.keys(libraries).length === 0) {
          console.log(chalk.yellow('No libraries configured. Use "cogenticlink libraries set <name> <token>"'));
        } else {
          const defaultName = await getDefaultLibraryName();
          for (const [libName, lib] of Object.entries(libraries)) {
            const defaultMarker = libName === defaultName ? ' (default)' : '';
            console.log(chalk.bold(`\n${libName}${defaultMarker}:`));
            console.log(`  Token: ${lib.token}`);
            if (lib.description) console.log(`  Description: ${lib.description}`);
          }
        }
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

  // List all libraries
  libCmd
    .command('list')
    .description('List all configured libraries')
    .action(async () => {
      const libraries = await listLibraries();
      const defaultName = await getDefaultLibraryName();
      if (Object.keys(libraries).length === 0) {
        console.log(chalk.yellow('No libraries configured. Use "cogenticlink libraries set <name> <token>"'));
      } else {
        for (const [name, lib] of Object.entries(libraries)) {
          const defaultMarker = name === defaultName ? ' (default)' : '';
          console.log(`${chalk.bold(name)}${defaultMarker}: ${lib.description || 'no description'}`);
        }
      }
    });

  // Set/show default library
  libCmd
    .command('default [name]')
    .description('Set or show the default library')
    .action(async (name) => {
      if (name) {
        try {
          await setDefaultLibrary(name);
          console.log(chalk.green(`✓ Default library set to "${name}"`));
        } catch (err) {
          console.error(chalk.red(err.message));
          process.exit(1);
        }
      } else {
        const defaultName = await getDefaultLibraryName();
        if (defaultName) {
          console.log(chalk.blue(`Default library: ${defaultName}`));
        } else {
          console.log(chalk.yellow('No default library set. Use "cogenticlink libraries default <name>"'));
        }
      }
    });
}