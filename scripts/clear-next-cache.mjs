import { rm } from 'fs/promises';
import { existsSync } from 'fs';

const dirs = ['.next', 'node_modules/.cache'];
for (const dir of dirs) {
  if (existsSync(dir)) {
    await rm(dir, { recursive: true, force: true });
    console.log(`Deleted ${dir}`);
  } else {
    console.log(`${dir} not found, skipping`);
  }
}
console.log('Cache cleared successfully');
