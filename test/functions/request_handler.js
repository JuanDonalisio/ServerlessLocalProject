const { createRequestBodySchema, RequestHeaderSchema , getOneRequestSchema } = require('./../schemas/request_schema');
const ResquestService = require('./../service/request_service');

const service = new ResquestService();

module.exports.createRequest = async (event) => {
    const bodyResult = createRequestBodySchema.validate(JSON.parse(event.body));
    const headerResult = RequestHeaderSchema.validate({Authorization: event.headers.Authorization});
    return await service.sendResquest(bodyResult, headerResult);
};

module.exports.listRequest = async (event) => {
    return await service.listAllRequests()
};


module.exports.getRequest = async (event) => {
    const paramsResult = getOneRequestSchema.validate(event.pathParameters);
    const headerResult = RequestHeaderSchema.validate({Authorization: event.headers.Authorization});
    return await service.getOneRequest(paramsResult,headerResult);
};