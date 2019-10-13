/**
 * RemindMe command-line argument parser
 * @description This module parses `process.argv` to extract required data
 * to pass to the notifier module. 
 * 
 * The parser validates user input to output an object of the form:
 * {
 *  task (string): Title of the reminder to issue to the user in a notification.
 *  time (number): Duration after which to schedule the required task.
 *  type (interval | timeout): interval -> The task of this type needs to be scheduled repeatedly after the specified time interval
 *                             timeout -> The task of this type will be scheduled to execute once after the specified time interval
 * 	isPurge (boolean): Flag that decides whether to remove all scheduled reminders. Defaults to false.
 * 	deleteTask (string): Contains the task id to delete. Defaults to undefined.
 * }
 * 
 * The parser also validates user input incase something unexpected is entered. 
 * If invalid input is encountered it will log the help text and exit with a non-zero code. 
 */

const SECOND = 1000; // in ms.
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const HELP_MSG = `
	Usage: 
	
	remindme to do <task name> in/after/every <duration> <duration unit>
	remindme to <task name> in/after/every <duration> <duration unit>
	remindme in/after/every <duration> <duration unit> to do <task name>
	remindme in/after/every <duration> <duration unit> to <task name>

	remindme [OPTION]

	Options:

	"--help" or "-h": View this message again.
	"--list" or "-l": List all pending and scheduled reminders along with their task ids.
	"--delete <task id>": Removes a scheduled reminder.
	"--purge": Removes all scheduled reminders.
`; // @todo: Improve this message with examples.

function getTimeInMS(argV, inOrAfterIndex) {
	if (typeof inOrAfterIndex === 'undefined') return undefined;

	let msec = 0;
	const time = Number(argV[inOrAfterIndex + 1]);
	const timeUnit = argV[inOrAfterIndex + 2];

	// NotANumber type validation. Should not proceed further if 
	// the time field could not be parsed to a valid number by Number();
	if (isNaN(time)) return undefined;

	switch (timeUnit) {
		case 'hours':
		case 'hour':
			msec = time * HOUR;
			break;
		case 'minutes':
		case 'minute':
			msec = time * MINUTE;
			break;
		case 'seconds':
		case 'second':
			msec = time * SECOND;
			break;
		default: msec = undefined; break;
	}

	return msec;
}

function parse(argV) {
	try {
		const helpIndex = argV.findIndex(function (val) {
			return ((val === "--help") || (val === "-h"));
		});

		if (helpIndex !== -1) {
			console.log(HELP_MSG);
			process.exit(0); // exit with zero code for succesful execution
			return;
		}

		// Index for 'in' or 'after' keywords
		const inOrAfterIndex = argV.findIndex(function (val) {
			return (val === 'in' || val === 'after');
		});

		// Index for 'to' keyword
		const toIndex = argV.findIndex(function (val) {
			return (val === 'to');
		})

		const time = getTimeInMS(argV, inOrAfterIndex);

		let task = undefined;
		if (argV[toIndex + 1] === 'do') {
			task = argV[toIndex + 2];
		} else {
			task = argV[toIndex + 1];
		}

		if (inOrAfterIndex === -1 || typeof time === 'undefined' || typeof task === 'undefined') {
			console.log('Incorrect usage.\n');
			console.log(HELP_MSG);
			process.exit(1); // exit with non-zero code for runtime error
			return;
		}

		// Set type on the basis of the presence of 'every' determiner
		if (argV[inOrAfterIndex + 1] === 'every') {
			type = 'interval';
		} else {
			type = 'timeout';
		}

		let isPurge = false; // @todo: Implement
		let deleteTask = undefined; // @todo: Implement

		const taskObj = { task, time, type, isPurge, deleteTask };

		return taskObj;
	} catch (err) {
		console.log("Unexpected error");
		console.error(err);
		process.exit(1); // exit with non-zero code for runtime error
	}
}

module.exports = parse;