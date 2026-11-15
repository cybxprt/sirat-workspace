import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildSite } from '../scripts/build.mjs';

test('build copies only the explicit static PWA inputs into dist', async () => {
  const root = await mkdtemp(join(tmpdir(), 'sirat-build-'));
  try {
    await mkdir(join(root, 'src'), { recursive: true });
    await mkdir(join(root, 'assets'), { recursive: true });
    await mkdir(join(root, 'tests'), { recursive: true });
    for (const file of ['index.html', 'manifest.webmanifest', 'sw.js']) {
      await writeFile(join(root, file), file);
    }
    for (const file of ['app.js', 'core.js', 'providers.js', 'styles.css']) {
      await writeFile(join(root, 'src', file), file);
    }
    await writeFile(join(root, 'assets', 'icon.svg'), '<svg/>');
    await writeFile(join(root, 'tests', 'private-fixture.txt'), 'must not ship');
    await writeFile(join(root, '.env'), 'secret=must-not-ship');

    const result = await buildSite({ rootDir: root, outDir: join(root, 'dist') });
    assert.equal(result.output, join(root, 'dist'));
    assert.equal(await readFile(join(root, 'dist', 'src', 'app.js'), 'utf8'), 'app.js');
    assert.equal(await readFile(join(root, 'dist', 'assets', 'icon.svg'), 'utf8'), '<svg/>');
    await assert.rejects(readFile(join(root, 'dist', '.env')));
    await assert.rejects(readFile(join(root, 'dist', 'tests', 'private-fixture.txt')));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('build refuses to write outside the project root', async () => {
  const root = await mkdtemp(join(tmpdir(), 'sirat-build-'));
  const outside = await mkdtemp(join(tmpdir(), 'sirat-outside-'));
  try {
    await assert.rejects(
      buildSite({ rootDir: root, outDir: outside }),
      /child directory of the project root/
    );
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});
