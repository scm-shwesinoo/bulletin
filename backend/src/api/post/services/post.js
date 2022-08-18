'use strict';

/**
 * post service.
 */
const _ = require("lodash");
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::post.post', ({ strapi }) => ({
  // async find(ctx) {
  //     const entries = await strapi.entityService.findMany("api::post.post");
  //     // const entries = strapi.db.query("api::post.post").findMany();
  //     return entries;
  // },
  async createMany(ctx) {
    const errPostList = [];
    // const { data } = ctx.request.body;
    // console.log(data);
    // const entries = await strapi.db.query('api::post.post').createMany({    
    //     // data

    //     data: [
    //         {
    //           title: "Ttl1",
    //           description: "Desc1",
    //           status: true,
    //           user: [8]
    //         },
    //         {
    //            title: "Ttl2",
    //           description: "Desc2",
    //           status: true,
    //           user:  [8]
    //         }
    //       ]
    // });
    // await Promise.all(
    //   _.map(async (ctx) => {
    //     try{
    //       const entries = await strapi.entityService.create('api::post.post', {
    //         data: {
    //           title: ctx.request.body.data.title
    //         }
    //       });
    //       return entries;
    //     }catch(err){
    //       errPostLIst = err;
    //     }

    //   })
    // );
    // return entries;

    // data: {
    //   description: "Desc1",
    //   status: true,
    //   title: "CSV1",
    //   user: [1]
    // }
    const { data } = ctx.request.body;
    console.log(ctx.request.body);
    await Promise.all(
      _.map(data, async (element) => {
        console.log(element);
        let post = {
          data: {
            ...element
          }
        }
        try {
          await strapi.entityService.create('api::post.post', post);
        } catch (error) {
          console.log(error, '===err===');
          errPostList.push({ 'title': element, 'error': error.message });
        }
      })
    );
    // console.log(errPostList);
    if (errPostList.length > 0) {
      return errPostList;
    } else {
      return { data: 'success' };
    }
  }
}));
