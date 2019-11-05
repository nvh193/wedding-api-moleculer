"use strict";

const ApiGateway = require("moleculer-web");

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3000,

		routes: [
			{
				path: "/api",
				whitelist: [
					// Access any actions in 'posts' service
					"gallery.*"
				],
				routes: [
					{
						mappingPolicy: "restrict",
						aliases: {
							// The `name` comes from named param.
							// You can access it with `ctx.params.name` in action
							"GET galleries": "gallery.fetch",
							"GET galleries/getAll": "gallery.getAllPhotos",
							"GET galleries/:photoset_id": "gallery.getPhotos"
						}
					}
				]
			}
		]
	}
};
