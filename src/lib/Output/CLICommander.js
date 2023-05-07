import { Command, Option, Argument } from 'commander';
import boxen from 'boxen';
import chalk from 'chalk';
import CLIPrompt from './CLIPrompt.js';
import GitCommands from '../Commands/GitCommands.js';

export default class CLICommander {

	constructor() {
		this.program = new Command();
		this.gitCommand = new GitCommands();
	}

	init() {
		const { program } = this;

		program
			.name(chalk.magenta('gcc'))
			.usage(chalk.magenta('summary? description? [options?] '))
			.description(
				boxen(
					chalk.greenBright("🤖 Git Conventional Commit the easy way"),
					{padding: 1, borderColor: 'green', dimBorder: true}) + "\n"
				)
			.version('1.0.0');

			program
				.command('sts')
				.description('Status of the local repository')
				.action(() => {
					this.gitCommand.getLocalStatus();
				});

			program
				.command('log')
				.description('Log of last commits')
				.action(() => {
					this.gitCommand.getCommitLog();
				});

			program
				.command('unt')
				.description('List of untracked files')
				.action(() => {
					this.gitCommand.getUntrackedFiles();
				});

			program
				.command('mod')
				.description('List of modified files')
				.action(() => {
					this.gitCommand.getChangedFiles();
				});

			program
				.command('rst')
				.description('Undo local changes to the repository using the reset comman | Possible types: h (hard), s (soft), m (mixed)')
				.addArgument(new Argument('<type>').choices(['h', 's', 'm']))
				.addArgument(new Argument('<hash-or-number>'))
				.action((type, hashOrNumber ) => {
					this.gitCommand.resetChanges(type, hashOrNumber);
				});

		program
			.addArgument(new Argument('[summary]', 'Summary of the current commit'))
			.addArgument(new Argument('[description]', 'Description of the current commit (Max-Length: 72 char)'))
			.addOption(new Option('-s, --scope <value>', 'Scope of type commit'))
			.addOption(new Option('-t, --type <value>', 'Conventional Type').choices(['feat', 'fix', 'style', 'refactor', 'test', 'docs', 'chore', 'perf']))
			.action((summary, description, options) => {
				new CLIPrompt(summary, description, options).run();
			});

		try {
			program.parse(process.argv);
		} catch (err) {
			process.exit(1);
		}
	}

}
