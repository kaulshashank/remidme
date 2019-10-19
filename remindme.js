const { table } = require("table");
const { parser } = require("./cli/parser.js");
const client = require("./cli/httpClient.js");

const userInput = parser(process.argv);

/**
 * Depending on `userInput` the functions below
 * should be called.
 */
if (userInput && Object.keys(userInput).length) {

	function catchHandler(err) {
		if (err.code === "ECONNREFUSED") {
			console.log("Uh Oh! The remindme service is not running.")
		} else {
			console.log("Oops! Something unexpected unexpected happened!")
		}
	}

	if (userInput.isList) {

		return client.fetchReminders()
			.then(function ({ reminders }) {
				const uids = Object.keys(reminders);
				if (uids.length > 0) {
					const list = [
						["ID", "REMINDER", "DUE-DATE"]
					]

					for (let i = 0; i < uids.length; ++i) {
						if(reminders[uids[i]].type === "timeout") 
							list[i + 1] = [uids[i], reminders[uids[i]].task, new Date(reminders[uids[i]].time).toString()];
						else
							list[i + 1] = [uids[i], reminders[uids[i]].task, reminders[uids[i]].time];
					}

					console.log(table(list));
					return;
				} else {
					console.log("Sorry, you haven't created any reminders :(");
					console.log("'remindme --help' for usage.");
					return;
				}
			})
			.catch(catchHandler);
	}

	if (userInput.isPurge) {
		return; // @todo
	}

	if (userInput.deleteTask) {
		return client.deleteReminder(userInput.deleteTask)
			.catch(catchHandler);
	}

	return client.createReminder(userInput)
		.then(console.log)
		.catch(catchHandler);

} else {
	process.exit(1);
}