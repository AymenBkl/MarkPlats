const storeModel = require('../../Models/store');

module.exports.addLink = (res,link) => {
    storeModel.create({link:link})
        .then((linkCreated) => {
            if (linkCreated){
                res.json({status:200,msg:"LINK CREATED",link:linkCreated});
            }
            else {
                res.json({status:500,msg:"SOMETHING WENT WRONG",link:null});
            }
        })
        .catch(err => {
            console.log(err.errors.link.properties.message == 'store already exists');
            if (err.errors && err.errors.link && err.errors.link.properties){
                res.json({status:500,msg:err.errors.link.properties.message,link:null});

            }
            else {
                res.json({status:500,msg:"SOMETHING WENT WRONG",link:null});

            }
        })
}