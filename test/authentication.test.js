'use strict';

const zapier = require('zapier-platform-core');
const App = require('../index');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

const REAL_API_KEY = process.env.DAVOXI_TEST_API_KEY;
const itIntegration = REAL_API_KEY ? test : test.skip;

describe('authentication', () => {
  itIntegration('valid API key authenticates', async () => {
    const bundle = {
      authData: { api_key: REAL_API_KEY },
    };

    const result = await appTester(App.authentication.test, bundle);
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('user_id');
  });

  // The negative test does NOT require a real key — the API rejects the
  // invalid token without ever consulting auth state.
  test('invalid API key returns 401', async () => {
    const bundle = {
      authData: { api_key: 'sk_invalid_key' },
    };

    await expect(
      appTester(App.authentication.test, bundle)
    ).rejects.toThrow();
  });
});
