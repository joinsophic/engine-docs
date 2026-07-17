---
name: git-branch
description: Branch conventions for documentation changes. Use when creating or checking out a branch.
---

# Documentation branches

This skill is adapted from the sibling backend repository's `git-branch` skill.

## Automation branches

When the production workflow or agent payload provides a `branch`, validate that it:

- Starts with `automation/api-docs-`.
- Matches `automation/api-docs-[0-9a-f]{8}` for deploy-driven updates.
- Contains only letters, digits, `/`, `_`, `-`, and `.`.
- Exists on `origin`.

Fetch and check out that exact branch. Do not create a different branch, rebase it, or force-push it. The production sync workflow owns the branch and may already have committed generated artifacts to it.

## Other branches

For unrelated documentation work, branch from the latest `origin/main`, use a short kebab-case name, and keep one logical concern per branch.
