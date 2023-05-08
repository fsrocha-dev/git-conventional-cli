import Table from 'cli-table'

export default class PrintTable {
	#tableParams

	table(head, rows) {
		this.#tableParams = {
			head,
			chars: { 'top': '═', 'bottom': '═' },
			rows
		}
		this.print()
	}

	errorTable(status, message, title = 'Git Error') {
		this.#tableParams = {
			head: ['', ` ${title} `],
			chars: { 'top': '═', 'bottom': '═' },
			rows: [
				{ Status: [status] },
				{ Message: [message] }
			]
		}
		this.print()
	}

	successTable(title, rows) {
		this.#tableParams = {
			head: ['', ` ${title} `],
			chars: { 'top': '═', 'bottom': '═' },
			rows
		}
		this.print()
	}

	print() {
		console.log(new Table(this.#tableParams).toString())
	}
}
