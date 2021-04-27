const notificationModel = require('../../Models/notification');

const sendEmailNodeMailer = require('../../Middlewares/nodemailer');

module.exports.sendEmail = async (link,email,itemId,price,url,title) => {
    return new Promise(async (resolve,reject) => {
        notificationModel.findOne({link:link,email:email,itemId:itemId})
        .then(async (notification) => {
            if (notification && notification != null){
                resolve({status:false,msg:'item exist'});
            }
            else {
                sendEmail(link,price,url,itemId,email,title)
                    .then((result) => {
                        resolve(result);
                    })
                    .catch(err => {
                        resolve({status:false,msg:'couldnt send message'})
                    })
            }
        })
        .catch(err => {
            resolve({status:false,msg:'couldnt send message'});
        })
    })
    
}

async function createNotification(link,itemId,email) {
    return new Promise(async (resolve,reject) => {
        notificationModel.create({link:link,itemId:itemId,email:email})
            .then((notificationCreated) => {
                if (notificationCreated) {
                    resolve({status:true,msg:'message sent'});
                }
                else {
                    resolve({status:false,msg:'couldnt send message'});

                }
            })
            .catch((err) => {
                console.log(err);
                resolve({status:false,msg:'couldnt send message'});
            })
    })
}

async function sendEmail(link,price,url,itemId,email,title) {
    return new Promise((resolve,reject) => {
        setTimeout(async () => {
            sendEmailNodeMailer.sendEmail(email,price,'https://www.marktplaats.nl'+url,title,itemId)
            .then(async (result) => {
                if (result && result.status) {
                        resolve(await createNotification(link,itemId,email));
                }
                else {
                    resolve({status:false,msg:"message not send"});
                }
            })
            .catch((err) => {
                resolve({status:false,msg:"message not send"});
    
            })
        },5000);
        })
       
    

}