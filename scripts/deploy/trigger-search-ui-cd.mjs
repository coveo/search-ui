import { context, getOctokit } from '@actions/github';

const octokit = getOctokit(process.env.GH_TOKEN);
const branchName = process.env.RELEASE_BRANCH_NAME;

console.log("🚀 Starting deployment trigger for branch:", branchName);

try {
  const response = await octokit.rest.repos.createDispatchEvent({
    event_type: 'deploy',
    client_payload: {
      run_Id: context.runId,
      version: 'v2',
      release_branch_name: branchName
    },
    owner: 'coveo-platform',
    repo: 'search-ui-cd'
  });

  if (response.status === 204) {
    console.log("✅ Successfully emitted dispatch to 'search-ui-cd' repository.");
  } else {
    console.warn("⚠️ Unexpected response status:", response.status);
  }
} catch (error) {
  console.error("❌ Failed to send dispatch to 'search-ui-cd':", error.message);
  process.exit(1);
}
