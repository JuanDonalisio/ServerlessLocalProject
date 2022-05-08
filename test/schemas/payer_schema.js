const Joi = require('joi');

const name = Joi.string().required();
const dni = Joi.number().integer().required();
const tel = Joi.number().integer().required();
const email = Joi.string().email().required();

const addPayerSchema = Joi.object({
    name: name.required(),
    dni: dni.required(),
    tel: tel.required(),
    email: email.required()
});

const getPayerSchema = Joi.object({
    dni: dni.required(),
});

module.exports = { addPayerSchema , getPayerSchema };