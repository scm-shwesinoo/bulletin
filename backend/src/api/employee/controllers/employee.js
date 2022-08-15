'use strict';

/**
 *  employee controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::employee.employee', ({ strapi }) => ({
    async find(ctx) {
        const entity = await strapi.service('api::employee.employee').find(ctx);
        return entity;
    },

    async findOne(ctx) {
        const { id } = ctx.params;

        const entity = await strapi.service("api::employee.employee").findOne(id, ctx);
        // const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        // return this.transformResponse(sanitizedEntity);
        return entity;
    },

    async create(ctx) {
        const entity = await strapi.service('api::employee.employee').create(ctx);
        return entity;
    },

    async update(ctx) {
        const entity = await strapi.service("api::employee.employee").update(ctx);
        return entity;
    },

    async delete(ctx) {
        const entity = await strapi.service("api::employee.employee").delete(ctx);
        return entity;
    },
}));
