const getSheet = require('./getSheet');

module.exports = {
    getSheet : (req,res,next) => {
        getSheet.getSheet();
    }
}