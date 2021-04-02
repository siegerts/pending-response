# Pending Response Follow Up action 🏀

Remove a `pending-response-label` from an issue, if present, when a new issue comment is _created_ by a non-repo member (`member-associations`).

Optionally, add a follow-up label (`actionable-label`) to highlight that an action is required by the team.

The labels must exist in the repo in order for the action to add them to an issue.

## Inputs

| Input                    | Default                         | Required | Description                                                                                                                                                                                                                                                                                                  |
| ------------------------ | ------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `github-token`           |                                 | true     | The GitHub token used to create an authenticated client                                                                                                                                                                                                                                                      |
| `member-associations`    | `"OWNER, MEMBER, COLLABORATOR"` | false    | [Repository associations](https://docs.github.com/en/graphql/reference/enums#commentauthorassociation) that are considered part of the team. The action will skip the labeling logic if the user who created the comment falls into one of these groups. Separate multiple with commas (eg. "OWNER, MEMBER") |
| `pending-response-label` |                                 | true     | Label to remove indicating that a response is required for further action                                                                                                                                                                                                                                    |
| `actionable-label`       |                                 | false    | Label added to highlight that a user has responded and a follow-up is required                                                                                                                                                                                                                               |

## Usage

You can use the action by referencing the v1 branch:

```yaml
name: pending-response
on:
  issue_comment:
    types: [created]

jobs:
  issue_commented:
    runs-on: ubuntu-latest
    steps:
      - uses: siegerts/pending-response@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          pending-response-label: pending-response
```

### Using `member-associations` to skip the action for `"OWNER, MEMBER"` repo associations

```yaml
name: pending-response
on:
  issue_comment:
    types: [created]

jobs:
  issue_commented:
    runs-on: ubuntu-latest
    steps:
      - uses: siegerts/pending-response@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          member-associations: "OWNER, MEMBER"
          pending-response-label: pending-response
```

### Adding an `actionable-label`

```yaml
name: pending-response
on:
  issue_comment:
    types: [created]

jobs:
  issue_commented:
    runs-on: ubuntu-latest
    steps:
      - uses: siegerts/pending-response@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          member-associations: "OWNER, MEMBER, COLLABORATOR"
          pending-response-label: pending-response
          actionable-label: follow-up
```
