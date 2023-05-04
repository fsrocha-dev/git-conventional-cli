import Table from 'cli-table';
export default function PrintTable(head, rows) {
	console.log(new Table({
		head,
		chars: { 'top': '═', 'bottom': '═' },
		rows
	}).toString());
}
