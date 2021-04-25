const getSheet = require('./getSheet');

const createLink = require('./addLink');

const getLinks = require('./getLinks');

module.exports = {
    getSheet : (req,res,next) => {
        getSheet.getSheet();
    },

    addLink : (req,res,next) => {
        createLink.addLink(res,req.body.link);
    },
    
    getLinks: (req,res,next) => {
        getLinks.getLinks(res,'api');
    }
}