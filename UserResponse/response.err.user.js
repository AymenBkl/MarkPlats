
const loggerAuth = require('../Middlewares/logger').loggerAuth;

module.exports.error = (res,msg,status,user,endPoint,err) => {
    loggerAuth.error(JSON.stringify({error:String(err),status:status,endPoint:endPoint,msg:msg}));
    res.statusCode = status;
    res.setHeader("Content-Type","application/json");
    res.json({msg : "Something Went Wrong !",success: false,err:err,status : status,user : user});
}