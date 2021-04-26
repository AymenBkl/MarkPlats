const { GoogleSpreadsheet } = require('google-spreadsheet');

const { promisify } = require('util');
const creds = require('./Markplats-00ab3a6d201e.json');

const categories = require('./categories.json');

const sendEmail = require('./sendEmail');

let docs = new Map();
const prepareRequest = require('./prepareRequest');
module.exports.getSheet = async (link) => {
    const promise = await accessSpreedSheet(link);
}

module.exports.prepareAuth = (store) => {
    return new Promise(async (resolve) => {
        let link = store.link;
            docs.set(link, new GoogleSpreadsheet(link));
            await docs.get(link).useServiceAccountAuth({ client_email: creds.client_email, private_key: creds.private_key });
            await docs.get(link).loadInfo();
            console.log('authed');
            resolve(true);

    })
}



async function accessSpreedSheet(link) {
    return new Promise(async (resolve) => {
        const doc = docs.get(link);
        const sheetProduct = doc.sheetsByIndex[0];
        const sheetModels = doc.sheetsByIndex[4];
        const sheetUser = doc.sheetsByIndex[2];
        let productModels = await getUniqueModels(sheetModels);
        await getProducts(sheetProduct, productModels, await getUser(sheetUser),link);
        /**await sheet.loadCells('A1:I50');
        const a1 =  sheet.getCell(0,1);
        for(let i=0;i<50;i++){
            for(let j=0;j<9;j++)
            console.log(sheet.getCell(i,j).formula,sheet.getCell(i,j).value);
        }**/
        resolve(true);
    })
    
}

async function getUser(sheetUser) {
    const userRows = await sheetUser.getRows();
    return userRows[0];

}

async function getProducts(sheetProduct, modelRows, user,link) {
    return new Promise(async (resolve) => {
        const rows = await sheetProduct.getRows();
        let index = 0;
        let keys = ['On / Off', 'Group', 'Rubric', 'Type', 'Storage', 'Condition Product', 'Maximum Price', 'Maximum Distance', 'Seller Active Since'];
    
        while (index < rows.length) {
            console.log(index,rows.length);
            index = await constructQuery(rows[index], modelRows, user, index,link);
        }
        console.log('finished from while');
        resolve(true);
    })
    
}

async function getUniqueModels(modelsRows) {
    let modelsMap = new Map();
    const rowCounts = (await modelsRows.getRows()).length;
    console.log(rowCounts, modelsRows.columnCount);
    await modelsRows.loadCells(`A1:ZZ${rowCounts}`);
    for (let i = 1; i < rowCounts; i++) {
        let modelsSet = new Set();
        for (let j = 1; j < modelsRows.columnCount; j++) {
            modelsSet.add(await modelsRows.getCell(i, j).value);
        }
        modelsMap.set(modelsRows.getCell(i, 0).value, modelsSet);
    }
    return modelsMap;
}

function searchCategory(reburiekModel) {
    rebriekToSearch = reburiekModel.split('_')[0];
    return (categories.filter(category => category.fullName.includes(rebriekToSearch)));
}

