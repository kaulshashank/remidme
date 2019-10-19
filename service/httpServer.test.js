const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const server = require("./httpServer.js");

const SECOND = 1000; // in ms.
const MINUTE = 60 * SECOND;

describe("HTTP Server", function () {
	let APP;
	before("Start notifications server", function (done) {
		server()
			.then((app) => {
				APP = app;
				done();
			})
			.catch(done);
	});

	let TASK_ID;

	it("Create a reminder (POST /reminder)", function (done) {
		chai.request(APP)
			.post(`/reminder`)
			.send({ task: "Drink water", type: "timeout", duration: MINUTE })
			.then(function (res) {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property("taskId").to.be.a("string");
				TASK_ID = res.body.taskId;
				done();
			})
			.catch(done);
	});

	it("Fetch all reminders (GET /reminder)", function (done) {
		chai.request(APP)
			.get(`/reminder`)
			.then(function (res) {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property("reminders").to.be.an("object");
				done();
			})
			.catch(done);
	});

	it("Delete a reminder (DELETE /reminder)", function (done) {
		chai.request(APP)
			.delete(`/reminder`)
			.send({ taskId: TASK_ID })
			.then(function (res) {
				expect(res).to.have.status(200);
				done();
			})
			.catch(done);
	});
});