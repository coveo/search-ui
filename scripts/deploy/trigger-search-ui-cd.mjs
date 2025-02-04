import {context, getOctokit} from '@actions/github';

const octokit = getOctokit(process.env.GH_TOKEN);
const branchName = 'feat/DT-7426/configure-private-search-ui-deployment';

console.log(`Triggering search-ui-cd for branch ${branchName}`);

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
