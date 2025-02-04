import {context, getOctokit} from '@actions/github';

const octokit = getOctokit(process.env.GH_TOKEN);
const branchName = process.env.TARGET_BRANCH || 'main';

await octokit.rest.repos.createDispatchEvent({
  event_type: 'deploy',
  client_payload: {
    run_Id: context.runId,
    version: 'v3',
    branch: branchName,
  },
  owner: 'coveo-platform',
  repo: 'search-ui-cd',
});
