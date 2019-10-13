const { expect } = require("chai");
const nock = require("nock");

const client = require("./httpClient.js");
const BASE_URL = "http://localhost:80";
const SECOND = 1000; // in ms.
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

describe("HTTP Client", function () {

	let TASK_ID;

	it("Create a reminder succesfully", function (done) {

		nock(BASE_URL)
			.post("/reminder")
			.reply(200, {
				taskId: "I'm a fake task id!"
			});

		const taskObj = { task: "Drink water", type: "timeout", duration: MINUTE };
		client.createReminder(taskObj)
			.then(function (result) {
				expect(result).to.exist;
				expect(result).to.have.property("taskId").to.exist;
				TASK_ID = result.taskId;
				done();
			})
			.catch(done);
	});

	it("Fetch all reminders succesfully", function (done) {

		nock(BASE_URL)
			.get("/reminder")
			.reply(200, {
				reminders: [
					{
						id: "I'm a fake task id!",
						type: "timeout",
						duration: 60 * 60,
						task: "I'm a fake task title!"
					}
				]
			});

		client.fetchReminders()
			.then(function (result) {
				expect(result).to.exist;
				expect(result).to.have.property("reminders").to.be.an("array");
				done();
			})
			.catch(done);
	});

	it("Delete a reminder succesfully", function (done) {

		nock(BASE_URL)
			.delete("/reminder")
			.reply(200, {});

		client.deleteReminder(TASK_ID)
			.then(function (result) {
				expect(result).to.not.exist;
				done();
			})
			.catch(done);
	});
});