const Joi = require('joi')

const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(6).required()
})

module.exports = schema;