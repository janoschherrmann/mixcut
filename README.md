# Mixcut

## Local setup and installation

In order to start working on this project, clone it to your local machine and run `npm install` to install all dependencies. You can then run `npm run dev` in order to start up the project on your machine.

## How to contribute

To work on a new feature, create a new branch from `main`, with `git switch -c [your-branch-name]`. From there, you can use regular Git workflows to save your work and push it back to the remote repository. Please be aware that pushing directly to `main` is not allowed, in order to make sure that we don't break our production app. If you want to merge your changes back into `main`, please open up a pull request. After your code is reviewed and all checks run through smoothly, you're ready to merge.

## Semantic Merge Requests

Format: <type>(<scope>): <subject>
<scope> is optional

Example

```feat: add hat wobble
^--^ ^------------^
| |
| +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

More Examples:

build: (dev changes related to the build system (involving scripts, configurations or tools) and package dependencies)
ci: (dev changes related to the continuous integration and deployment system - involving scripts, configurations or tools)
chore: (updating grunt tasks etc; no production code change)
docs: (doc changes to the documentation)
feat: (prod changes related to new backward-compatible abilities or functionality.)
fix: (prod changes related to backward-compatible bug fixes)
perf: (prod changes related o backward-compatible performance improvements)
refactor: (dev changes related to modifying the codebase, which neither adds a feature nor fixes a bug - e.g removing redundant code, renaming variables)
revert:
test: (dev changes related to tests - e.g. refactoring existing tests or adding new tests.)
