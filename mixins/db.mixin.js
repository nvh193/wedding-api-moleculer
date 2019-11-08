"use strict";

const DbService = require("moleculer-db");

//process.env.MONGO_URI = "mongodb://localhost/conduit";

module.exports = function(collection) {
	// Mongo adapter
	const MongoAdapter = require("moleculer-db-adapter-mongoose");

	return {
		mixins: [DbService],
		adapter: new MongoAdapter("mongodb://localhost/wedding"),
		model: collection
	};
};
