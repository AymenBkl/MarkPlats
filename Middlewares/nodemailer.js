const nodemailer = require('nodemailer');


const { config } = require('../config');

var fs = require('fs');

const handlebars = require('handlebars');

const templateBuilder = require('nodemailer-express-handlebars');

var source = fs.readFileSync('views/layout/email-template.handlebars', 'utf8');

var template = handlebars.compile(source);

var transport;
module.exports.createTransporter = () => {
    transport = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:config.email.user,
            pass:config.email.pass
        }
    });
    transport.use('compile', templateBuilder({
        viewEngine : 'express-handlebars',
        viewPath : './views/layout'
    }))
}

module.exports.sendEmail = (sendTo,price,url,title,itemId) => {
    return new Promise((resolve,reject) => {
        let mailOptions = {
            from:config.email.user,
            to:sendTo,
            subject:"New Offer",
            html : template({price : price,url:url,title:title,itemId:itemId})
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