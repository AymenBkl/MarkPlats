const getSheet = require('./getSheet');

const createLink = require('./addLink');

const getLinks = require('./getLinks');

const deleteLink = require('./deleteLink');

const updateStore = require('./updateLink');

module.exports = {
    getSheet : (req,res,next) => {
        getLinks.getLinks(res,'sheet');
    },

    addLink : (req,res,next) => {
        createLink.addLink(res,req.body.link,req.body.name);
    },
    
    getLinks: (req,res,next) => {
        getLinks.getLinks(res,'api');
    },

    deleteLink: (req,res,next) => {
        deleteLink.deleteLink(res,req.body.link)
    },

    updateLink : (req,res,next) => {
        const query = {
            $set: {
                expiration: req.body.date,

            }
        }
        updateStore.updateStore(res,req.body.storeId,query);
    }
}