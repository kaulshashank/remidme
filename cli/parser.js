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
	Correct Usage:

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

function isUID(uid) {
	if (typeof uid !== "string") return false;

	const segments = uid.split("-");
	return (
		segments.length === 4
		&& segments[0] === "RME"
		&& parseInt(segments[1]) >= 1000 && parseInt(segments[1]) <= 2000
		&& parseInt(segments[2]) >= 2000 && parseInt(segments[2]) <= 3000
		&& parseInt(segments[3]) >= 3000 && parseInt(segments[3]) <= 4000
	);
}

function getTimeString(argV, type, inOrAfterOrEveryIndex) {
	if (typeof inOrAfterOrEveryIndex === 'undefined') return undefined;


	const time = Number(argV[inOrAfterOrEveryIndex + 1]);

	let timeUnit;
	if (type === "interval") {
		if (!isNaN(time)) { // Plural unit
			timeUnit = argV[inOrAfterOrEveryIndex + 2];
		} else { // Singular unit
			timeUnit = argV[inOrAfterOrEveryIndex + 1];
		}
	} else {
		timeUnit = argV[inOrAfterOrEveryIndex + 2];
	}

	// NotANumber type validation. Should not proceed further if 
	// the time field could not be parsed to a valid number by Number();
	if (isNaN(time) && type !== "interval") return undefined;

	if (type === "timeout") {
		let msec = 0;
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
			default: return undefined;
		}

		return new Date(new Date().valueOf() + msec);
	} else if (type === "interval") {

		switch (timeUnit) {
			case 'hours':
				return `* 1 */${time} * * *`; // every x(=time) hours
			case 'hour':
				return `1 1 * * * *`; // every hour

			case 'minutes':
				return `1 */${time} * * * *`; // every x(=time) minutes
			case 'minute':
				return `1 * * * * *`; // every minute

			case 'seconds':
				return `*/${time} * * * * *`; // 
			case 'second':
				return `* * * * * *`;
			default: return undefined;
		}

	} else {
		return undefined;
	}

}

function parse(argV) {
	try {
		const helpIndex = argV.findIndex(val => ((val === "--help") || (val === "-h")));

		if (helpIndex !== -1) {
			console.log(HELP_MSG);
			return;
		}

		const listIndex = argV.findIndex(val => ((val === "--list") || val === "-l"));

		if (listIndex !== -1) {
			return { isList: true, isPurge: false, deleteTask: undefined };
		}

		const deleteIndex = argV.findIndex(val => val === "--delete");

		if (deleteIndex !== -1) {
			const possibleUID = argV[deleteIndex + 1];
			if (isUID(possibleUID)) {
				return { isList: false, isPurge: false, deleteTask: possibleUID };
			} else {
				console.log("Please enter a valid id.");
				return;
			}
		}

		// Index for 'in' or 'after' keywords
		const inOrAfterIndex = argV.findIndex(val => (val === 'in' || val === 'after'));
		const everyIndex = argV.findIndex(val => val === 'every');

		// Set type on the basis of the presence of 'every' determiner
		let type;
		if (everyIndex === -1) {
			type = 'timeout';
		} else {
			type = 'interval';
		}

		const time = getTimeString(
			argV
			, type
			, inOrAfterIndex !== -1 ? inOrAfterIndex
				: everyIndex !== -1 ? everyIndex : undefined);

		// Index for 'to' keyword
		const toIndex = argV.findIndex(val => (val === 'to'));

		let task = undefined;
		if (argV[toIndex + 1] === 'do') {
			task = argV[toIndex + 2];
		} else {
			task = argV[toIndex + 1];
		}

		if (typeof type === 'undefined' || typeof time === 'undefined' || typeof task === 'undefined') {
			console.log(HELP_MSG);
			return;
		}

		let isPurge = false; // @todo: Implement
		let deleteTask = undefined; // @todo: Implement

		const taskObj = { task, time, type, isPurge, deleteTask };

		return taskObj;
	} catch (err) {
		console.log("Unexpected error.");
		console.error(err);
		return;
	}
}

module.exports = { parser: parse, isUID };