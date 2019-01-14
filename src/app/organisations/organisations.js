'use strict';
const { getPageOfOrganisations } = require('./../../infrastructure/org-management');


const getPage = async (req) => {
  const paramsSource = req.method === 'POST' ? req.body : req.query;
  let page = paramsSource.page ? parseInt(paramsSource.page) : 1;
  if (isNaN(page)) {
    page = 1;
  }
  return await getPageOfOrganisations(page, req.id);
};

const getOrganisations = async (req, res) => {
  const result = await getPage(req);
  return res.render('organisations/views/organisations', {
    organisations: result.organisations,
    page: result.page,
    totalNumberOfPages: result.totalNumberOfPages,
    totalNumberOfRecords: result.totalNumberOfRecords,
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
    csrfToken: req.csrfToken(),
  });
};

module.exports = {
  getOrganisations,
  postOrganisations,
};
