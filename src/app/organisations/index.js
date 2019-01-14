'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const { getOrganisations, postOrganisations } = require('./organisations');

const router = express.Router({ mergeParams: true });

const organisations = (csrf) => {
  logger.info('Mounting organisations route');
  router.get('/', csrf, asyncWrapper(getOrganisations));
  router.post('/', csrf, asyncWrapper(postOrganisations));

  return router;
};

module.exports = organisations;
