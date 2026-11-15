import { access, cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, sep } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REQUIRED_OUTPUTS = [
  'index.html', 'manifest.webmanifest', 'sw.js',
  'src/app.js', 'src/core.js', 'src/providers.js', 'src/styles.css',
  'assets/icon.svg'
];
const STATIC_INPUTS = ['index.html', 'manifest.webmanifest', 'sw.js', 'src', 'assets'];

export async function buildSite({ rootDir = projectRoot, outDir = join(rootDir, 'dist') } = {}) {
  const root = resolve(rootDir);
  const output = resolve(outDir);
  if (output === root || !output.startsWith(root + sep)) {
    throw new Error('Build output must be a child directory of the project root.');
  }

  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });

  for (const entry of STATIC_INPUTS) {
    const source = join(root, entry);
    await access(source);
    await cp(source, join(output, entry), { recursive: true, force: true });
  }

  for (const file of REQUIRED_OUTPUTS) await access(join(output, file));
  return { output, files: REQUIRED_OUTPUTS };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await buildSite();
  process.stdout.write('Built SIRAT static PWA: ' + result.output + '\n');
}
