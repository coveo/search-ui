const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const { isAlphaVersion } = require('./version.utilities');

const token = process.env.GITHUB_TOKEN || '';
const tag_name = process.env.TAG_NAME || '';

const github = new Octokit({ auth: token });

const owner = 'coveo';
const repo = 'search-ui';
const fileName = 'search-ui.zip';

async function createRelease() {
  console.log('🔍 Debug: GITHUB_TOKEN length:', token.length > 0 ? 'Token is NOT empty ✅' : 'Token is empty ❌');
  console.log('🔍 Debug: TAG_NAME:', tag_name);

  if (!tag_name) {
    throw new Error('❌ TAG_NAME is missing! A valid Git tag is required to create a release.');
  }

  try {
    const res = await github.repos.createRelease({
      owner,
      repo,
      tag_name: tag_name,
      name: `Release ${tag_name}`,
      body: 'Auto-generated release',
      draft: false,
      prerelease: false
    });

    console.log(`✅ Created release for tag: ${tag_name}`);
    return res.data.id;
  } catch (e) {
    console.log(`failed to create release`, e.errors);
  }
}

async function getReleaseIdByTag() {
  const res = await github.repos.getReleaseByTag({ owner, repo, tag: tag_name });
  console.log(`found existing release for tag: ${tag_name}`);

  return res.data.id;
}

async function getReleaseId() {
  try {
    return await createRelease();
  } catch (e) {
    console.log(`failed to create release`, e.errors);
    return await getReleaseIdByTag();
  }
}

async function uploadAsset(release_id) {
  const data = fs.readFileSync(fileName);
  return github.repos.uploadReleaseAsset({ owner, repo, data, release_id, name: fileName });
}

async function main() {
  if (isAlphaVersion()) {
    return console.log('skipping Github Release for alpha version');
  }

  try {
    const releaseId = await getReleaseId();
    const res = await uploadAsset(releaseId);
    const browserDownloadUrl = res.data.browser_download_url;

    console.log('successfully uploaded asset', browserDownloadUrl);
  } catch (e) {
    console.log('failed to upload asset', e.errors);
  }
}

main();
