const { GoogleSpreadsheet } = require('google-spreadsheet');

const { promisify } = require('util');
const creds = require('./Markplats-00ab3a6d201e.json');

const categories = require('./categories.json');

module.exports.getSheet = () => {
    accessSpreedSheet();
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

async function constructQuery(product,modelMap,user) {
    let queryString = 'limit=100&offset=0';
    console.log(user);
    queryString += '&postcode=' + user.Postal; 
    if (product.Rubric && product.Rubric != null){
        queryString += await buildModelsQuery(modelMap.get(product.Rubric));
    }
    console.log(queryString)
}

async function buildModelsQuery(set) {
    let stringModelQuery = '';
    for(let modal of set){
        if (modal && modal != null && modal != 'alle modellen'){
            stringModelQuery += '&attributesByKey[]="' + modal +'"';
        }
    }
    return stringModelQuery;
}
