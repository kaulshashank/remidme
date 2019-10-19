const { expect, assert } = require("chai");
const nock = require("nock");

const client = require("./httpClient.js");
const { isUID } = require("./parser.js");

const BASE_URL = "http://localhost:3000";
const SECOND = 1000; // in ms.
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

const FAKE_TASK_ID = "RME-1000-2000-3000";

describe("HTTP Client", function () {
	this.timeout(40000);
	let TASK_ID;

	it("Create a reminder succesfully", function (done) {

		nock(BASE_URL)
			.post("/reminder")
			.reply(200, {
				taskId: FAKE_TASK_ID
			});

		const taskObj = { task: "Drink water", type: "timeout", time: MINUTE };
		client.createReminder(taskObj)
			.then(function (taskId) {
				expect(taskId).to.exist;
				assert(isUID(taskId), "Not a valid uid.")
				TASK_ID = taskId.taskId;
				done();
			})
			.catch(done);
	});

	it("Fetch all reminders succesfully", function (done) {

		nock(BASE_URL)
			.get("/reminder")
			.reply(200, {
				reminders: {
					[FAKE_TASK_ID]: {
						task: "Drink water!",
						type: "interval",
						duration: "* */30 * * * *"
					}
				}
			});

		client.fetchReminders()
			.then(function (result) {
				expect(result).to.exist;
				expect(result).to.have.property("reminders").to.be.an("object");
				expect(result.reminders).to.be.an("object").to.have.property(FAKE_TASK_ID)
				expect(result.reminders[FAKE_TASK_ID]).to.have.property("task").to.exist;
				expect(result.reminders[FAKE_TASK_ID]).to.have.property("type").to.exist;
				expect(result.reminders[FAKE_TASK_ID]).to.have.property("duration").to.exist;
				done();
			})
			.catch(done);
	});

	it("Delete a reminder succesfully", function (done) {

		nock(BASE_URL)
			.delete("/reminder")
			.reply(200, "");

		client.deleteReminder(TASK_ID)
			.then(function (result) {
				expect(result).to.eq("");
				done();
			})
			.catch(done);
	});
});