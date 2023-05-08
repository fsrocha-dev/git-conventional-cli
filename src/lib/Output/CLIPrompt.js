import inquirer from 'inquirer';
import MaxLengthInputPrompt from 'inquirer-maxlength-input-prompt'
import GitCommands from '../Commands/GitCommands.js';
import PrintTable from '../helpers/PrintTable.js';

export default class CLIPrompt {
	#summary;
	#description;
	#type;
	#scope;
	#prompts;

	constructor(summary, description, options) {
		this.#summary = summary;
		this.#description = description;
		this.#type = options.type;
		this.#scope = options.scope;
		this.registerPlugins();
		this.mountPrompts();
	}

	registerPlugins() {
		inquirer.registerPrompt('maxlength-input', MaxLengthInputPrompt)
	}

	mountPrompts() {
		this.#prompts = [
			{
				message: 'Commit type:',
				type: 'list',
				name: 'type',
				choices: [
						'feat: A new feature',
						'fix: A bug fix',
						'style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
						'refactor: A code change that neither fixes a bug nor adds a feature',
						'perf: A code change that improves performance',
						'test: Adding missing tests',
						'docs: Documentation only changes',
						'chore: Changes to the build process or auxiliary tools such as documentation generation',
						'ci: Changes to the CI configuration files',
						'build: Changes to the build system or auxiliary tools'
					]
			},
			{
				message: 'Commit scope: (press enter to skip)',
				type: 'maxlength-input',
				maxLength: 12,
				name: 'scope'
			},
			{
				message: 'Short commit description:',
				type: 'maxlength-input',
				maxLength: 50,
				name: 'summary',
				validate: function(summary)
        {
						if(!summary) {
							return 'Please summary is required';
						}
						return true
        }
			},
			{
				message: 'Long commit description: (press enter to skip)',
				type: 'maxlength-input',
				maxLength: 100,
				name: 'description'
			}
		]
	}

	getPrompts() {
		this.#summary ? removePrompt('summary') : null;
		this.#description ? removePrompt('description') : null;
		this.#type ? removePrompt('type') : null;
		this.#scope ? removePrompt('scope') : null;

		return this.#prompts
	}

	removePrompt(promptName) {
		const index = this.#prompts.findIndex((prompt) => prompt.name === promptName);
		if (index !== -1) {
			this.#prompts.splice(index, 1);
		}
	}

	async run() {
		try {
			const userInputs = await inquirer.prompt(this.getPrompts())
			const gitCommands = new GitCommands();
			gitCommands.gitPush(userInputs);
		}
		catch (error) {
			if (error.isTtyError) {
				new PrintTable().errorTable(error.status, error.message, 'TtyError');
			} else {
				new PrintTable().errorTable(error.status, error.message, 'Error');
			}
		};
	}
}
