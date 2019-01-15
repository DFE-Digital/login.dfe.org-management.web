'use strict';
const { createOrganisation, getOrganisationById, updateOrganisation } = require('./../../../src/infrastructure/org-management');

const getNewOrganisation = async (req, res) => {
  const organisation = req.params.orgId ? await getOrganisationById(req.params.orgId, req.id) : '';

  const model = {
    csrfToken: req.csrfToken(),
    name: organisation.name,
    urn: organisation.urn,
    category: {
      id: '004'
    },
    validationMessages: {},
    backLink: true,
    organisationId: req.params.orgId,
  };

  res.render('organisations/views/newOrganisation', model);
};

const validate = async (req) => {
  const model = {
    name: req.body.name || '',
    urn: req.body.urn || '',
    category: {
      id: '004'
    },
    backLink: './',
    validationMessages: {},
  };

  if (!model.name || model.name.trim().length === 0) {
    model.validationMessages.name = 'Organisation name must be entered'
  }
  return model;
};

const postNewOrganisation = async (req, res) => {
  const model = await validate(req);
  if (Object.keys(model.validationMessages).length > 0) {
    model.csrfToken = req.csrfToken();
    return res.render('organisations/views/newOrganisation', model);
  }

  const organisation = {
    name: model.name,
    urn: model.urn,
    category: model.category
  };

  req.params.orgId ? await updateOrganisation(req.params.orgId, organisation, req.id) : createOrganisation(organisation, req.id);

  req.params.orgId ? res.flash('info', `Organisation successfully updated`) : res.flash('info', `Organisation successfully added`);
  res.redirect('/organisations');
};

module.exports = {
  getNewOrganisation,
  postNewOrganisation,
};
