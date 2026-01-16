# Enforcing Merge Request Approval in GitLab Free Using `.gitlab-ci.yml`

Before I show how I implemented approval verification for Merge Requests (MR), I want to point out that this solution does **not** significantly improve merge security, as all CI settings remain open to developers.  
Therefore, this approach is more about raising awareness — reminding the developer that approval is required before the merge proceeds.

## 1. Creating an Access Token:
Go to *Preferences* via the user context menu.
Go to *Access tokens*.
Add the only permission allowed for this token: [✔] `read_api`

## 2. Add the Token as a Variable in Group/Project
Add the generated token as a group or project variable. In the example, the variable name is `${GITLAB_TOKEN}`, though the exact name is not critical.

**Important!** Make sure to *protect* the variable, and most likely, you'll want it to be available only for protected branches.

Below is a simple `validate` stage implementation in `gitlab-ci.yml` that checks for an approval status.

## 3. `gitlab-ci.yml`

```yaml
stages:
  - validate

check_mr_approvals:
  stage: validate
  image: curlimages/curl:latest
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
  script: |
    echo "CI_PIPELINE_SOURCE: $CI_PIPELINE_SOURCE"
    echo "CI_MERGE_REQUEST_IID: ${CI_MERGE_REQUEST_IID:-N/A}"
    echo "CI_PROJECT_ID: ${CI_PROJECT_ID:-N/A}"
    echo "GITLAB_TOKEN length: ${#GITLAB_TOKEN}"

    echo "Fetching approvals from GitLab API..."
    approvals_response=$(curl --silent --show-error --fail --location \
      --header "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
      "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests/${CI_MERGE_REQUEST_IID}/approvals")
    if [ $? -ne 0 ]; then
      echo "Error while querying the API. Check GITLAB_TOKEN and API access."
      exit 1
    fi

    echo "Approvals API Response:"
    echo "$approvals_response"

    approved=$(echo "$approvals_response" | grep -o '"approved":\(true\|false\)' | grep -o 'true\|false')
    if [ -z "$approved" ]; then
      echo "Could not extract approval status. Unexpected response format."
      exit 1
    fi

    if [ "$approved" != "true" ]; then
      echo "Merge Request not approved. Approved status: $approved"
      exit 1
    fi

    echo "Merge Request is approved — proceeding."
  allow_failure: false
```
## 4. What JSON Does the Process Receive?

The process above receives the following JSON from the GitLab API:

```json
{
  "user_has_approved": true,
  "user_can_approve": false,
  "approved": true,
  "approved_by": [
    {
      "user": {
        "id": 1,
        "username": "username",
        "name": "Full name",
        "state": "active",
        "locked": false,
        "avatar_url": "https://gitlab.domainname.org/uploads/-/system/user/avatar/1/avatar.png",
        "web_url": "https://gitlab.domainname.org/levitsky"
      }
    }
  ]
}
```

Since the author of the MR might also have the ability to approve their own changes, I recommend improving this logic to:
* Read the approved_by array
* Ensure that at least two different users have approved the MR
* Mark the stage as successful only if the condition is met.

Good luck and thanks for reading!

*P.S. If you have more interesting or secure implementations of this functionality, please share them in the comments or suggest changes/improvements to this material.*