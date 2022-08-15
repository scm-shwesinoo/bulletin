const utils = require('../../../node_modules/@strapi/utils');
const { sanitize } = utils;
const sanitizeOutput = (user) => {
    const { password, resetPasswordToken, confirmationToken, ...sanitizedUser } =
      user;
    return sanitizedUser;
  };

module.exports = (plugin) => {
    plugin.controllers.user.me = async (ctx) => {
        if(!ctx.state.user) {
            return ctx.unauthorized();
        }
        const user = await strapi.entityService.findOne(
            'plugin::users-permissions.user',
            ctx.state.user.id,
            {populate: ['role']}
        );
        ctx.body = sanitizeOutput(user);
    }

    return plugin;
}