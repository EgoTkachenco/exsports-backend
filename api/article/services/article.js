"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

module.exports = {
  async getRandomArticles({ size }) {
    let articles = await strapi.query("article").model.aggregate([
      { $sample: { size: size || 3 } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $lookup: {
          from: "upload_file",
          localField: "image",
          foreignField: "_id",
          as: "image",
        },
      },
      {
        $unwind: "$image",
      },
    ]);
    return articles;
  },
};
