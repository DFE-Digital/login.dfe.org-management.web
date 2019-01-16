'use strict';
const { deleteOrganisation } = require('./../../infrastructure/org-management');

const postDeleteOrganisation = async (req, res) => {
  const organisationId = req.params.orgId;

  await deleteOrganisation(organisationId, req.id);
  res.flash('info', `Organisation successfully deleted`);
  res.redirect('/organisations');
};

module.exports = {
  postDeleteOrganisation
};
