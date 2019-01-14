jest.mock('./../../../src/infrastructure/config', () => require('./../../utils').configMockFactory());
jest.mock('./../../../src/infrastructure/logger', () => require('./../../utils').loggerMockFactory());
jest.mock('./../../../src/infrastructure/org-management');

const { getRequestMock, getResponseMock } = require('./../../utils');
const getOrganisations = require('./../../../src/app/organisations/organisations').getOrganisations;
const { searchOrganisations } = require('./../../../src/infrastructure/org-management');

const res = getResponseMock();

describe('when getting the organisations list', () => {
  let req;

  beforeEach(() => {
    req = getRequestMock({
      query: {
        page: 1,
      },
    });

    searchOrganisations.mockReset();
    searchOrganisations.mockReturnValue({
      organisations: {
        id: 'organisation1'
      },
      totalNumberOfPages: 3,
      totalNumberOfRecords: 30,
    });
    res.mockResetAll();
  });

  it('then it should display the organisations view', async () => {
    await getOrganisations(req, res);

    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('organisations/views/organisations');
  });

  it('then it should get the organisations if no criteria specified', async () => {
    await getOrganisations(req, res);

    expect(searchOrganisations.mock.calls).toHaveLength(1);
    expect(searchOrganisations.mock.calls[0][0]).toBe('');
    expect(searchOrganisations.mock.calls[0][1]).toBe(1);
    expect(searchOrganisations.mock.calls[0][2]).toBe('correlationId');
  });

  it('then it should include csrf token in model', async () => {
    await getOrganisations(req, res);

    expect(res.render.mock.calls[0][1]).toMatchObject({
      csrfToken: 'token',
    });
  });

  it('then it should include organisation details in the model', async () => {
    await getOrganisations(req, res);

    expect(res.render.mock.calls[0][1]).toMatchObject({
      organisations: {
        id: 'organisation1'
      },
      totalNumberOfPages: 3,
      totalNumberOfRecords: 30,
    });
  });

  it('then it should get the specified organisation if criteria specified', async () => {
    req.query.criteria = 'organisation';
    await getOrganisations(req, res);

    expect(searchOrganisations.mock.calls).toHaveLength(1);
    expect(searchOrganisations.mock.calls[0][0]).toBe('organisation');
    expect(searchOrganisations.mock.calls[0][1]).toBe(1);
    expect(searchOrganisations.mock.calls[0][2]).toBe('correlationId');
  });


});
