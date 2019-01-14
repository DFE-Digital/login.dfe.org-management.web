const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const logger = require('./infrastructure/logger');
const https = require('https');
const path = require('path');
const config = require('./infrastructure/config');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const sanitization = require('login.dfe.sanitization');
const csurf = require('csurf');
const { getErrorHandler } = require('login.dfe.express-error-handling');

const registerRoutes = require('./routes');


const init = async () => {
  const csrf = csurf({
    cookie: {
      secure: true,
      httpOnly: true,
    },
  });
  const app = express();
  app.use(helmet({
    noCache: true,
    frameguard: {
      action: 'deny',
    },
  }));


  Object.assign(app.locals, {
    app: {
      title: config.hostingEnvironment.organisationType,
    },
  });
  if (config.hostingEnvironment.env !== 'dev') {
    app.set('trust proxy', 1);
  }

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser());
  app.use(sanitization());
  app.set('view engine', 'ejs');
  app.set('views', path.resolve(__dirname, 'app'));
  app.use(expressLayouts);
  app.set('layout', 'layouts/layout');

  registerRoutes(app, csrf);

  // Error handing
  app.use(getErrorHandler({
    logger,
  }));

  if (config.hostingEnvironment.env === 'dev') {
    app.proxy = true;

    const options = {
      key: config.hostingEnvironment.sslKey,
      cert: config.hostingEnvironment.sslCert,
      requestCert: false,
      rejectUnauthorized: false,
    };
    const server = https.createServer(options, app);

    server.listen(config.hostingEnvironment.port, () => {
      logger.info(`Dev server listening on https://${config.hostingEnvironment.host}:${config.hostingEnvironment.port} with config:\n${JSON.stringify(config)}`);
    });
  } else {
    app.listen(process.env.PORT, () => {
      logger.info(`Server listening on http://${config.hostingEnvironment.host}:${config.hostingEnvironment.port}`);
    });
  }
  return app;
};

const app = init().catch(((err) => {
  logger.error(err);
}));

module.exports = app;
