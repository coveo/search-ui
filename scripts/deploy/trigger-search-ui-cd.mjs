import {context, getOctokit} from '@actions/github';

const octokit = getOctokit(process.env.GH_TOKEN);

await octokit.rest.repos.createDispatchEvent({
  event_type: 'deploy',
  client_payload: {
    run_Id: context.runId,
    version: 'v3',
  },
  owner: 'coveo-platform',
  repo: 'search-ui-cd',
});
