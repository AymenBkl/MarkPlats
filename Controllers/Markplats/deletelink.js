const storeModel = require('../../Models/store');

module.exports.deleteLink = (res,link) => {
    storeModel.findOneAndDelete({link:link})
        .then((linkDeleted) => {
            if (linkDeleted){
                res.json({status:200,msg:"LINK DELETED",link:linkDeleted});
            }
            else {
                res.json({status:500,msg:"SOMETHING WENT WRONG",link:null});
            }
        })
        .catch(err => {
            res.json({status:500,msg:"SOMETHING WENT WRONG",link:null});
        })
}