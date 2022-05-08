const AWS = require('aws-sdk');
const { s3Config } = require(process.env.FILE_CONFIG);
var s3 = new AWS.S3(s3Config);

class PayerService{

    writePayerFile = async (result) =>{
        let parameters = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `payers/${result.value.dni}.txt`,
       }
       let parameters1 = {
        Bucket: process.env.S3_BUCKET_NAME,
        Body: JSON.stringify(result.value),
        Key: `payers/${result.value.dni}.txt`,
        }
        if(result.error){
            return {
                statusCode: 400,
                body: JSON.stringify(result.error.details[0].message)
            };
        }
        else{
            try {
                await s3.getObject(parameters).promise();
                return {
                    statusCode: 400,
                    body: JSON.stringify('Payer is already created')
                }
            } catch (error) {
                (await s3.putObject(parameters1).promise().Body);
                    return {
                        statusCode: 201,
                        body: JSON.stringify(result.value)
                    }
            }
        }
    }

    readPayerFile = async (result) =>{
        let parameters = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `payers/${result.value.dni}.txt`,
       }
        if (result.error) {
            return {
                statusCode: 400,
                body: JSON.stringify(result.error.details[0].message)
            };
        }
        else{
            try {
                const data = await (await s3.getObject(parameters).promise()).Body.toString();
                return {
                    statusCode: 200,
                    body: data
                }
            } catch (error) {
                return {
                    statusCode: 400,
                    body: JSON.stringify('There is no payer with this dni')
                }
            }
        }
    } 

}

module.exports =  PayerService  ;