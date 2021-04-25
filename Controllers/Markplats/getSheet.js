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
    getProducts(sheetProduct);
    /**await sheet.loadCells('A1:I50');
    const a1 =  sheet.getCell(0,1);
    for(let i=0;i<50;i++){
        for(let j=0;j<9;j++)
        console.log(sheet.getCell(i,j).formula,sheet.getCell(i,j).value);
    }**/
}

async function getProducts(sheetProduct,rowsRubriekth) {
    const rows = await sheetProduct.getRows();
    let keys = ['On / Off','Group','Rubric','Type','Storage','Condition Product','Maximum Price','Maximum Distance','Seller Active Since'];
    rows.map(row => {
        keys.map(key => {
            console.log(key,row[key]);
        })
    })
    
}   

