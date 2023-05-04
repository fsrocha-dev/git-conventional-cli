import { execSync } from 'child_process';
import PrintTable from '../hepers/PrintTable.js';
import chalk from 'chalk';

export default class GitCommands {
	#print = new PrintTable()

	#PRIMARY_COLOR = '#D19A66';
	#SECONDARY_COLOR = '#E06C75';

	gitPush({ type, scope, summary, description}) {
		let completeSummaryCommit = ''
		let descriptionCommit = ''

		if (type) completeSummaryCommit += `${type.split(':')[0]}`;
		if (scope) completeSummaryCommit += `(${scope})`;
		if (summary) completeSummaryCommit += `: ${summary}`;
		if(description) descriptionCommit += `-m "${description}"`;

		const output = this.gitExecCommand(`git add . && git commit -m "${completeSummaryCommit}" ${descriptionCommit} && git push`);
		this.#print.success('Commit successfully', this.formatSuccessCommitOutput(output));
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
		this.#print.table(head, output.map(line => [line]))

		return output.length > 0 ? true : false
	}

	getUntrackedFiles() {
		const output = this.gitExecCommand('git ls-files --others --exclude-standard');
		const head = [chalk.hex(this.#SECONDARY_COLOR)("Untracked Files")]
		this.#print.table(head, output.map(line => [line]))

		return output.length > 0 ? true : false
	}

	gitExecCommand(command) {
		try {
			const output = execSync(command).toString();
			return output.split('\n').filter(Boolean);
		} catch (error) {
			this.#print.errorTable(error.status, error.message)
		}
	}

	formatSuccessCommitOutput(output) {
		const regex = /^\s*\[([^\]]+)\]\s*([^ ]+ [^ ]+)(.*)/;
		const match = regex.exec(output[0]);
		const [branch, hash] = match[1].split(' ');
		const summary = match[2] + match[3];

		const [changed, insertion, deletion] = output[1].split(',')

		return [
			{ Branch: [branch] },
			{ 'Commit Hash': [hash] },
			{ Summary: [summary] },
			{ 'Changed': [changed] },
			{ 'Insertion': [insertion] },
			{ 'Deletion': [deletion] },
		]

	}

}
