import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.cogenticlab/link');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export async function ensureConfigDir() {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
}

async function readConfig() {
  await ensureConfigDir(); // Ensure directory exists before reading
  try {
    const content = await fs.readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create default config
      const defaultConfig = { libraries: {} };
      await fs.writeFile(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2), 'utf-8');
      return defaultConfig;
    }
    throw error;
  }
}

async function writeConfig(config) {
  await ensureConfigDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

export async function getLibraryToken(libraryName) {
  const config = await readConfig();
  const lib = config.libraries?.[libraryName];
  return lib ? lib.token : null;
}

export async function setLibrary(libraryName, token, description = '') {
  const config = await readConfig();
  if (!config.libraries) config.libraries = {};
  config.libraries[libraryName] = { token, description };
  await writeConfig(config);
}

export async function removeLibrary(libraryName) {
  const config = await readConfig();
  if (config.libraries && config.libraries[libraryName]) {
    delete config.libraries[libraryName];
    await writeConfig(config);
    return true;
  }
  return false;
}

export async function listLibraries() {
  const config = await readConfig();
  return config.libraries || {};
}