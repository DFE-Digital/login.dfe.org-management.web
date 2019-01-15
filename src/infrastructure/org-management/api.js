const config = require('./../config');
const KeepAliveAgent = require('agentkeepalive').HttpsAgent;

const rp = require('login.dfe.request-promise-retry').defaults({
  agent: new KeepAliveAgent({
    maxSockets: config.hostingEnvironment.agentKeepAlive.maxSockets,
    maxFreeSockets: config.hostingEnvironment.agentKeepAlive.maxFreeSockets,
    timeout: config.hostingEnvironment.agentKeepAlive.timeout,
    keepAliveTimeout: config.hostingEnvironment.agentKeepAlive.keepAliveTimeout,
  }),
});

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


module.exports = {
  getPageOfOrganisations,
  searchOrganisations,
  createOrganisation,
  getOrganisationById,
  updateOrganisation,
};
