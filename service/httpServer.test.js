const chai = require("chai");
const { expect } = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const server = require("./httpServer.js");

const BASE_URL = "http://localhost:80";
const SECOND = 1000; // in ms.
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

describe("HTTP Server", function () {
	before("Start notifications server", function (done) {
		server()
			.then(() => done())
			.catch(done);
	});

	let TASK_ID;

	it("Create a reminder (POST /reminder)", function (done) {
		chai.post(`${BASE_URL}/reminder`)
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
		chai.get(`${BASE_URL}/reminder`)
			.then(function (res) {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property("reminders").to.be.an("array");
				done();
			})
			.catch(done);
	});

	it("Delete a reminder (DELETE /reminder)", function (done) {
		chai.delete(`${BASE_URL}/reminder`)
			.send({ taskId: TASK_ID })
			.then(function (res) {
				expect(res).to.have.status(200);
				done();
			})
			.catch(done);
	});
});