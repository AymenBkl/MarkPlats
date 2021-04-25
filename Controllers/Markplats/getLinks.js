const storeModel = require('../../Models/store');

module.exports.getLinks = (res,type) => {
    storeModel.find({}) 
        .then((links) => {
            if (links && links.length > 0){
                if (type == 'api'){
                    res.json({status:200,msg:"LINK LOADED",links:links});
                }
            }
            else if (links && links.length == 0) {
                if (type == 'api'){
                    res.json({status:404,msg:"YOU HAVE NO LINKS",links:null});
                }
            }
            else {
                if (type == 'api'){
                    res.json({status:500,msg:"SOMETHING WENT WRONG",link:null});
                }
            }
        })
        .catch(err => {
            console.log(err);
            if (type == 'api'){
                res.json({status:500,msg:"SOMETHING WENT WRONG",link:null});
            }
        })
}