# Pending Response action 🏀

On issue comment by a non-repo member (`member-associations`), remove the `pending-response-label`, if present.

Optionally, add a follow up label (`actionable-label`) to highlight that an action is required by the team.

## Inputs

| Input                    | Default                         | Required | Description                                                                                                                                                                                      |
| ------------------------ | ------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `github-token`           |                                 | true     | The GitHub token used to create an authenticated client                                                                                                                                          |
| `member-associations`    | `"OWNER, MEMBER, COLLABORATOR"` | false    | [Repository associations](https://docs.github.com/en/graphql/reference/enums#commentauthorassociation) that are considered part of the team. Separate multiple with commas (eg. "OWNER, MEMBER") |
| `pending-response-label` |                                 | true     | Label to remove indicating that a response is required for further action                                                                                                                        |
| `actionable-label`       |                                 | false    | Label added to highlight that a user has responded and a follow-up is required                                                                                                                   |

## Usage

You can use the action by referencing the v1 branch:

```yaml
name: pending-response
on: issue_comment

jobs:
  issue_commented:
    runs-on: ubuntu-latest
    steps:
      - uses: siegerts/pending-response@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          pending-response-label: pending-response
```

### Using a follow up label

```yaml
name: pending-response
on: issue_comment

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
