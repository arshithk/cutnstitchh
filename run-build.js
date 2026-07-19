#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const baseDir = 'c:/Users/arshu/OneDrive/Desktop/CutnStitch';
const nextDir = path.join(baseDir, '.next');

// Clean .next
try {
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('✓ Cleaned .next directory');
  }
} catch (err) {
  console.log('Could not delete .next:', err.message);
}

// Run build
try {
  console.log('\n🔨 Building...\n');
  const output = execSync('npm run build', {
    cwd: baseDir,
    stdio: 'inherit',
    shell: true
  });
} catch (err) {
  console.error('\n❌ Build failed');
  process.exit(1);
}
