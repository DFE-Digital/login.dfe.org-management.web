'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const { getOrganisations, postOrganisations } = require('./organisations');
const { getNewOrganisation, postNewOrganisation } = require('./newOrganisation');
const { postDeleteOrganisation } = require('./removeOrganisation');

const router = express.Router({ mergeParams: true });

const organisations = (csrf) => {
  logger.info('Mounting organisations route');
  router.get('/', csrf, asyncWrapper(getOrganisations));
  router.post('/', csrf, asyncWrapper(postOrganisations));

  router.get('/new-organisation', csrf, asyncWrapper(getNewOrganisation));
  router.post('/new-organisation', csrf, asyncWrapper(postNewOrganisation));

  router.get('/:orgId', csrf, asyncWrapper(getNewOrganisation));
  router.post('/:orgId', csrf, asyncWrapper(postNewOrganisation));

  router.post('/:orgId/remove-organisation', csrf, asyncWrapper(postDeleteOrganisation));

  return router;
};

module.exports = organisations;
