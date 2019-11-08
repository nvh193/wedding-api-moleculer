"use strict";

module.exports = {
	name: "gallery",

	/**
	 * Service settings
	 */
	settings: {},

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		fetch: {
			cache: true,
			handler(ctx) {
				return ctx.call("flickr.fetch", ctx.params);
			}
		},
		getPhotos: {
			cache: true,
			params: {
				photoset_id: "string"
			},
			handler(ctx) {
				return ctx.call("flickr.getPhotoSetDetail", ctx.params);
			}
		},
		getAllPhotos: {
			cache: true,
			params: {
			},
			handler(ctx) {
				return ctx.call("flickr.getAllPhotos", ctx.params);
			}
		}
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {}
};
