const github = require("@actions/github");
const core = require("@actions/core");

const wordsToArray = require("./wordsToArray");

/**
 * On issue comment by a non-repo member (memberAssociations),
 * remove the `pendingResponseLabel`, if present.
 *
 * Optionally, add a follow up label (actionableLabel) to
 * indicate that an action is required by the team.
 *
 */

async function run() {
  const token = core.getInput("github-token", { required: true });

  // core.getInput treats YAML booleans as strings
  // https://github.com/actions/toolkit/issues/361
  // const dryRun =
  //   (core.getInput("dry-run", { required: false }) || "false") === "true";

  const pendingResponseLabel = core.getInput("pending-response-label", {
    required: true,
  });

  const actionableLabel = core.getInput("actionable-label") || "";

  // https://docs.github.com/en/graphql/reference/enums#commentauthorassociation
  const memberAssociations = wordsToArray(
    core.getInput("member-associations") || "OWNER, MEMBER, COLLABORATOR"
  );

  if (!memberAssociations || !memberAssociations.length) {
    return core.setFailed(
      "At least one Comment Author Association is required."
    );
  }

  // context
  const context = github.context;
  const repo = context.repo;
  const issue = context.payload.issue;
  const comment = context.payload.comment;

  if (!repo || !comment) {
    core.setFailed(
      "Missing repo or comment information from the event payload"
    );
  }

  // core.info(`Run mode: ${dryRun ? "dry-run" : "production"}`);

  const commentAuthorAssociation = comment.author_association;
  const isMember = memberAssociations.includes(commentAuthorAssociation);
  const labels = issue.labels || [];

  const isPendingResponse = labels.some(
    ({ name }) => name === pendingResponseLabel
  );

  // not team member and includes pending response label
  if (!isMember && isPendingResponse) {
    core.info(`Updating issue #${issue.number}...`);
    core.info(`--Removing <${pendingResponseLabel}> label...`);

    const octo = github.getOctokit(token);

    await octo.issues.removeLabel({
      owner: repo.owner,
      repo: repo.repo,
      issue_number: issue.number,
      name: pendingResponseLabel,
    });

    // if configured, add follow up label
    if (actionableLabel) {
      core.info(`--Adding <${actionableLabel}> label...`);
      await octo.issues.addLabels({
        owner: repo.owner,
        repo: repo.repo,
        issue_number: issue.number,
        labels: [actionableLabel],
      });
    }
  }
}

run();
