"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

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
};
