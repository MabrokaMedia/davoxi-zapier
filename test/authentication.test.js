'use strict';

const zapier = require('zapier-platform-core');
const App = require('../index');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('authentication', () => {
  test('valid API key authenticates', async () => {
    const bundle = {
      authData: { api_key: process.env.DAVOXI_TEST_API_KEY || 'sk_test_zapier' },
    };

    const result = await appTester(App.authentication.test, bundle);
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('user_id');
  });

  test('invalid API key returns 401', async () => {
    const bundle = {
      authData: { api_key: 'sk_invalid_key' },
    };

    await expect(
      appTester(App.authentication.test, bundle)
    ).rejects.toThrow();
  });
});
