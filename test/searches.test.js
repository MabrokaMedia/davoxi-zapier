'use strict';

const zapier = require('zapier-platform-core');
const App = require('../index');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

const bundle = {
  authData: { api_key: process.env.DAVOXI_TEST_API_KEY || 'sk_test_zapier' },
  inputData: {},
};

describe('searches', () => {
  test('find_business filters by name', async () => {
    const searchBundle = {
      ...bundle,
      inputData: { name: 'test' },
    };
    const results = await appTester(
      App.searches.find_business.operation.perform,
      searchBundle
    );
    expect(Array.isArray(results)).toBe(true);
    for (const biz of results) {
      expect(biz.name.toLowerCase()).toContain('test');
    }
  });

  test('get_usage_summary returns an array with one item', async () => {
    const results = await appTester(
      App.searches.get_usage_summary.operation.perform,
      bundle
    );
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(1);
    expect(results[0]).toHaveProperty('total_calls');
    expect(results[0]).toHaveProperty('total_minutes');
    expect(results[0]).toHaveProperty('total_cost');
  });
});
