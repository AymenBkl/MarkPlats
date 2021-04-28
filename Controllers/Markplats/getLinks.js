const storeModel = require('../../Models/store');

const getSheet = require('./getSheet');
module.exports.getLinks = (res,type) => {
    getLinksLocal(res,type);
}

async function getLinksLocal(res,type){
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
        storeModel.find() 
        .then((links) => {
            console.log(links);
            if (links && links.length > 0){
                getSheets(links,res,type);
                
            }
        })
        .catch(err => {
            console.log(err);
            
        })
    }
}


async function getSheets(sheets,res,type){
    let index = 0;
    let sheetLength = sheets.length;
    while (index < sheetLength){
        index = await getSheet.prepareAuth(sheets[index],index);
    }
    console.log('finished Auth');
    index =0;
    while (index < sheetLength) {
        index = await getSheet.getSheet(sheets[index].link,index);
    }
    console.log('finished');
    setTimeout(async () => {
        getLinksLocal(res,type);
    },3600000)
}