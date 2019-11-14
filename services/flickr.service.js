"use strict";

const Flickr = require("flickrapi");
const config = require("config");

module.exports = {
	name: "flickr",

	/**
	 * Service settings
	 */
	settings: {
		flickrOptions: config.flickr
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
							return resolve({
								limit: parseInt(params.limit) || 20,
								page: parseInt(params.page) || 0,
								total: 0,
								list: []
							});
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
							list: result.photos.pages < result.photos.page ? [] : result.photos.photo
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
