jest.mock('./../../../src/infrastructure/config', () => require('./../../utils').configMockFactory());
jest.mock('./../../../src/infrastructure/logger', () => require('./../../utils').loggerMockFactory());
jest.mock('./../../../src/infrastructure/org-management');

const { getRequestMock, getResponseMock } = require('./../../utils');
const postDeleteOrganisation = require('./../../../src/app/organisations/removeOrganisation').postDeleteOrganisation;
const { deleteOrganisation } = require('./../../../src/infrastructure/org-management');

const res = getResponseMock();

describe('when removing an organisation', () => {
  let req;

  beforeEach(() => {
    req = getRequestMock({
      params: {
        orgId: 'org1',
      }
    });
    deleteOrganisation.mockReset();
    deleteOrganisation.mockReset();
    res.mockResetAll();
  });

  it('then it should remove the organisation', async () => {
    await postDeleteOrganisation(req, res);

    expect(deleteOrganisation.mock.calls).toHaveLength(1);
    expect(deleteOrganisation.mock.calls[0][0]).toEqual('org1');
    expect(deleteOrganisation.mock.calls[0][1]).toBe('correlationId');
  });

  it('then a flash message is displayed showing org removed', async () => {
    await postDeleteOrganisation(req, res);

    expect(res.flash.mock.calls).toHaveLength(1);
    expect(res.flash.mock.calls[0][0]).toBe('info');
    expect(res.flash.mock.calls[0][1]).toBe(`Organisation successfully deleted`)
  });

  it('then it should redirect to list of orgs', async () => {
    await postDeleteOrganisation(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe(`/organisations`);
  });
});
