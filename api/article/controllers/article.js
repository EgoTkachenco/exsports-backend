"use strict";
const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async getUrls(ctx) {
    let categories = await strapi
      .query("category")
      .model.aggregate([{ $project: { url: 1 } }]);
    let articles = await strapi
      .query("article")
      .model.aggregate([{ $project: { url: 1, category: 1 } }]);

    let categoriesPages = categories.map((c) => `/${c.url}`);
    categories = categories.reduce((acc, c) => {
      acc[c._id] = c.url;
      return acc;
    }, {});

    let articlesPages = articles.map(
      (a) => `/${categories[a.category]}/${a.url}`
    );

    return [...categoriesPages, ...articlesPages];
  },

  async find(ctx) {
    let entities;

    if (ctx.query.exclude_carousel) {
      let carouselArticles = await strapi.services.carousel.find();
      carouselArticles = carouselArticles.articles.map((article) => article.id);
      ctx.query.id_nin = carouselArticles;
      delete ctx.query.exclude_carousel;
    }

    if (ctx.query._q) {
      entities = await strapi.services.article.search(ctx.query);
    } else {
      entities = await strapi.services.article.find(ctx.query);
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.article })
    );
  },
  async getRandomArticles(ctx) {
    let articles = await strapi.services.article.getRandomArticles(ctx.query);
    return articles;
  },
};
