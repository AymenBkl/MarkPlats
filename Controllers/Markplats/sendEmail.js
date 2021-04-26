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
                resolve(await (createNotification(link,itemId,email)));
                //resolve(await sendEmail(link,price,url,itemId,email,title));
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
        sendEmailNodeMailer.sendEmail('aymenxyz6@gmail.com','Hello We sent you this email from our api to tell you have found new offer for you.Title:  ' + title +' URL: https://www.marktplaats.nl/'+url+', itemId: ' +itemId + ',price: ' +price)
        .then(async (result) => {
            if (result && result.status) {
                setTimeout(async () => {
                    resolve(await createNotification(link,itemId,email));
                },2000)
            }
            else {
                resolve({status:false,msg:"message not send"});
            }
        })
        .catch((err) => {
            resolve({status:false,msg:"message not send"});

        })
    })
    

}