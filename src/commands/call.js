import chalk from 'chalk';
import { callTool } from '../api.js';
import { getLibraryToken } from '../libraries.js';

export function callCommand(program) {
  program
    .command('call <library> <tool> [parameters]')
    .description('Execute a tool from a library with parameters (JSON string)')
    .action(async (library, tool, parameters = '{}') => {
      const token = await getLibraryToken(library);
      if (!token) {
        console.error(chalk.red(`Error: Library "${library}" not found or has no token.`));
        process.exit(1);
      }

      let params;
      // If parameters is empty or just whitespace, treat as empty object
      if (!parameters || parameters.trim() === '') {
        params = {};
      } else {
        // Helper to strip matching outer quotes (single or double)
        function stripOuterQuotes(str) {
          if ((str.startsWith('"') && str.endsWith('"')) || 
              (str.startsWith("'") && str.endsWith("'"))) {
            return str.slice(1, -1);
          }
          return str;
        }

        try {
          const parsed = JSON.parse(parameters);
          // If parsed is a plain object (not null, not array), use as-is
          if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) {
            params = parsed;
          } else {
            // Valid JSON but not an object: strip outer quotes from original string if any,
            // then wrap in {command: ...}
            const stripped = stripOuterQuotes(parameters);
            params = { command: stripped };
          }
        } catch (e) {
          // Invalid JSON: strip outer quotes and wrap
          const stripped = stripOuterQuotes(parameters);
          params = { command: stripped };
        }
      }

      try {
        const result = await callTool(token, tool, params);
        console.log(JSON.stringify(result, null, 2));
      } catch (error) {
        console.error(chalk.red(`Request failed: ${error.message}`));
        process.exit(1);
      }
    });
}