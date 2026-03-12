const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dir = 'src/environments';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const targetPath = process.argv[2] === 'prod' 
  ? 'src/environments/environment.ts' 
  : 'src/environments/environment.development.ts';

const url = process.env.SUPABASE_URL || 'SUPABASE_URL_PLACEHOLDER';
const key = process.env.SUPABASE_ANON_KEY || 'SUPABASE_KEY_PLACEHOLDER';

const envConfigFile = `export const environment = {
  production: ${process.argv[2] === 'prod'},
  supabaseUrl: '${url}',
  supabaseKey: '${key}'
};
`;

console.log(`Generating environment file at ${targetPath}`);
fs.writeFileSync(targetPath, envConfigFile);

// Also generate a basic placeholder for the other file if it doesn't exist to prevent build errors
const otherPath = process.argv[2] === 'prod' 
  ? 'src/environments/environment.development.ts' 
  : 'src/environments/environment.ts';

if (!fs.existsSync(otherPath)) {
  fs.writeFileSync(otherPath, `export const environment = { production: false, supabaseUrl: '', supabaseKey: '' };`);
}
