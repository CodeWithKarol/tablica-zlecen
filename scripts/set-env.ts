import { writeFile } from 'fs';
import { env } from 'process';

// This script will only overwrite the environment.ts file IF the environment variables are present.
// This is intended for use in CI/CD environments like Vercel.
const targetPath = './src/environments/environment.ts';

if (env['SUPABASE_URL'] && env['SUPABASE_KEY']) {
  const environmentFileContent = `
export const environment = {
  production: true,
  supabaseUrl: '${env['SUPABASE_URL']}',
  supabaseKey: '${env['SUPABASE_KEY']}'
};
`;

  writeFile(targetPath, environmentFileContent, (err) => {
    if (err) {
      console.error(err);
      throw err;
    }
    console.log(`Successfully injected environment variables to ${targetPath}`);
  });
} else {
  console.log('Missing SUPABASE_URL or SUPABASE_KEY. Skipping environment injection (using local defaults).');
}
