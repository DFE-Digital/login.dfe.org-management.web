jest.mock('./../../../src/infrastructure/config', () => require('./../../utils').configMockFactory());
jest.mock('./../../../src/infrastructure/logger', () => require('./../../utils').loggerMockFactory());
jest.mock('./../../../src/infrastructure/org-management');

const { getRequestMock, getResponseMock } = require('./../../utils');
const postNewOrganisation = require('./../../../src/app/organisations/newOrganisation').postNewOrganisation;
const { updateOrganisation, createOrganisation } = require('./../../../src/infrastructure/org-management');

const res = getResponseMock();

describe('when creating or editing an organisation', () => {
  let req;

  beforeEach(() => {
    req = getRequestMock({
      body: {
        name: 'org1',
        urn: '12345',

      }
    });

    updateOrganisation.mockReset();
    createOrganisation.mockReset();
    res.mockResetAll();
  });

  it('then it should render view with validation if organisation name not entered', async () => {
    req.body.name = undefined;

    await postNewOrganisation(req, res);
    expect(res.render.mock.calls).toHaveLength(1);
    expect(res.render.mock.calls[0][0]).toBe('organisations/views/newOrganisation');
    expect(res.render.mock.calls[0][1]).toEqual({
      csrfToken: 'token',
      name: '',
      urn: '12345',
      backLink: true,
      category: {
        id: '004',
      },
      validationMessages: {
        name: 'Organisation name must be entered',
      }
    });
  });

  it('then it should create an organisation if new org', async () => {
    await postNewOrganisation(req, res);

    expect(createOrganisation.mock.calls).toHaveLength(1);
    expect(createOrganisation.mock.calls[0][0]).toEqual({
      name: 'org1',
      urn: '12345',
      category: {
        id: '004'
      }
    });
    expect(createOrganisation.mock.calls[0][1]).toBe('correlationId');
  });

  it('then it should update an organisation if org exists', async () => {
    req.params.orgId = 'org1';
    await postNewOrganisation(req, res);

    expect(updateOrganisation.mock.calls).toHaveLength(1);
    expect(updateOrganisation.mock.calls[0][0]).toEqual('org1');
    expect(updateOrganisation.mock.calls[0][1]).toEqual({
      name: 'org1',
      urn: '12345',
      category: {
        id: '004'
      }
    });
    expect(updateOrganisation.mock.calls[0][2]).toBe('correlationId');
  });


  it('then a flash message is displayed showing org added', async () => {
    await postNewOrganisation(req, res);

    expect(res.flash.mock.calls).toHaveLength(1);
    expect(res.flash.mock.calls[0][0]).toBe('info');
    expect(res.flash.mock.calls[0][1]).toBe(`Organisation successfully added`)
  });

  it('then a flash message is displayed showing org updated', async () => {
    req.params.orgId = 'org1';
    await postNewOrganisation(req, res);

    expect(res.flash.mock.calls).toHaveLength(1);
    expect(res.flash.mock.calls[0][0]).toBe('info');
    expect(res.flash.mock.calls[0][1]).toBe(`Organisation successfully updated`)
  });


  it('then it should redirect to list of orgs', async () => {
    await postNewOrganisation(req, res);

    expect(res.redirect.mock.calls).toHaveLength(1);
    expect(res.redirect.mock.calls[0][0]).toBe(`/organisations`);
  });

});
