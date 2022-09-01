# Run If

A simple cross-platform solution to conditionally execute package.json scripts based on the value of an environment variable.

## Installation

`npm install --save-dev run-if-env`

`yarn add -D run-if-dev`

If you prefer not installing the dependency, you can execute the script using `npx` or `yarn dlx`

`npx run-if-dev ...args`

## Basic Usage

The most common example to use this tool is to run a script only on a specific enviroment. For that, you will declare a package.json script like the following:

**Package.json**

```json
{
	"scripts": {
		"script": "...",
		"postscript": "npx run-if-env --is production && your_prod_script"
	}
}
```

**Environment file `.env`**

```text
NODE_ENV=development
ANOTHER_ENV=value
...
```

Using the script like this will take the value of the `NODE_ENV` env var that is set on the .env file generated at the root of your project. this is specially usefull in cases where the env file generation is done asynchronously or during the CI/CD process and env vars have different values depending on the environment they are being deployed.

You can also target custom env vars providing its key as the first argument. More info bellow.

In this example, the execution of `your_prod_script` will not happen as the NODE_ENV is set to development and the argument `--only` is set for production.

## Available arguments

Currently, the script accepts the following arguments:

```text
Usage: <command> [TARGET_ENV_VAR] [...args]

Options:
  [TARGET_ENV_VAR]               Custom target env var (fallbacks to NODE_ENV if empty)
  --is   [env1]                  Single env where a script should run
  --not  [env1,env2,env3]        Comma separated envs where a script should not run
  --file [path]                  Custom env file path (default path: ./.env)
  --silent                       Suppresses all logs generated by the script.
```

### Asynchronous env file support

The script supports reading from asynchronous `.env` files. Instead of using a `.env` file, include the `--file` argument with the path to a `.js`
file that exports either an object or a `Promise` resolving to an object (`{ ENV_VAR_NAME: value, ... }`).

## env File Formats

These are the currently accepted environment file formats. If any other formats are desired please create an issue.

- `.env` as `key=value`. This is the default if `--file` is not provided.
- `.env.json` Key/value pairs as JSON
- `.env.js` JavaScript file exporting an `object` or a `Promise` that resolves to an `object`

## Path Rules

This lib attempts to follow standard `bash` path rules. The rules are as followed:

Home Directory = `/Users/test`

Working Directory = `/Users/test/Development/app`

| Type                     | Input Path                                             | Expanded Path                                        |
| ------------------------ | ------------------------------------------------------ | ---------------------------------------------------- |
| Absolute                 | `/some/absolute/path.env`                              | `/some/absolute/path.env`                            |
| Home Directory with `~`  | `~/starts/on/homedir/path.env`                         | `/Users/test/starts/on/homedir/path.env`             |
| Relative                 | `./some/relative/path.env` or `some/relative/path.env` | `/Users/test/Development/app/some/relative/path.env` |
| Relative with parent dir | `../some/relative/path.env`                            | `/Users/test/Development/some/relative/path.env`     |

## Examples

```json
{
	"scripts": {
		"arg-is:example": "npx run-if-env PROYECT_VAR --is true && ...",
		"arg-not:example": "npx run-if-env --not development,qa && ... ",
		"arg-file:example": "npx run-if-env PROYECT_VAR --file ../custom-path/.env --is false && ..."
	}
}
```

## Related Projects

[`env-cmd`](https://github.com/toddbluhm/env-cmd). The script uses env-cmd under the hood to get the desired values from env files.

## Contributing

Before opening a pull request, make sure you have provided a detailed description of the bug or feature you would like to see implemented. Based on this, a pull requests can be opened. All pull request should provide its corresponding unit test to be accepted.
