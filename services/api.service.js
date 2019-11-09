"use strict";

const ApiGateway = require("moleculer-web");

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 1110,
		// Global CORS settings for all routes
		cors: {
			// Configures the Access-Control-Allow-Origin CORS header.
			origin: "*",
			// Configures the Access-Control-Allow-Methods CORS header.
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
			// Configures the Access-Control-Allow-Headers CORS header.
			allowedHeaders: "*",
			// Configures the Access-Control-Expose-Headers CORS header.
			exposedHeaders: [],
			// Configures the Access-Control-Allow-Credentials CORS header.
			credentials: false,
			// Configures the Access-Control-Max-Age CORS header.
			maxAge: 3600
		},
		rateLimit: {
			// How long to keep record of requests in memory (in milliseconds).
			// Defaults to 60000 (1 min)
			window: 60 * 1000,

			// Max number of requests during window. Defaults to 30
			limit: 30,

			// Set rate limit headers to response. Defaults to false
			headers: true,

			// Function used to generate keys. Defaults to:
			key: req => {
				return req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
			}
			//StoreFactory: CustomStore
		},
		routes: [
			{
				path: "/api",
				// whitelist: [
				// 	// Access any actions in 'posts' service
				// 	"gallery.*",
				// 	"attendance.*"
				// ],
				aliases: {
					// The `name` comes from named param.
					// You can access it with `ctx.params.name` in action
					"GET photosets": "gallery.fetch",
					"GET photos/getAll": "gallery.getAllPhotos",
					"GET photosets/:photoset_id": "gallery.getPhotos",

					// attendance
					"POST attendances": "attendance.create",
					"GET attendances": "attendance.list",
					"DELETE attendances/:id": "attendance.remove"
				},
				// Disable to call not-mapped actions
				mappingPolicy: "restrict",

				// Parse body content
				bodyParsers: {
					json: {
						strict: false
					},
					urlencoded: {
						extended: false
					}
				}
			}
		]
	}
};
