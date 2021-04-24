const errResponse = require('./response.err.user');
const successResponse = require('./response.success.user');

module.exports.response = (type,res,msg,status,user,endPoint,err) => {
    if (type == 'error'){
        return errResponse.error(res,msg,status,user,endPoint,err);
    }
    else if (type == 'success'){
        return successResponse.success(res,msg,status,user,endPoint);
    }
}