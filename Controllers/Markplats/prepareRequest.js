


const request = require('request');
const { config } = require('../../config');


module.exports.prepareRequest = (url) => {
    return prepareRequest(url)
}

function prepareRequest(url) {
    var options = {
        url: config.baseURL.url + url,
        method: 'GET',
      };
      return new Promise((resolve,reject) => {
        callback = (error, response, body) => {
          if (error || response.statusCode != 200){
              
            if (response) {
                resolve({status:false,error:'Something Went Wrong !',statusCode:response.statusCode});
            }
            else if (error) {
              console.log(error);
              resolve({status:false,error:error,statusCode:500});
            }
          }
          if (!error && response.statusCode == 200) {
            const newBody = JSON.parse(body);
            resolve({status:true,body:newBody});
          }
        };
        request(options, callback);
      })
}