'use strict';

/**
 *  post controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::post.post', ({ strapi }) => ({
    // async customFind(ctx) {
    //     const { query } = ctx;
    //     const entity = await strapi.service("api::post.post").find(query); //call function from service

    //     const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    //     return this.transformResponse(sanitizedEntity);
    // }

    async createMany(ctx) {
        const entries = await strapi.service("api::post.post").createMany(ctx);
        return entries;
    }
}));
