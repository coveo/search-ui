# AGENTS.md

Authoritative guidance for AI coding agents working in `coveo/search-ui`.

## Environment Prerequisites

- **Node.js version**: Defined in `.nvmrc`. Use `nvm use` or install the matching version manually.
- **Package manager**: npm (bundled with Node). Do not use Yarn.
- **Browser binaries**: The `puppeteer` npm package (installed by `npm ci`) bundles a compatible Chromium binary. No separate browser installation is required for unit or accessibility tests.
- **Linter**: This repository does not have a linter or formatter configured. There is no eslint, prettier, or equivalent enforced in CI. Follow existing code style.

## Setup

```bash
nvm use            # activates the Node version from .nvmrc
npm ci             # clean-installs all dependencies (including puppeteer/Chromium)
```

## Validation Commands

| Command                           | Description                                                                 |
| --------------------------------- | --------------------------------------------------------------------------- |
| `npm run build`                   | Build the entire project (CSS, templates, TypeScript compilation, bundling) |
| `npm test`                        | Run unit tests in ChromeHeadless via Karma                                  |
| `npm run accessibilityTests`      | Run accessibility tests using Axe core in ChromeHeadless (via Puppeteer)    |
| `npm run validateTypeDefinitions` | Validate generated TypeScript declaration files                             |

## Project Directory Structure

| Directory            | Role                                                                    |
| -------------------- | ----------------------------------------------------------------------- |
| `src/`               | Application source code (TypeScript components, utilities, SCSS styles) |
| `unitTests/`         | Karma-based unit test specs (mirrors `src/` structure)                  |
| `accessibilityTest/` | Axe-core accessibility test specs run in ChromeHeadless                 |
| `playwright/`        | Playwright end-to-end test suite (separate `package.json` and config)   |
| `gulpTasks/`         | Gulp task definitions used by the build system                          |
| `docs/`              | Generated API documentation output                                      |
| `pages/`             | Hosted demo/playground pages                                            |

## Known Limitations

### Expected Non-Fatal Build Warnings

The build (`npm run build`) emits several known deprecation warnings that do **not** indicate a failure:

| Warning Category                      | Example Message                                        |
| ------------------------------------- | ------------------------------------------------------ |
| Deprecated Node `http_parser` access  | `DEP0066: OutgoingMessage.prototype._headers`          |
| Old Webpack/loader behavior           | `[DEP_WEBPACK_…]` deprecation notices from loaders     |
| Dart Sass slash-division deprecations | `Deprecation: Using / for division outside of calc()…` |

These warnings are expected during a successful build and do not require corrective action. A build is successful when it exits with code 0, regardless of these warnings.

> **Important:** Do not attempt opportunistic toolchain upgrades (Webpack, Gulp, Dart Sass, or Node API replacements) to silence these warnings without a dedicated Jira ticket approved for that work.

If you encounter a build warning **not** listed above, treat it as a potential issue and report it to the team rather than suppressing or ignoring it.

## Commit Conventions

Commit messages use **conventional commit** prefixes followed by a colon and short description:

| Prefix     | Use for                                      |
| ---------- | -------------------------------------------- |
| `feat`     | New features or user-facing behaviour change |
| `fix`      | Bug fixes                                    |
| `chore`    | Dependency updates, tooling, CI changes      |
| `docs`     | Documentation-only changes                   |
| `refactor` | Code restructuring with no behaviour change  |

A Jira key **must** appear in the branch name. The commit-msg hook (`hooks/commit-msg.js`) automatically appends the Jira issue URL to each commit. Recognized Jira project prefixes: `KIT-*`, `DT-*`, `DOC-*`, `JSUI-*`.

**Example commit message** (after hook appends URL):

```
fix: resolve facet reset on empty query

https://coveord.atlassian.net/browse/KIT-123
```

## PR Workflow

### Branch Naming

```
<prefix>/<JIRA-KEY>-<short-description>
```

Examples: `fix/KIT-123-facet-reset`, `feat/DT-456-new-sort-criteria`

### CI Checks Required Before Merge

1. `npm run build` — Full project build
2. `npm test` — Unit tests in ChromeHeadless via Karma

### Reviewer Approvals

A minimum of **1 reviewer approval** is required before a PR can be merged.

## Work Intake

| Project Key | Area                                          |
| ----------- | --------------------------------------------- |
| `KIT`       | Default project for features, tasks, and bugs |
| `JSUI`      | Previous project. Now archived. Do not use.   |
| `DT`        | Developer tooling and infrastructure          |
| `DOC`       | Documentation tasks                           |
