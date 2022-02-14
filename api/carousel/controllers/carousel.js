"use strict";
const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  async find(ctx) {
    const entity = await strapi.services.carousel.find({}, [
      { path: "articles", populate: ["category"] },
    ]);
    return sanitizeEntity(entity, { model: strapi.models.carousel });
  },
};
