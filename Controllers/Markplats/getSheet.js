const { GoogleSpreadsheet } = require('google-spreadsheet');

const { promisify } = require('util');
const creds = require('./Markplats-00ab3a6d201e.json');

const categories = require('./categories.json');

const prepareRequest = require('./prepareRequest');
module.exports.getSheet = () => {
    //accessSpreedSheet();
    readSheet();
}

async function readSheet() {
    const doc = new GoogleSpreadsheet('1-c5hEC4KEhW0sSTkS9kV4Rb-A2VODYqMxF1b0OqrjLA');
    await doc.useServiceAccountAuth({client_email:creds.client_email,private_key:creds.private_key});
    const info = await doc.loadInfo();
    const categoriSheet = doc.addSheet({headerValues:Object.keys(categories[1]),title:'Categories'});
   
    
    (await categoriSheet).addRows(categories);
    console.log(categories.length)
}

async function accessSpreedSheet() {
    const doc = new GoogleSpreadsheet('1-c5hEC4KEhW0sSTkS9kV4Rb-A2VODYqMxF1b0OqrjLA');
    await doc.useServiceAccountAuth({client_email:creds.client_email,private_key:creds.private_key});
    const info = await doc.loadInfo();
    console.log("info loaded");
    const sheetProduct = doc.sheetsByIndex[0];
    const sheetModels = doc.sheetsByIndex[4];
    const sheetUser = doc.sheetsByIndex[2];
    let productModels = await getUniqueModels(sheetModels);
    getProducts(sheetProduct,productModels,await getUser(sheetUser));
    /**await sheet.loadCells('A1:I50');
    const a1 =  sheet.getCell(0,1);
    for(let i=0;i<50;i++){
        for(let j=0;j<9;j++)
        console.log(sheet.getCell(i,j).formula,sheet.getCell(i,j).value);
    }**/
}

async function getUser(sheetUser) {
    const userRows = await sheetUser.getRows();
    return userRows[0];

}

async function getProducts(sheetProduct,modelRows,user) {
    const rows = await sheetProduct.getRows();
    let keys = ['On / Off','Group','Rubric','Type','Storage','Condition Product','Maximum Price','Maximum Distance','Seller Active Since'];
    rows.map(row => {
        constructQuery(row,modelRows,user);
        keys.map(key => {
        })
    })
    
}   

async function getUniqueModels(modelsRows){
    let modelsMap = new Map();
    const rowCounts = (await modelsRows.getRows()).length;
    console.log(rowCounts,modelsRows.columnCount);
    await modelsRows.loadCells(`A1:ZZ${rowCounts}`);
    for(let i=1;i<rowCounts;i++){
        let modelsSet = new Set();
        for(let j=1;j<modelsRows.columnCount;j++){
            modelsSet.add(await modelsRows.getCell(i,j).value);
        }
        modelsMap.set(modelsRows.getCell(i,0).value,modelsSet);
    }
    return modelsMap;
}

function searchCategory(reburiekModel) {
    rebriekToSearch = reburiekModel.split('_')[0];
    return(categories.filter(category => category.fullName.includes(rebriekToSearch)));
}

async function constructQuery(product,modelMap,user) {
    let queryString = 'limit=100&offset=0&sortBy=PRICE&viewOptions=list-view&searchInTitleAndDescription=true&sortOrder=DECREASING';
    queryString += '&postcode=' + user.Postal; 
    if (product.Rubric && product.Rubric != null){
        const category = searchCategory(product.Rubric);
        if (category && category.length > 0){
            queryString += '&l1CategoryId='+ category[0].parentId +'&l2CategoryId='+category[0].id;
        }
        else {
            queryString += '&l1CategoryId=820';
        }
        queryString += await buildModelsQuery(modelMap.get(product.Rubric));
    }
    if (product['Maximum Distance'] && product['Maximum Distance'] != null){
        queryString += '&distanceMeters=' +product['Maximum Distance']*1000;
    }
    if (product['Maximum Price'] && product['Maximum Price'] != null){
        queryString += '&attributeRanges[]=PriceCents%3A100%3A'+product['Maximum Price']*100;
    }
    if (product['Condition Product'] && product['Condition Product'] != null) {
        if (product['Condition Product'] == 'New'){
            queryString += '&attributesById[]=' + 30;
        }
        else if (product['Condition Product'] == 'Used'){
            queryString += '&attributesById[]=' + 32;
        }
        else if (product['Condition Product'] == 'As good as new'){
            queryString += '&attributesById[]=' + 31;
        }
        else {
            queryString += '&attributesById[]=' + 31 + '&attributesById[]=' + 32 + '&attributesById[]=' + 30 ;
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
    prepareRequest.prepareRequest(queryString)
        .then((result) => {
            if (result && result.status && result.body){
                console.log(queryString);
                getAllPrices(result.body.listings);
            }
        })
        .catch(err => {
            console.log(err);
        })
}

function getAllPrices(listings){
    console.log('new');
    listings.map(listing => {
        console.log(listing.priceInfo.priceCents / 100,listing.title)
    })
}

async function buildModelsQuery(set) {
    let stringModelQuery = '';
    for(let modal of set){
        if (modal && modal != null && modal != 'alle modellen'){
            let formatedModal = modal.replace(' ','%20')
            stringModelQuery += '&attributeLabels[]=' + formatedModal +'';
        }
    }
    return stringModelQuery;
}
