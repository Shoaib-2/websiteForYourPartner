const { spawnSync } = require('child_process');

const nextBin = require.resolve('next/dist/bin/next');
const args = process.argv.slice(2);

const result = spawnSync(process.execPath, [nextBin, ...args], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
