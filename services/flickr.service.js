"use strict";

const Flickr = require("flickrapi");

module.exports = {
	name: "flickr",

	/**
	 * Service settings
	 */
	settings: {
		flickrOptions: {
			api_key: "94f47ecc37fdd1308d7a62debe33cfea",
			secret: "dd68b60236e23492",
			requestOptions: {
				timeout: 20000
				/* other default options accepted by request.defaults */
			},
			userId: "168534257@N08"
		}
	},

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		fetch: {
			params: {
				// colecttion: "string"
			},
			handler(ctx) {
				return this.getListGallery(ctx.params);
			}
		},
		/**
		 * get detail a photoset
		 *
		 * @param {String} photoset_id - photoSet Id
		 * @param {Number} limit - limit per page
		 * @param {Number} page - page
		 */
		getPhotoSetDetail: {
			params: {
				// colecttion: "string"
			},
			handler(ctx) {
				return this.getPhotoSetDetail(ctx.params);
			}
		},
		/**
		 * get detail a photoset
		 *
		 * @param {Number} limit - limit per page
		 * @param {Number} page - page
		 */
		getAllPhotos: {
			params: {
				// limit: 'numer',
				// page: 'number'
			},
			handler(ctx) {
				return this.getAllPhotos(ctx.params);
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
	methods: {
		getListGallery() {
			const sefl = this;
			return new Promise((resolve, reject) => {
				sefl.flickr.photosets.getList(
					{
						user_id: sefl.settings.flickrOptions.userId,
						primary_photo_extras: "url_z, url_c, url_k, url_n"
					},
					function(err, result) {
						if (err) {
							return reject(err);
						}
						return resolve(result.photosets.photoset);
					}
				);
			});
		},
		getPhotoSetDetail(params) {
			const sefl = this;
			return new Promise((resolve, reject) => {
				sefl.flickr.photosets.getPhotos(
					{
						user_id: sefl.settings.flickrOptions.userId,
						photoset_id: params.photoset_id,
						extras: "url_z, url_c, url_k, url_n",
						page: parseInt(params.page) || 0,
						per_page: parseInt(params.limit) || 20
					},
					function(err, result) {
						if (err) {
							return reject(err);
						}
						return resolve({
							limit: result.photoset.perpage,
							page: result.photoset.page,
							total: result.photoset.total,
							list: result.photoset.photo
						});
					}
				);
			});
		},
		getAllPhotos(params) {
			console.log("TCL: getAllPhotos -> params", params);
			const sefl = this;
			return new Promise((resolve, reject) => {
				sefl.flickr.photos.search(
					{
						user_id: sefl.settings.flickrOptions.userId,
						extras: "url_z, url_c, url_k, url_n",
						page: parseInt(params.page) || 0,
						per_page: parseInt(params.limit) || 20
					},
					function(err, result) {
						if (err) {
							reject(err);
						}
						resolve({
							limit: result.photos.perpage,
							page: result.photos.page,
							total: result.photos.total,
							list: result.photos.photo
						});
					}
				);
			});
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		let self = this;
		Flickr.tokenOnly(this.settings.flickrOptions, function(error, flickr) {
			self.flickr = flickr;
		});
	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {}
};
