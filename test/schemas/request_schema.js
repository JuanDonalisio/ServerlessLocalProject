//const Joi = require('joi');
const Joi = require('joi').extend(require('@joi/date'))

const dni = Joi.number().integer().required();
const first_due_date = Joi.date().format('DD-MM-YYYY').required();
const first_total = Joi.number().required();
const Authorization = Joi.string().required();
const id = Joi.number().integer().required();

const createRequestBodySchema = Joi.object({
    dni: dni.required(),
    first_due_date: first_due_date.required(),
    first_total: first_total.required()
});

const RequestHeaderSchema = Joi.object({
    Authorization: Authorization.required()
});

const getOneRequestSchema = Joi.object({
    id: id.required(),
});

module.exports = { createRequestBodySchema, RequestHeaderSchema , getOneRequestSchema };