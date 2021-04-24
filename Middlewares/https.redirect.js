const app = require('express')();

module.exports = app.all('*', (req, res, next) => {
    if (req.secure) {
      return next();
    }
    else {
      res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
    }
  });