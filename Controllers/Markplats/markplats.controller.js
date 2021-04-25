const getSheet = require('./getSheet');

const createLink = require('./addLink');

const getLinks = require('./getLinks');

const deleteLink = require('./deleteLink');
module.exports = {
    getSheet : (req,res,next) => {
        getSheet.getSheet();
    },

    addLink : (req,res,next) => {
        createLink.addLink(res,req.body.link);
    },
    
    getLinks: (req,res,next) => {
        getLinks.getLinks(res,'api');
    },

    deleteLink: (req,res,next) => {
        deleteLink.deleteLink(res,req.body.link)
    }
}