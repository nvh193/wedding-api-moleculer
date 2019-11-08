"use strict";

const { MoleculerClientError } = require("moleculer").Errors;
const { ForbiddenError } = require("moleculer-web").Errors;

const _ = require("lodash");
const DbService = require("../mixins/db.mixin");
const Attendance = require("../models/Attendance");

module.exports = {
	name: "attendance",
	mixins: [DbService(Attendance)],

	/**
	 * Default settings
	 */
	settings: {
		fields: ["_id", "name", "phone", "ceremony", "numberOfGuest", "message", "createdAt", "updatedAt"],

		// Validation schema for new entities
		entityValidator: {
			name: { type: "string", min: 1 },
			phone: { type: "string", min: 1 },
			numberOfGuest: { type: "number", min: 1 },
			message: { type: "string" },
			ceremony: { type: "array", items: "string", optional: true }
		}
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Create a new attendance.
		 * Auth is required!
		 *
		 * @actions
		 * @param {Object} attendance - Attendance entity
		 *
		 * @returns {Object} Created entity
		 */
		create: {
			params: {
				attendance: { type: "object" }
			},
			handler(ctx) {
				let entity = ctx.params.attendance;
				return this.validateEntity(entity).then(() => {
					return this.adapter
						.insert(entity)
						.then(doc => this.transformDocuments(ctx, { populate: ["author", "favorited", "favoritesCount"] }, doc))
						.then(entity => this.transformResult(ctx, entity, ctx.meta.user))
						.then(json => this.entityChanged("created", json, ctx).then(() => json));
				});
			}
		},

		/**
		 * List attendances with pagination.
		 *
		 * @actions
		 * @param {Number} limit - Pagination limit
		 * @param {Number} offset - Pagination offset
		 *
		 * @returns {Object} List of attendances
		 */
		list: {
			params: {
				limit: { type: "number", optional: true, convert: true },
				offset: { type: "number", optional: true, convert: true }
			},
			handler(ctx) {
				const limit = ctx.params.limit ? Number(ctx.params.limit) : 20;
				const offset = ctx.params.offset ? Number(ctx.params.offset) : 0;

				let params = {
					limit,
					offset,
					sort: ["-createdAt"],
					query: {}
				};
				let countParams;

				return this.Promise.resolve()
					.then(() => {
						countParams = Object.assign({}, params);
						// Remove pagination params
						if (countParams && countParams.limit) countParams.limit = null;
						if (countParams && countParams.offset) countParams.offset = null;
					})
					.then(() =>
						this.Promise.all([
							// Get rows
							this.adapter.find(params),

							// Get count of all rows
							this.adapter.count(countParams)
						])
					)
					.then(res => {
						return this.transformDocuments(ctx, params, res[0])
							.then(docs => this.transformResult(ctx, docs, ctx.meta.user))
							.then(r => {
								r.attendancesCount = res[1];
								return r;
							});
					});
			}
    },
    /**
		 * Remove an attendance by slug
		 * Auth is required!
		 * 
		 * @actions
		 * @param {String} id - Attendance slug
		 * 
		 * @returns {Number} Count of removed attendances
		 */
		remove: {
			auth: "required",
			params: {
				id: { type: "any" }
			},
			handler(ctx) {
				return this.adapter.findOne({_id: ctx.params.id})
					.then(entity => {
						if (!entity)
							return this.Promise.reject(new MoleculerClientError("Attendance not found!", 404));

						return this.adapter.removeById(entity._id)
							.then(json => this.entityChanged("removed", json, ctx).then(() => json));
					});
			}
		},
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Transform the result entities to follow the RealWorld API spec
		 *
		 * @param {Context} ctx
		 * @param {Array} entities
		 * @param {Object} user - Logged in user
		 */
		transformResult(ctx, entities, user) {
			if (Array.isArray(entities)) {
				return this.Promise.map(entities, item => this.transformEntity(ctx, item, user)).then(attendances => ({ attendances }));
			} else {
				return this.transformEntity(ctx, entities, user).then(attendance => ({ attendance }));
			}
		},

		/**
		 * Transform a result entity to follow the RealWorld API spec
		 *
		 * @param {Context} ctx
		 * @param {Object} entity
		 * @param {Object} user - Logged in user
		 */
		transformEntity(ctx, entity, user) {
			if (!entity) return this.Promise.resolve();

			return this.Promise.resolve(entity);
		}
	},

	events: {}
};
