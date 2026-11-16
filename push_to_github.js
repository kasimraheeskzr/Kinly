const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname);

function getFiles(baseDir, subDir = '') {
  const currentDir = path.join(baseDir, subDir);
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const relPath = path.join(subDir, entry.name).replace(/\\/g, '/');

    if (
      relPath === '.git' ||
      relPath.startsWith('.git/') ||
      relPath === 'node_modules' ||
      relPath.startsWith('node_modules/') ||
      relPath.includes('/node_modules/') ||
      relPath.includes('/dist/') ||
      relPath === 'design.svg' ||
      relPath.endsWith('.log')
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      files = files.concat(getFiles(baseDir, relPath));
    } else {
      files.push(relPath);
    }
  }

  return files;
}

async function main() {
  let repoUrl = process.argv[2] || 'https://github.com/kasimraheeskzr/Kinly.git';
  const token = process.argv[3];

  console.log('--- Git Push Tool ---');

  // 1. Init
  if (!fs.existsSync(path.join(dir, '.git'))) {
    console.log('[1/4] Initializing local git repository...');
    await git.init({ fs, dir, defaultBranch: 'main' });
  } else {
    console.log('[1/4] Git repository verified.');
  }

  // 2. Stage
  const filesToStage = getFiles(dir);
  console.log(`[2/4] Staging ${filesToStage.length} project files...`);
  for (const filepath of filesToStage) {
    await git.add({ fs, dir, filepath });
  }

  // 3. Commit
  console.log('[3/4] Committing files...');
  try {
    const sha = await git.commit({
      fs,
      dir,
      author: {
        name: 'kasimraheeskzr',
        email: 'kasimraheeskzr@users.noreply.github.com'
      },
      message: 'Initial commit: Kinly Family Digital Wellness & Parental Protection Platform'
    });
    console.log(`Commit: ${sha}`);
  } catch (err) {
    if (err.code === 'NoChangeError') {
      console.log('Working tree clean (no new changes).');
    } else {
      console.log('Commit note:', err.message);
    }
  }

  // 4. Push
  if (!token && !repoUrl.includes('@')) {
    console.log('\n[!] GitHub Authentication Required:');
    console.log('GitHub requires a Personal Access Token (PAT) with "repo" scope to push code.');
    console.log('\nTo push, run:');
    console.log(`node push_to_github.js ${repoUrl} <YOUR_GITHUB_PAT_TOKEN>`);
    console.log('\nOr paste your token here, and I will execute the push for you.');
    return;
  }

  console.log(`\n[4/4] Pushing to remote ${repoUrl}...`);
  try {
    await git.push({
      fs,
      http,
      dir,
      remote: 'origin',
      url: repoUrl,
      ref: 'main',
      force: true,
      onAuth: () => ({ username: token || 'oauth2', password: '' })
    });
    console.log('\nSUCCESS! Your code has been pushed to GitHub successfully:');
    console.log(repoUrl);
  } catch (err) {
    console.error('\nPush failed:', err.message);
  }
}

main().catch(console.error);
