import { context, getOctokit } from '@actions/github';

const octokit = getOctokit(process.env.GH_TOKEN);
const branchName = process.env.RELEASE_BRANCH_NAME;

await octokit.rest.repos.createDispatchEvent({
  event_type: 'deploy',
  client_payload: {
    run_Id: context.runId,
    version: 'v2',
    release_branch_name: branchName
  },
  owner: 'coveo-platform',
  repo: 'search-ui-cd'
});
