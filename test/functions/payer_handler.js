const { addPayerSchema , getPayerSchema } = require('./../schemas/payer_schema');
const PayerService = require('./../service/payer_service');

const service = new PayerService();

module.exports.addPayer = async (event) => {
    const result = addPayerSchema.validate(JSON.parse(event.body));
    return await service.writePayerFile(result);
};

module.exports.getPayer = async (event) => {
    const result = getPayerSchema.validate(event.pathParameters);
    return await service.readPayerFile(result);
};
