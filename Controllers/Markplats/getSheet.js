const { GoogleSpreadsheet } = require('google-spreadsheet');

const { promisify } = require('util');
const creds = require('./Markplats-00ab3a6d201e.json');

const categories = require('./categories.json');

const sendEmail = require('./sendEmail');

const models = require('./models.json');

let docs = new Map();
const prepareRequest = require('./prepareRequest');
const { title } = require('process');
module.exports.getSheet = async (link, index) => {
    return new Promise(async (resolve) => {
        console.log('here');
        const promise = await accessSpreedSheet(link, index);
        resolve(promise);
    })
}


module.exports.prepareAuth = (store, index) => {
    
    return new Promise(async (resolve) => {
        let link = store.link;
        try {
            docs.set(link, new GoogleSpreadsheet(link));
            await docs.get(link).useServiceAccountAuth({ client_email: creds.client_email, private_key: creds.private_key });
            await docs.get(link).loadInfo();
            resolve(index + 1);
        }
        catch (err) {
            resolve(index + 1);

        }


    })
}



async function accessSpreedSheet(link, index) {
    return new Promise(async (resolve) => {
        const doc = docs.get(link);
        await doc.loadInfo();
        if (doc && doc != null) {
            const sheetProduct = doc.sheetsByTitle['Products'];
            const sheetModels = doc.sheetsByTitle['rubriek_model'];
            const sheetUser = doc.sheetsByTitle['Settings'];
            let productModels = await getUniqueModels(sheetModels);
            await getProducts(sheetProduct, productModels, await getUser(sheetUser), link);
            setTimeout(() => {
                resolve(index + 1);
            },1800000);
        }
        else {
            setTimeout(() => {
                resolve(index+1)
            },1800000)
        }

    })

}

async function getUser(sheetUser) {
    const userRows = await sheetUser.getRows();
    return userRows[0];

}

async function getProducts(sheetProduct, modelRows, user, link) {
    return new Promise(async (resolve) => {
        const rows = await sheetProduct.getRows();
        let index = 0;
        let keys = ['On / Off', 'Group', 'Rubric', 'Type', 'Storage', 'Condition Product', 'Maximum Price', 'Maximum Distance', 'Seller Active Since'];
        while (index < rows.length) {
            if (rows[index]['On / Off'] == 'Off ☹') {
                index += 1;
            }
            else {
                index = await constructQuery(rows[index], modelRows, user, index, link);
            }
        }
        console.log('finished from while');
        resolve(true);
    })

}

