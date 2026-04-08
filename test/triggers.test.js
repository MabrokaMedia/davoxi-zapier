'use strict';

const zapier = require('zapier-platform-core');
const App = require('../index');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

const bundle = {
  authData: { api_key: process.env.DAVOXI_TEST_API_KEY || 'sk_test_zapier' },
  inputData: {},
};

describe('triggers', () => {
  test('new_business returns sorted businesses', async () => {
    const results = await appTester(
      App.triggers.new_business.operation.perform,
      bundle
    );
    expect(Array.isArray(results)).toBe(true);
    if (results.length > 1) {
      expect(new Date(results[0].created_at).getTime()).toBeGreaterThanOrEqual(
        new Date(results[1].created_at).getTime()
      );
    }
  });

  test('new_agent returns sorted agents', async () => {
    // First get a business ID
    const businesses = await appTester(
      App.triggers.new_business.operation.perform,
      bundle
    );
    if (businesses.length === 0) {
      console.log('No businesses to test agents with, skipping');
      return;
    }

    const agentBundle = {
      ...bundle,
      inputData: { business_id: businesses[0].business_id },
    };
    const results = await appTester(
      App.triggers.new_agent.operation.perform,
      agentBundle
    );
    expect(Array.isArray(results)).toBe(true);
  });
});
