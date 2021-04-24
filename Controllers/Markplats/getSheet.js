const googleSheet = require('google-spreadsheet');

const { promisify } = require('util');
const creds = require('./Markplats-00ab3a6d201e.json');

module.exports.getSheet = () => {
    accessSpreedSheet();
}

async function accessSpreedSheet() {
    const doc = new googleSheet('1-c5hEC4KEhW0sSTkS9kV4Rb-A2VODYqMxF1b0OqrjLA');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    console.log(info);
}