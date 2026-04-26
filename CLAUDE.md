@AGENTS.md

# Commit & Deploy Workflow

After making code changes, **commit and push to `origin/main` automatically** — no confirmation needed.

## Default behavior
1. Stage the changed files, commit with a clear descriptive message, and push.
2. Commit message format: short imperative phrase summarizing what changed (e.g. "Remove Ivins/Hurricane from hero and itinerary copy").
3. After pushing, report:
   - Commit SHA
   - Commit message
   - One-line summary of what was deployed
   - Reminder that Vercel will auto-deploy from main

## Exceptions — ask before committing if the change:
- Touches `src/proxy.ts`, `src/app/api/login/`, or anything involving auth, cookies, or environment variables
- Modifies `package.json` dependencies
- Deletes files
- Is uncertain or experimental in nature
