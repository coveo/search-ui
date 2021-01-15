const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const { isAlphaVersion } = require('./tag.utilities');

const token = process.env.GITHUB_TOKEN || '';
const tag_name = process.env.TAG_NAME || '';

const github = new Octokit({ auth: token });

const owner = 'coveo';
const repo = 'search-ui';
const fileName = 'search-ui.zip';

async function createRelease() {
  const res = await github.repos.createRelease({ owner, repo, tag_name });
  console.log(`created release`);

  return res.data.id;
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
