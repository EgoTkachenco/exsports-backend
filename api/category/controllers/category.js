"use strict";

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
