const loggerAuth = require('../Middlewares/logger').loggerAuth;

module.exports.success = (res,msg,status,user,endPoint) => {
    loggerAuth.http(JSON.stringify({status:status,endPoint:endPoint,msg:msg}));
    res.statusCode = status;
    res.setHeader("Content-Type","application/json");
    res.json({msg : "Welcom to BitExplode ",success: true,msg : msg,status : status,user : user}); 
}