async function getUniqueModels(modelsRows) {
    let modelsMap = new Map();
    const rowCounts = (await modelsRows.getRows()).length;
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

async function constructQuery(product, modelMap, user, i, link) {
    return new Promise(async (resolve, reject) => {
        let queryString = 'limit=100&offset=0&sortBy=PRICE&viewOptions=list-view&searchInTitleAndDescription=true&sortOrder=DECREASING';
        queryString += '&postcode=' + user.Postal;
        let buildedModelsQuery = { valid: false, queryString: '' };
        let productSet = modelMap.get(product.Rubric);
        queryString += await affectDistance(queryString,product);
        queryString += await affectPrice(queryString,product);
        queryString += await affectStorage(queryString,product);
        queryString += await affectCondition(queryString,product);
        queryString += await affectLognPlace(queryString,product);
        if (product.Rubric && product.Rubric != null) {
            buildedModelsQuery = await (await buildModelsQuery(productSet, queryString, user, link))
            queryString += buildedModelsQuery.string;
        }
        if (buildedModelsQuery.valid) {
            console.log('entered', i, queryString + '\n');
            await nextPage(0, queryString, user, link, Array.from(productSet));
            resolve(i + 1);
        }
        else {
            resolve(i + 1);
        }
    })

}

async function affectPrice(queryString,product){
    return new Promise((resolve) => {
        if (product['Maximum Price'] && product['Maximum Price'] != null) {
            console.log(product['Maximum Price'])
            resolve('&attributeRanges[]=PriceCents%3A3000%3A' + product['Maximum Price'] * 100);
        }
        else {
            resolve('');
        }
    })
}

async function affectDistance(queryString,product){
    return new Promise((resolve) => {
        if (product['Maximum Distance'] && product['Maximum Distance'] != null) {
            resolve('&distanceMeters=' + product['Maximum Distance'] * 1000);
        }
        else {
            resolve('');
        }
    })
}

async function affectStorage(queryString,product){
    return new Promise((resolve) => {
        let newQueryString = ''
        if (product['Storage'] && product['Storage'] != null) {
            if (product['Storage'] == '16gb') {
                newQueryString += '&attributesById[]=' + 12821;
            }
            else if (product['Storage'] == '32gb') {
                newQueryString += '&attributesById[]=' + 12822;
            }
            else if (product['Storage'] == '64gb') {
                newQueryString += '&attributesById[]=' + 12823;
            }
            else if (product['Storage'] == '128gb') {
                newQueryString += '&attributesById[]=' + 12824;
            }
            else if (product['Storage'] == '256gb') {
                newQueryString += '&attributesById[]=' + 12825;
            }
            else if (product['Storage'] == '512gb') {
                newQueryString += '&attributesById[]=' + 12826;
            }
            else if (product['Storage'] == '8gb') {
                newQueryString += '&attributesById[]=' + 12820;
            }
            else if (product['Storage'] == '1tb') {
                newQueryString += '&attributesById[]=' + 12820;
            }
            resolve(newQueryString);
        }
        else {
            resolve(newQueryString);
        }
    })
}

async function affectCondition(queryString,product){
    return new Promise((resolve) => {
        let newQueryString = '';
        if (product['Condition Product'] && product['Condition Product'] != null) {
            if (product['Condition Product'] == 'Nieuw') {
                newQueryString += '&attributesById[]=' + 30;
            }
            else if (product['Condition Product'] == 'Gebruikt') {
                newQueryString += '&attributesById[]=' + 32;
            }
            else if (product['Condition Product'] == 'Zo goed als nieuw') {
                newQueryString += '&attributesById[]=' + 31;
            }
            else {
                newQueryString += '&attributesById[]=' + 31 + '&attributesById[]=' + 32 + '&attributesById[]=' + 30;
            }
            console.log('newQueryString',newQueryString);
            resolve(newQueryString);
        }
        else {
            resolve(newQueryString);
        }
    })
}

async function affectLognPlace(queryString,product){
    return new Promise((resolve) => {
        if (product['How Long Placed'] && product['How Long Placed'] != null){
            let longPlace = product['How Long Placed'].replace(' ','%20');
            resolve('&attributesByKey[]=offeredSince%3A'+longPlace);
        }
        else {
            resolve('');
        }
    })
}



async function nextPage(page, queryString, user, link, productSet) {
    return new Promise(async (resolve) => {
        prepareRequest.prepareRequest(queryString)
            .then(async (result) => {
                setTimeout(async () => {
                    if (result && result.status && result.body) {
                        await getAllDetials(result.body.listings, user, link, productSet);
                        console.log(result.body.listings.length,page,result.body.listings.length == 100 && page < 3);
                        if (result.body.listings.length == 100 && page < 3) {
                            queryString = queryString.replace('offset=' + page * 100, 'offset=' + Number((page + 1) * 100));
                            await nextPage(page + 1, queryString, user, link, productSet);
                            resolve(true);
                        }
                        else {
                            resolve(true);
                        }
                    }
                    else {
                        resolve(true);
                    }
                }, 2000)

            })
            .catch(err => {
                setTimeout(() => {
                    console.log(err);
                    resolve(true);
                }, 2000)

            })
    })

}

function getAllDetials(listings, user, link, products) {
    return new Promise(async (resolve) => {
        const listngsLenght = listings.length;
        let index = 0;
        while (index < listngsLenght) {
            console.log(index,listings[index].title,listings[index].priceInfo.priceCents / 100);
            index = await proccess(listings[index], user, link, index, products)
        }
        resolve(true);
    })

}

async function proccess(listing, user, link, index, products) {
    let i = products.indexOf(null);
    products.splice(i,1);
    return new Promise(async (resolve) => {
        if (products.some(product => listing.title.toLowerCase().includes(product.toLowerCase()))) {
            sendEmail.sendEmail(link, user['E-mail'], listing.itemId, listing.priceInfo.priceCents / 100, listing.vipUrl, listing.title)
                        .then((result) => {
                            resolve(index + 1);
                        })
                        .catch(err => {
                            resolve(index + 1);
                        })
                    console.log(listing.title,listing.priceInfo.priceCents);
        }
        else {
            resolve(index + 1);
        }

    })
}

async function buildModelsQuery(set, queryString, user, link) {
    const category = searchCategory(Array.from(set).pop());
    let stringModelQuery = '';
    let valid = true;
    if (category && category.length > 0) {
        const model = getModel(category[0].fullName);
        if (model && model.length > 0) {
            stringModelQuery += '&attributesById[]=' + model[0].attributeValueId + '';
        }
        stringModelQuery += '&l1CategoryId=' + category[0].parentId + '&l2CategoryId=' + category[0].id;
        valid = true;
    }
    else {
        stringModelQuery += '&l1CategoryId=820';
        valid = false;
    }
    for (let modal of set) {
        if (modal && modal != null && modal != 'alle modellen') {
            const model = getModel(modal);
            if (model && model.length > 0) {
                stringModelQuery += '&attributesById[]=' + model[0].attributeValueId + '';
            }
            else {
                let structedModal = modal.replace(' ', '%20').toLowerCase();
                let result = await nextPage(0, queryString + '&query=' + structedModal + stringModelQuery, user, link, Array.from(set));
            }
        }
    }

    return { string: stringModelQuery, valid: valid };
}

async function checkIncludeTitle() {

}


function getModel(modal) {
    return (models.filter(model => model.attributeValueLabel.includes(modal)));
}