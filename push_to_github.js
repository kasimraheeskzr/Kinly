const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname);

// Collect files to commit, respecting .gitignore rules
function getFiles(baseDir, subDir = '') {
  const currentDir = path.join(baseDir, subDir);
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const relPath = path.join(subDir, entry.name).replace(/\\/g, '/');

    // Skip ignored items
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
  const repoUrl = process.argv[2];
  const token = process.argv[3];

  console.log('--- Git Push Tool ---');

  // 1. Initialize repository if .git doesn't exist
  if (!fs.existsSync(path.join(dir, '.git'))) {
    console.log('[1/4] Initializing local git repository...');
    await git.init({ fs, dir, defaultBranch: 'main' });
  } else {
    console.log('[1/4] Git repository already initialized.');
  }

  // 2. Stage files
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
        name: 'Sibaq',
        email: 'sibaq@kinly.family'
      },
      message: 'Initial commit: Kinly Family Digital Wellness & Parental Protection Platform'
    });
    console.log(`Commit created: ${sha}`);
  } catch (err) {
    if (err.code === 'NoChangeError') {
      console.log('No new changes to commit.');
    } else {
      console.error('Commit note:', err.message);
    }
  }

  // 4. Push if remote URL and token are provided
  if (!repoUrl) {
    console.log('\n[Ready] Local repository initialized and all files committed to branch "main"!');
    console.log('\nTo push to GitHub, run:');
    console.log('node push_to_github.js <YOUR_GITHUB_REPO_URL> <YOUR_GITHUB_TOKEN>');
    console.log('Example:');
    console.log('node push_to_github.js https://github.com/yourusername/kinly.git ghp_xxxxxx');
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
    console.log('\nSUCCESS! Code has been pushed to GitHub successfully!');
  } catch (err) {
    console.error('\nPush error:', err.message);
  }
}

main().catch(console.error);
