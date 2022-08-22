'use strict';

/**
 * employee service.
 */

const { createCoreService } = require('@strapi/strapi').factories;
const bcrypt = require("bcryptjs");

module.exports = createCoreService('api::employee.employee', ({ strapi }) => ({
    async find(ctx) {
        // const entries = await strapi.entityService.findMany("api::employee.employee");
        // const entries = await strapi.entityService.findMany("plugin::users-permissions.user", {
        //     populate: '*',
        //     sort: ['id:desc']
        // });
        const entries = await strapi.entityService.findMany("api::employee.employee", {
            populate: '*',
            // populate: {
            //     user: {
            //         filters: {
            //             id: {
            //                 $eq: '16',
            //             },
            //         },
            //     },
            // },  
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
                address: ctx.request.body.data.address || '-',
                dob: ctx.request.body.data.dob || '-',
                createdUser: ctx.request.body.data.createdUser
            }
        })
        const id = entry.id;

        try {
            ctx.request.body = {
                username: ctx.request.body.data.name,
                email: ctx.request.body.data.email,
                password: ctx.request.body.data.password,
                employee: id,
                role: ctx.request.body.data.role
            };
            await strapi.controller("plugin::users-permissions.user").create(ctx);

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
                    address: ctx.request.body.data.address || '-',
                    dob: ctx.request.body.data.dob || '-',
                    updated_user_id: ctx.request.body.data.updated_user_id
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
                    employee: [id],
                    role: ctx.request.body.data.role
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

    async password(ctx) {
        const params = ctx.request.body;
        if (!params.identifier) {
            console.log("email is required");
        }

        const user = await strapi.db.query('plugin::users-permissions.user').findOne({
            select: ['email', 'password', 'id'],
            where: {
                email: params.identifier
            }
        });

        const validPassword = await strapi
            .service("plugin::users-permissions.user")
            .validatePassword(params.password, user.password);

        if (!validPassword) {
            return { data: 'invalid' };
        } else {
            // Generate new hash password
            const newPassword = bcrypt.hashSync(params.newPassword, 10);

            // Update user password
            await strapi.db.query('plugin::users-permissions.user').update({
                where: { id: user.id },
                data: {
                    password: newPassword,
                },
            });
            return { data: 'success' };
        }
    }
}));
