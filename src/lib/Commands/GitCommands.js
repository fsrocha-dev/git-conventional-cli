import { execSync } from 'child_process';
import PrintTable from '../hepers/PrintTable.js';
import chalk from 'chalk';

export default class GitCommands {
	#print = new PrintTable()

	#PRIMARY_COLOR = '#D19A66';
	#SECONDARY_COLOR = '#E06C75';
	#GREEN_COLOR = '#71C6B1';

	gitPush({ type, scope, summary, description}) {
		let completeSummaryCommit = ''
		let descriptionCommit = ''

		if (type) completeSummaryCommit += `${type.split(':')[0]}`;
		if (scope) completeSummaryCommit += `(${scope})`;
		if (summary) completeSummaryCommit += `: ${summary}`;
		if(description) descriptionCommit += `-m "${description}"`;

		const output = this.gitExecCommand(`git add . && git commit -m "${completeSummaryCommit}" ${descriptionCommit} && git push`);

		this.#print.successTable(chalk.hex(this.#PRIMARY_COLOR)('Commit successfully'), this.#formatSuccessCommitOutput(output));
	}

	resetChanges(type, hashOrNumber) {
		const types = {
			h: '--hard',
			s: '--soft',
			m: '--mixed'
		}
		const prefix = isNaN(hashOrNumber) ? '' : 'HEAD~'

		const output = this.gitExecCommand(`git reset ${types[type]} ${prefix + hashOrNumber}`);

		const title = chalk.hex(this.#GREEN_COLOR)("Reset successfully");

		this.#print.successTable(title, this.#formatResetSuccessOperation(output, types[type]));
	}

	getCommitLog() {
		const gitLogCommandOutput = this.gitExecCommand('git log --format=format:"%h | %aN%Creset | %s"');

		const head = [
			chalk.hex(this.#PRIMARY_COLOR)("Commit Hash"),
			chalk.hex(this.#PRIMARY_COLOR)("Author"),
			chalk.hex(this.#PRIMARY_COLOR)("Summary")
		]

		const rows = gitLogCommandOutput.map((line) => {
			let [hash, author, summary ] = line.split(' | ')
			return [chalk.hex(this.#PRIMARY_COLOR)(hash), author, summary]
		})

		this.#print.table(head, rows)
	}

	getChangedFiles() {
		const output = this.gitExecCommand('git diff --name-only');
		const head = [chalk.hex(this.#SECONDARY_COLOR)("Modified Files")]
		const changedFiles = output.map(line => [line])

		const hasChangedFiles = changedFiles.length > 0

		this.#print.table(head, hasChangedFiles ? changedFiles : [['No modified files']])

		return hasChangedFiles ? true : false
	}

	getUntrackedFiles() {
		const output = this.gitExecCommand('git ls-files --others --exclude-standard');
		const head = [chalk.hex(this.#SECONDARY_COLOR)("Untracked Files")]
		const untrackedFiles = output.map(line => [line])

		const hasUntrackedFiles = untrackedFiles.length > 0

		this.#print.table(head, hasUntrackedFiles ? untrackedFiles : [['No untracked files']])

		return hasUntrackedFiles ? true : false
	}

	gitExecCommand(command) {
			const output = execSync(command).toString();
			return output.split('\n').filter(Boolean);
	}

	#formatSuccessCommitOutput(output) {
		const regex = /^\s*\[([^\]]+)\]\s*([^ ]+ [^ ]+)(.*)/;
		const match = regex.exec(output[0]);
		const [branch = ': (', hash = 'xxxx'] = match[1].split(' ');
		const summary = match[2] + match[3];

		const [changed = '0 changed', insertion = '0 insertion', deletion = '0 deletion'] = output[1].split(',')

		return [
			{ Branch: [branch] },
			{ Hash: [hash] },
			{ Summary: [summary] },
			{ Changed: [changed] },
			{ Insertion: [insertion] },
			{ Deletion: [deletion]},
		]

	}

	#formatResetSuccessOperation(output, type) {
		const regex = /(\b\w{7}\b)(.*)/;
		const [, hash, commitSummary] = output.match(regex);

		return [
			[chalk.hex(this.#GREEN_COLOR)('Type:'), type],
			[chalk.hex(this.#GREEN_COLOR)('Current HEAD:'), hash],
			[chalk.hex(this.#GREEN_COLOR)('Commit Summary:'), commitSummary.trim()]
		]
	}

}
