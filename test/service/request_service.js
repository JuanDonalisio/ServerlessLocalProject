
const axios = require('axios');
const AWS = require('aws-sdk');
const { s3Config } = require(process.env.FILE_CONFIG);
var s3 = new AWS.S3(s3Config);

class ResquestService{

    sendResquest = async (bodyResult,headerResult) =>{
        const url_generate_request = 'https://api.qa.pagos360.com/payment-request';
        const data_generate_request = {
           payment_request: {
            description: `${bodyResult.value.dni}`,
            first_due_date: changeDateFormat(bodyResult.value.first_due_date),
            first_total: bodyResult.value.first_total,
            payer_name: await getPayerName(bodyResult.value.dni)
           }
        }
        const config_generate_request = {
            headers: {
                Authorization: headerResult.value.Authorization,
            }
        }
        if(bodyResult.error || headerResult.error) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: bodyResult.error || headerResult.error
                })
            }
        }
        else {
            try {
                let response_data = {};
                await axios.post(url_generate_request, data_generate_request, config_generate_request).then(response => {
                    response_data = response.data;
                });
                (await s3.putObject({
                    Bucket: process.env.S3_BUCKET_NAME,
                    Body: JSON.stringify(response_data),
                    Key: `requests/${response_data.id}.txt`,
                }).promise().Body);
                return{
                    statusCode:201,
                    body: JSON.stringify(response_data)
                }

            } catch (error) {
                console.log(error)
            }
        }
    }

    listAllRequests = async () => {
        let parameters = {
            Bucket: process.env.S3_BUCKET_NAME,
            Prefix: 'requests/'
        };
        const files = await s3.listObjects(parameters).promise()
        const request_list = [];
        const request_list2 = {requests: request_list};
        for(let file in files.Contents){
            const request = (await s3.getObject({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `${files.Contents[file].Key}` ,
            }).promise()).Body.toString();
            request_list.push(JSON.parse(request))
        } 
        return {
            statusCode: 200,
            body: JSON.stringify(request_list2)
        }
    }

    getOneRequest = async (paramsResult,headerResult) => {
        const url_get_request = `https://api.qa.pagos360.com/payment-request/${paramsResult.value.id}`;
        const config_get_request = {
            headers: {
                Authorization: headerResult.value.Authorization
            }
        }
        if(paramsResult.error || headerResult.error) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: paramsResult.error || headerResult.error
                })
            }
        }
        else{
            try {
                let data_response = {};
                await axios.get(url_get_request, config_get_request).then(response => {
                    data_response = response.data
                });
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: data_response
                    })
                }
                
            } catch (error) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: "Not found"
                    })
                }
            }
        }
    }


}

function changeDateFormat(date){
    const originalDate = JSON.stringify(date).split("T")[0].split("-")
    const newFormatDAte = originalDate[2]+'-'+originalDate[1] +'-'+originalDate[0].slice(1)
    return newFormatDAte
}

async function getPayerName(dni){
    let parameters = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `payers/${dni}.txt`,
   }
    const payer = (await s3.getObject(parameters).promise()).Body.toString();
    return JSON.parse(payer).name
}


module.exports = ResquestService;