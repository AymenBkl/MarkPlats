const nodemailer = require('nodemailer');
const { config } = require('../config');

var transport;
module.exports.createTransporter = () => {
    transport = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:config.email.user,
            pass:config.email.pass
        }
    })
}

module.exports.sendEmail = (sendTo,text) => {
    return new Promise((resolve,reject) => {
        let mailOptions = {
            from:config.email.user,
            to:sendTo,
            subject:"New Offer",
            text:text
        };
    
        transport.sendMail(mailOptions,(error,info) => {
            if (error) {
                resolve({status:false})
                console.log(error);
            }
            else {
                resolve({status:true})
                console.log('email sent');
            }
        })
    })
   
}