'use strict';

/**
 * employee service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::employee.employee', ({ strapi }) => ({
    async find(ctx) {
        // const entries = await strapi.entityService.findMany("api::employee.employee");
        // const entries = await strapi.entityService.findMany("plugin::users-permissions.user", {
        //     // fields: ['username', 'email']
        //     populate: '*'
        // });
        const entries = await strapi.entityService.findMany("api::employee.employee", {
            // fields: ['username', 'email']
            populate: '*',
            sort: ['id:desc']
        });
        return entries;
    },

    async findOne(entityId, params = {}) {
        // const entry = await strapi.entityService.findOne("plugin::users-permissions.user", entityId, this.getFetchParams(params));
        const entry = await strapi.entityService.findOne("api::employee.employee", entityId, {
            // this.getFetchParams(params)
            params,
            populate: '*'
        });
        return entry;
    },

    async create(ctx) {
        const entry = await strapi.entityService.create("api::employee.employee", {
            data: {
                profile: ctx.request.body.data.profile,
                type: ctx.request.body.data.type,
                phone: ctx.request.body.data.phone,
                address: ctx.request.body.data.address,
                dob: ctx.request.body.data.dob
            }
        })
        const id = entry.id;

        try {
            await strapi.entityService.create("plugin::users-permissions.user", {
                data: {
                    username: ctx.request.body.data.name,
                    email: ctx.request.body.data.email,
                    password: ctx.request.body.data.password,
                    employee: [id]
                }
            })
        } catch (error) {
            await strapi.entityService.delete("api::employee.employee", id);
            throw new Error(error.message);
        }

        return entry;
    },

    async update(ctx) {
        const { id } = ctx.params;
        const data = await strapi.entityService.findOne("api::employee.employee", id, {
            ctx,
            populate: { user: true }
        });

        const relationId = data.user.id;
        try {
            await strapi.entityService.update('api::employee.employee', id, {
                data: {
                    profile: ctx.request.body.data.profile,
                    type: ctx.request.body.data.type,
                    phone: ctx.request.body.data.phone,
                    address: ctx.request.body.data.address,
                    dob: ctx.request.body.data.dob
                }
            });
        } catch (error) {
            throw Error(error.message);
        }

        try {
            await strapi.entityService.update("plugin::users-permissions.user", relationId, {
                data: {
                    username: ctx.request.body.data.name,
                    email: ctx.request.body.data.email,
                    password: ctx.request.body.data.password,
                    employee: [id]
                }
            });
        } catch (error) {
            await strapi.entityService.update("api::employee.employee", id, {
                data: {
                    name: data.name
                }
            })
            throw Error(error.message);
        }

        return data;
    },

    async delete(ctx) {

        const { id } = ctx.params;
        const data = await strapi.entityService.findOne("api::employee.employee", id, {
            ctx,
            populate: { user: true }
        });
        const relationId = data.user.id;

        await strapi.entityService.delete("api::employee.employee", id);
        await strapi.entityService.delete("plugin::users-permissions.user", relationId);

        return data;
    },
}));
