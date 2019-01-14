'use strict';
const { getPageOfOrganisations, searchOrganisations } = require('./../../infrastructure/org-management');


const getPage = async (req) => {
  const paramsSource = req.method === 'POST' ? req.body : req.query;
  let page = paramsSource.page ? parseInt(paramsSource.page) : 1;
  let criteria = paramsSource.criteria;
  if (!criteria) {
    criteria = '';
  }

  if (isNaN(page)) {
    page = 1;
  }
  return await searchOrganisations(criteria, page, req.id);
};

const getOrganisations = async (req, res) => {
  const result = await getPage(req);
  return res.render('organisations/views/organisations', {
    organisations: result.organisations,
    page: result.page,
    totalNumberOfPages: result.totalNumberOfPages,
    totalNumberOfRecords: result.totalNumberOfRecords,
    criteria: result.criteria,
    csrfToken: req.csrfToken(),
  });
};

const postOrganisations = async (req, res) => {
  const result = await getPage(req);
  return res.render('organisations/views/organisations', {
    organisations: result.organisations,
    page: result.page,
    totalNumberOfPages: result.totalNumberOfPages,
    totalNumberOfRecords: result.totalNumberOfRecords,
    criteria: result.criteria,
    csrfToken: req.csrfToken(),
  });
};

module.exports = {
  getOrganisations,
  postOrganisations,
};
