// Copia i file del sito in www/ (usato da Capacitor e da Electron).
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'www');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of ['index.html', 'manifest.webmanifest', 'informativa-privacy.html', 'cookies.html']) {
  if (existsSync(resolve(root, f))) cpSync(resolve(root, f), resolve(out, f));
}
cpSync(resolve(root, 'assets'), resolve(out, 'assets'), { recursive: true });
console.log('www/ pronta');
