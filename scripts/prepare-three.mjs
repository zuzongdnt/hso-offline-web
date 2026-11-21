import { copyFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const threeFiles = [
  'LICENSE',
  'build/three.module.min.js',
  'examples/jsm/loaders/GLTFLoader.js',
  'examples/jsm/utils/BufferGeometryUtils.js',
];

await Promise.all(threeFiles.map(async (file) => {
  const destination = `public/vendor/three/${file}`;
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(`node_modules/three/${file}`, destination);
}));
