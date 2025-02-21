import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

if (!process.env.NPM_PREPARE_RUNNING) {

  process.env.NPM_PREPARE_RUNNING = 'true';

  // Define __dirname using import.meta.url
  const __dirname = path.dirname(new URL(import.meta.url).pathname);

  const lockFileExists = fs.existsSync(path.join(__dirname, '../package-lock.json'));
  if (!lockFileExists) {
    console.log('No package-lock.json found, running npm install...');
    execSync('npm install', { stdio: 'inherit' });
  } else {
    try {
      // try to install with npm ci
      console.log('Running npm ci...');
      execSync('npm ci', { stdio: 'inherit' });
    } catch (error) {
      // package-lock.json not matched package.json
      console.warn('package-lock.json is out of sync with package.json, re-running npm install...');
      execSync('npm install', { stdio: 'inherit' });
    }
  }

  console.log('Building the library...');
  execSync('npm run typegen && npm run build', { stdio: 'inherit' });
}

