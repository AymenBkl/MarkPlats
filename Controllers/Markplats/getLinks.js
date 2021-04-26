const storeModel = require('../../Models/store');

const getSheet = require('./getSheet');
module.exports.getLinks = (res,type) => {
    if (type == 'api'){
        storeModel.find({}) 
        .then((links) => {
            if (links && links.length > 0){
                    res.json({status:200,msg:"LINK LOADED",links:links});
                
            }
            else if (links && links.length == 0) {
                    res.json({status:404,msg:"YOU HAVE NO LINKS",links:null});
                
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
    else if (type == 'sheet'){
        console.log(Date.now());
        storeModel.find({expiration : {$gt:Date.now()}}) 
        .then((links) => {
            if (links && links.length > 0){
                getSheets(links);
                
            }
        })
        .catch(err => {
            console.log(err);
            
        })
    }
    
}


async function getSheets(sheets){
    const promisesAuth = sheets.map(async sheet => {
        const promise = await getSheet.prepareAuth(sheet);
        return promise;
    });
    const allPromisesAuth = await Promise.all(promisesAuth);
    console.log('finished Auth');
    const promisesWork = sheets.map(async sheet => {
        const promise = await getSheet.getSheet(sheet.link);
        return promise;
    });
    const allPromisesWork = await Promise.all(promisesWork);
    console.log('finished');
}