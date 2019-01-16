'use strict';
const { deleteOrganisation, getOrganisationById } = require('./../../infrastructure/org-management');

const getDeleteOrganisation = async (req, res) => {
  const organisation = await getOrganisationById(req.params.orgId, req.id);

  res.render('organisations/views/removeOrganisation', {
    organisation,
    csrfToken: req.csrfToken(),
    backLink: true,
  });
};

const postDeleteOrganisation = async (req, res) => {
  const organisationId = req.params.orgId;

  await deleteOrganisation(organisationId, req.id);
  res.flash('info', `Organisation successfully deleted`);
  res.redirect('/organisations');
};

module.exports = {
  getDeleteOrganisation,
  postDeleteOrganisation
};
