<h1 align="center">
	<br>
	<br>
	<img width="320" src="https://github.com/fsrocha-dev/giteasly/blob/main/src/assets/icons/icon.png" alt="Git Conventional CLI">
	<br>
	<br>
	<br>
</h1>

> Git Conventional CLI

[![Version](https://badgen.net/npm/v/git-conventional-cli)](https://www.npmjs.com/package/git-conventional-cli)
[![License](https://badgen.net/npm/license/git-conventional-cli)](https://www.npmjs.com/package/git-conventional-cli)
[![npm dependents](https://badgen.net/npm/dependents/git-conventional-cli)](https://www.npmjs.com/package/git-conventional-cli?activeTab=dependents)

![](https://github.com/fsrocha-dev/git-conventional-cli/blob/main/media/screenshot.png)

<br>

---

<br>

## Features

- Easy install
- Follows the conventional commit guidelines
- Pretty prints preview in color
- Works globally or in your repository
- List of untracked and modified files easly
- Reset commit easly

## CLI Usage

### CLI Installation

| NPM                                                  | Yarn                                            |
| ---------------------------------------------------- | ----------------------------------------------- |
| <pre>npm install --global git-conventional-cli</pre> | <pre>yarn global add git-conventional-cli</pre> |

### CLI Quickstart

To quickstart runs above command and follow the instructions:

```shell
gcc
```

### CLI Helper

```text
gcc summary? description? [options?]

┌─────────────────────────────────────────────┐
│                                             │
│   🤖 Git Conventional Commit the easy way   │
│                                             │
└─────────────────────────────────────────────┘

Arguments:
  summary                      Summary of the current commit
  description                  Description of the current commit (Max-Length: 72 char)

Options:
  -V, --version                output the version number
  -s, --scope <value>          Scope of type commit
  -t, --type <value>           Conventional Type (choices: "feat", "fix", "style", "refactor", "test", "docs", "chore", "perf")
  -h, --help                   display help for command

Commands:
  log                          Log of last commits
  unt                          List of untracked files
  mod                          List of modified files
  rst <type> <hash-or-number>  Undo local changes to the repository using the reset comman | Possible types: h (hard), s (soft), m (mixed)
```

### CLI Inline use

Inline example usage:

```shell
gcc -t "fix" -s "user" "this sumary of commit" "this a description of the commit"
```

## Contributing

Contribute by opening a pull request. Also, if your pull request contains patches or new features, you must include relevant unit tests.

## Maintainers

- [Frank Rocha](https://github.com/fsrocha-dev)
