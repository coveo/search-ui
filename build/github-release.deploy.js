const { Octokit } = require('@octokit/rest');
const fs = require('fs');

const token = process.env.GITHUB_TOKEN || '';
const tag_name = process.env.TAG_NAME || '';

async function main() {
  try {
    const github = new Octokit({ auth: token });

    const owner = 'coveo';
    const repo = 'search-ui';
    const fileName = 'search-ui.zip';
    const data = fs.readFileSync(fileName);

    // https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#create-a-release
    const createReleaseResponse = await github.repos.createRelease({ owner, repo, tag_name });
    const release_id = createReleaseResponse.data.id;

    const uploadAssetResponse = await github.repos.uploadReleaseAsset({ owner, repo, data, release_id, name: fileName });
    const browserDownloadUrl = uploadAssetResponse.data.browser_download_url;

    console.log('successfully uploaded asset', browserDownloadUrl);
  } catch (error) {
    console.log('failed to upload asset', error);
  }
}

main();
