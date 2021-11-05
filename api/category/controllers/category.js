"use strict";
const { sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.category.search(ctx.query);
    } else {
      entities = await strapi.services.category.find(ctx.query);
    }
    for (let i = 0; i < entities.length; i++) {
      entities[i].articlesCount = await strapi.services.article.count({
        category_in: entities[i].id,
      });
    }
    return entities;
  },
};
