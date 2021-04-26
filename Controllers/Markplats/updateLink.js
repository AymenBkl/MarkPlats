const storeModel = require('../../Models/store');



module.exports.updateStore = (res,storeModelId,query) => {
    storeModel.findByIdAndUpdate(storeModelId,query,{$new:true}) 
        .then((updatedStore) => {
            console.log(updatedStore);
            if (updatedStore) {
                res.json({status:200,msg:"STORE UPDATED",link:updatedStore});
            }
            else {
                res.json({status:500,msg:"SOMETHING WENT WRONG",link:null});
            }
        })
        .catch(err => {
            console.log(err);
            res.json({status:500,msg:"SOMETHING WENT WRONG",link:null});
        })
}