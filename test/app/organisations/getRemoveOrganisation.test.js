jest.mock('./../../../src/infrastructure/config', () => require('./../../utils').configMockFactory());
jest.mock('./../../../src/infrastructure/logger', () => require('./../../utils').loggerMockFactory());
jest.mock('./../../../src/infrastructure/org-management');

const { getRequestMock, getResponseMock } = require('./../../utils');
const getRemoveOrganisation = require('./../../../src/app/organisations/removeOrganisation').getDeleteOrganisation;
const { getOrganisationById } = require('./../../../src/infrastructure/org-management');

const res = getResponseMock();

describe('when getting the remove organisation view', () => {
  let req;

  beforeEach(() => {
    req = getRequestMock({});

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

  it('then it should display the remove org view', async () => {
    await getRemoveOrganisation(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('organisations/views/removeOrganisation');
  });


  it('then it should get the selected org by id', async () => {
    req.params.orgId = 'org1';

    await getRemoveOrganisation(req, res);

    expect(getOrganisationById.mock.calls).toHaveLength(1);
    expect(getOrganisationById.mock.calls[0][0]).toBe('org1');
    expect(getOrganisationById.mock.calls[0][1]).toBe('correlationId');
  });

  it('then it should include csrf token in model', async () => {
    await getRemoveOrganisation(req, res);

    expect(res.render.mock.calls[0][1]).toMatchObject({
      csrfToken: 'token',
    });
  });

  it('then it should include selected org that is being removed in model', async () => {
    req.params.orgId = 'org1';
    await getRemoveOrganisation(req, res);

    expect(res.render.mock.calls[0][1]).toMatchObject({
      organisation: {
        id: 'org1',
        name: 'Test org',
        urn: '1234',
        category: {
          id: '004',
          name: 'Early Year Setting'
        },
        legacyId: '12345'
      },
    });
  });
});
