
const Joi = require("joi");


const advertValidation = Joi.object({
  title: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 1 character",
  }),
  description: Joi.string().max(1000).allow(""),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Category name is required",
  }),
  image: Joi.string()
});

module.exports = advertValidation