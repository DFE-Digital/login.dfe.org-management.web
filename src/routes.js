const config = require('./infrastructure/config');
const healthCheck = require('login.dfe.healthcheck');
const organisations = require('./app/organisations');

const routes = (app, csrf) => {
  app.use('/healthcheck', healthCheck({
    config,
  }));
  app.use('/organisations', organisations(csrf));

  app.get('/', (req, res) => {
    res.redirect('/organisations');
  });
};

module.exports = routes;
