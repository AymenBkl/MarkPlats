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
    let mailOptions = {
        from:config.email.user,
        to:sendTo,
        subject:"Notification New Product Success",
        text:text
    };

    transport.sendMail(mailOptions,(error,info) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('email sent');
        }
    })
}