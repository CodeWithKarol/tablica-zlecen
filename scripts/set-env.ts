import { writeFile, mkdirSync, existsSync } from 'fs';
import { env } from 'process';

const targetPath = './src/environments/environment.ts';

const environmentFileContent = `
export const environment = {
  production: true,
  supabaseUrl: '${env['SUPABASE_URL'] || 'SUPABASE_URL_PLACEHOLDER'}',
  supabaseKey: '${env['SUPABASE_KEY'] || 'SUPABASE_KEY_PLACEHOLDER'}'
};
`;

writeFile(targetPath, environmentFileContent, (err) => {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log(`Wrote variables to ${targetPath}`);
});
