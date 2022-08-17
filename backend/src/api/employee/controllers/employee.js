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

    async password(ctx) {
        const entity = await strapi.service("api::employee.employee").password(ctx);
        return entity;
    },

    // index: async ctx => {
    //     const params = ctx.request.body;
    //     if (!params.identifier) {
    //         console.log("email is required");
    //     }

    //     const user = await strapi.db.query('plugin::users-permissions.user').findOne({
    //         select: ['email', 'password', 'id'],
    //         where: {
    //             email: params.identifier
    //         }
    //     });

    //     const validPassword = await strapi
    //         .service("plugin::users-permissions.user")
    //         .validatePassword(params.password, user.password);

    //     if (!validPassword) {
    //         return { data: 'invalid' };
    //     } else {
    //         console.log('valid pass');
    //         // Generate new hash password
    //         const newPassword = bcrypt.hashSync(params.newPassword, 10);
    //         console.log('new passs', params.newPassword);
    //         console.log('hash password', newPassword);

    //         // Update user password
    //         await strapi.db.query('plugin::users-permissions.user').update({
    //             where: { id: user.id },
    //             data: {
    //                 password: newPassword,
    //             },
    //         });
    //         ctx.send({ message: 'OK' });
    //         return { data: 'success' };
    //     }
    //     // return user;
    // }

}));
