'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const { getOrganisations, postOrganisations } = require('./organisations');
const { getNewOrganisation, postNewOrganisation } = require('./newOrganisation');

const router = express.Router({ mergeParams: true });

const organisations = (csrf) => {
  logger.info('Mounting organisations route');
  router.get('/', csrf, asyncWrapper(getOrganisations));
  router.post('/', csrf, asyncWrapper(postOrganisations));

  router.get('/new-organisation', csrf, asyncWrapper(getNewOrganisation));
  router.post('/new-organisation', csrf, asyncWrapper(postNewOrganisation));

  router.get('/:orgId', csrf, asyncWrapper(getNewOrganisation));
  router.post('/:orgId', csrf, asyncWrapper(postNewOrganisation));



  return router;
};

module.exports = organisations;
