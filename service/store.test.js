const { assert } = require('chai');
const fs = require("fs");

const store = require("./store");

describe('JSON Store', function () {
	let UID_FOR_TEST;
	it("Store should get created on require of module", function () {
		const currentStore = store.readFromStore();
		assert((typeof currentStore === "object" && currentStore !== null), "No empty store was created");
	});

	it("Write something to store", function (done) {
		const fakeNotification = {
			type: "timeout",
			task: "Reminder",
			time: 69696969
		};
		store.writeToStore(fakeNotification)
			.then(function (UID) {
				assert(typeof UID === "string", "Invalid UID returned");
				UID_FOR_TEST = UID;
				done();
			})
			.catch(done);
	});

	it("Read UID from store", function () {
		const obj = store.readFromStore(UID_FOR_TEST)
		assert(typeof obj === 'object' && obj !== null, "Not available in store");
		assert(obj.task === "Reminder", "Wrong reminder object returned");
	});

	after("Delete test store", function () {
		fs.unlinkSync(process.env.REMINDME_STORE_LOC);
	})
});