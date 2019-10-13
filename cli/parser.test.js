const { assert } = require('chai');

const parser = require("./parser");

const SECOND = 1000; // in ms.
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

describe('Parser', function () {
	it("'to do' before duration with plural duration unit", function () {
		const fakeArgV = [
			"/path/to/node/binary",
			"/path/to/script",
			"to",
			"do",
			"shopping",
			"in",
			"2",
			"hours"
		];

		const taskObject = parser(fakeArgV);

		assert(!!taskObject.task, "Task field does not exist.");
		assert(!!taskObject.time, "Time field does not exist.");
		assert(!!taskObject.type, "Type field does not exist.");

		assert(taskObject.task === "shopping", "Invalid task field.");
		assert(taskObject.type === "timeout", "Invalid type field.");
		assert(taskObject.time === (2 * HOUR), "Invalid time field.");
	});

	it("'to' before duration with singular duration unit", function () {
		const fakeArgV = [
			"/path/to/node/binary",
			"/path/to/script",
			"to",
			"shopping",
			"in",
			"1",
			"hour"
		];

		const taskObject = parser(fakeArgV);

		assert(!!taskObject.task, "Task field does not exist.");
		assert(!!taskObject.time, "Time field does not exist.");
		assert(!!taskObject.type, "Type field does not exist.");

		assert(taskObject.task === "shopping", "Invalid task field.");
		assert(taskObject.type === "timeout", "Invalid type field.");
		assert(taskObject.time === (1 * HOUR), "Invalid time field.");
	});
});