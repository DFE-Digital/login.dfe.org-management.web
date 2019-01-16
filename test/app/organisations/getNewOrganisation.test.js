jest.mock('./../../../src/infrastructure/config', () => require('./../../utils').configMockFactory());
jest.mock('./../../../src/infrastructure/logger', () => require('./../../utils').loggerMockFactory());
jest.mock('./../../../src/infrastructure/org-management');

const { getRequestMock, getResponseMock } = require('./../../utils');
const getNewOrganisation = require('./../../../src/app/organisations/newOrganisation').getNewOrganisation;
const { getOrganisationById } = require('./../../../src/infrastructure/org-management');

const res = getResponseMock();

describe('when getting the create or edit organisation view', () => {
  let req;

  beforeEach(() => {
    req = getRequestMock({
    });

    getOrganisationById.mockReset();
    getOrganisationById.mockReturnValue({
      id: 'org1',
      name: 'Test org',
      urn: '1234',
      category: {
        id: '004',
        name: 'Early Year Setting'
      },
      legacyId: '12345'
    });
    res.mockResetAll();
  });

  it('then it should display the create or edit org view', async () => {
    await getNewOrganisation(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('organisations/views/newOrganisation');
  });

  it('then it should get the current org by id if edit org', async () => {
    req.params.orgId = 'org1';

    await getNewOrganisation(req, res);

    expect(getOrganisationById.mock.calls).toHaveLength(1);
    expect(getOrganisationById.mock.calls[0][0]).toBe('org1');
    expect(getOrganisationById.mock.calls[0][1]).toBe('correlationId');
  });

  it('then it should include edited organisation details in the model if editing', async () => {
    req.params.orgId = 'org1';
    await getNewOrganisation(req, res);

    expect(res.render.mock.calls[0][1]).toMatchObject({
      name: 'Test org',
      urn: '1234',
      category: {
        id: '004',
      },
    });
  });

  it('then it should include csrf token in model', async () => {
    await getNewOrganisation(req, res);

    expect(res.render.mock.calls[0][1]).toMatchObject({
      csrfToken: 'token',
    });
  });

  it('then it should include no details if creating new org', async () => {
    await getNewOrganisation(req, res);

    expect(res.render.mock.calls[0][1]).toMatchObject({
      name: undefined,
      urn: undefined,
      category: {
        id: '004',
      },
    });
  });

});
