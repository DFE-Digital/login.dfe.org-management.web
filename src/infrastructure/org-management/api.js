const config = require('./../config');

const rp = require('login.dfe.request-promise-retry');

const jwtStrategy = require('login.dfe.jwt-strategies');

const callApi = async (endpoint, method, body, correlationId) => {
  const token = await jwtStrategy(config.orgManagement.service).getBearerToken();

  try {
    return await rp({
      method: method,
      uri: `${config.orgManagement.service.url}/${endpoint}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      body: body,
      json: true,
      strictSSL: config.hostingEnvironment.env.toLowerCase() !== 'dev',
    });
  } catch (e) {
    const status = e.statusCode ? e.statusCode : 500;
    if (status === 401 || status === 404) {
      return null;
    }
    if (status === 409) {
      return false;
    }
    throw e;
  }
};

const getPageOfOrganisations = async (pageNumber, correlationId) => {
  return await callApi(`organisations?page=${pageNumber}`, 'GET', undefined, correlationId);
};

const searchOrganisations = async (criteria, pageNumber, correlationId) => {
  return await callApi(`organisations?search=${criteria}&page=${pageNumber}`, 'GET', undefined, correlationId);
};

const createOrganisation = async (organisation, correlationId) => {
  return await callApi(`organisations`, 'POST', organisation, correlationId);
};

const getOrganisationById = async (orgId, correlationId) => {
  return await callApi(`organisations/${orgId}`, 'GET', undefined, correlationId);
};

const updateOrganisation = async (orgId, organisation, correlationId) => {
  return await callApi(`organisations/${orgId}`, 'PUT', organisation, correlationId);
};

const deleteOrganisation = async (orgId, correlationId) => {
  return await callApi(`organisations/${orgId}`, 'DELETE', correlationId);
};


module.exports = {
  getPageOfOrganisations,
  searchOrganisations,
  createOrganisation,
  getOrganisationById,
  updateOrganisation,
  deleteOrganisation,
};