async function constructQuery(product, modelMap, user, i,link) {
    return new Promise(async (resolve, reject) => {
        let queryString = 'limit=100&offset=0&sortBy=PRICE&viewOptions=list-view&searchInTitleAndDescription=true&sortOrder=DECREASING';
        queryString += '&postcode=' + user.Postal;
        let buildedModelsQuery = {valid:false,queryString:''};
        if (product.Rubric && product.Rubric != null) {
            buildedModelsQuery = await (await buildModelsQuery(modelMap.get(product.Rubric)))
            queryString += buildedModelsQuery.string;
        }
        if (product['Maximum Distance'] && product['Maximum Distance'] != null) {
            queryString += '&distanceMeters=' + product['Maximum Distance'] * 1000;
        }
        if (product['Maximum Price'] && product['Maximum Price'] != null) {
            queryString += '&attributeRanges[]=PriceCents%3A100%3A' + product['Maximum Price'] * 100;
        }
        if (product['Condition Product'] && product['Condition Product'] != null) {
            if (product['Condition Product'] == 'New') {
                queryString += '&attributesById[]=' + 30;
            }
            else if (product['Condition Product'] == 'Used') {
                queryString += '&attributesById[]=' + 32;
            }
            else if (product['Condition Product'] == 'As good as new') {
                queryString += '&attributesById[]=' + 31;
            }
            else {
                queryString += '&attributesById[]=' + 31 + '&attributesById[]=' + 32 + '&attributesById[]=' + 30;
            }
        }
        if (product['Storage'] && product['Storage'] != null) {
            if (product['Storage'] == '16gb') {
                queryString += '&attributesById[]=' + 12821;
            }
            else if (product['Storage'] == '32gb') {
                queryString += '&attributesById[]=' + 12822;
            }
            else if (product['Storage'] == '64gb') {
                queryString += '&attributesById[]=' + 12823;
            }
            else if (product['Storage'] == '128gb') {
                queryString += '&attributesById[]=' + 12824;
            }
            else if (product['Storage'] == '256gb') {
                queryString += '&attributesById[]=' + 12825;
            }
            else if (product['Storage'] == '512gb') {
                queryString += '&attributesById[]=' + 12826;
            }
            else if (product['Storage'] == '8gb') {
                queryString += '&attributesById[]=' + 12820;
            }
            else if (product['Storage'] == '1tb') {
                queryString += '&attributesById[]=' + 12820;
            }
        }
        console.log('entered', i, queryString + '\n');
        if (buildedModelsQuery.valid){
            await nextPage(0,queryString,user,link);
            resolve(i+1);
        }
        else {
            resolve(i+1);
        }
    })

}

async function nextPage(page,queryString,user,link) {
    console.log('link',link);
    return new Promise(async (resolve) => {
        prepareRequest.prepareRequest(queryString)
        .then(async (result) => {
            setTimeout(async () => {
                if (result && result.status && result.body) {
                    await getAllDetials(result.body.listings,user,link);
                    if (result.body.length == 100){
                        queryString.replace('offset=' + page,'offset=' + Number(page+1));
                        await nextPage(page+1,queryString,user,link);
                    }
                    else {
                        resolve(true);
                    }
                }
                else {
                    resolve(true);
                }
            },1000)
            
        })
        .catch(err => {
            setTimeout(() => {
                console.log(err);
                resolve(true);
            },1000)
            
        })
    })
    
}

function getAllDetials(listings,user,link) {
    return new Promise(async (resolve) => {
        const promises =listings.map(async  listing => {
            console.log(link);
            return await proccess(listing,user,link);
        });
        const promisesDone = Promise.all(promises);
        resolve(true);
    })
    
}

async function proccess(listing,user,link) {
    return new Promise(async (resolve) => {
        sendEmail.sendEmail(link,user['E-mail'],listing.itemId,listing.priceInfo.priceCents,listing.vipUrl,listing.title)
            .then((result) => {
                resolve(true);
            })
            .catch(err => {
                resolve(true);
            })
    })
}

async function buildModelsQuery(set) {
    const category = searchCategory(Array.from(set).pop());
    let stringModelQuery = '';
    for (let modal of set) {
        if (modal && modal != null && modal != 'alle modellen') {
            let formatedModal = modal.replace(' ', '%20')
            stringModelQuery += '&attributeLabels[]=' + formatedModal + '';
        }
    }
    let valid = true;
    if (category && category.length > 0) {
        stringModelQuery += '&l1CategoryId=' + category[0].parentId + '&l2CategoryId=' + category[0].id;
        valid = true;
    }
    else {
        stringModelQuery += '&l1CategoryId=820';
        valid = false;
    }
    return {string:stringModelQuery,valid:valid};
}
