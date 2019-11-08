"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema(
	{
		name: {
			type: String,
			trim: true
		},
		phone: {
			type: String,
			trim: true
		},
		ceremony: {
			type: Array
		},
		numberOfGuest: {
			type: Number,
			trim: true
		},
		message: {
			type: String,
			default: 1
		}
	},
	{
		timestamps: true,
		collection: "Attendance"
	}
);

// Add full-text search index
attendanceSchema.index({
	fullName: "text"
});

module.exports = mongoose.model("Attendance", attendanceSchema);
