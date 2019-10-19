const { table } = require("table");
const { parser } = require("./cli/parser.js");
const client = require("./cli/httpClient.js");

const userInput = parser(process.argv);

/**
 * Depending on `userInput` the functions below
 * should be called.
 */
if (userInput && Object.keys(userInput).length) {
	if (userInput.isList) {

		return client.fetchReminders()
			.then(function ({ reminders }) {
				const uids = Object.keys(reminders);
				if (uids.length > 0) {
					const list = [
						["ID", "REMINDER", "DUE-DATE"]
					]

					for (let i = 0; i < uids.length; ++i) {
						list[i + 1] = [uids[i], reminders[uids[i]].task, new Date(reminders[uids[i]].time).toString()];
					}

					console.log(table(list));
					return;
				} else {
					console.log("Sorry, you haven't created any reminders :(");
					console.log("Run 'remindme --help' for usage.");
					return;
				}
			})
			.catch(function (err) {
				console.log(err);
				console.log("Uh oh! Something unexpected happened.");
			})
	}

	if (userInput.isPurge) {
		return; // @todo
	}

	if (userInput.deleteTask) {
		return; // @todo
	}

	return client.createReminder(userInput)
		.then(console.log)
		.catch(function (err) {
			console.log("Uh oh! Something unexpected happened.");
		});

} else {
	process.exit(1);
}