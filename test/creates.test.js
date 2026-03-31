'use strict';

const zapier = require('zapier-platform-core');
const App = require('../index');

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

const bundle = {
  authData: { api_key: 'sk_test_zapier' },
  inputData: {},
};

describe('creates', () => {
  test('create_business sends correct payload', async () => {
    const createBundle = {
      ...bundle,
      inputData: {
        name: 'Zapier Test Business',
        phone_numbers: '+15551234567, +15559876543',
        voice: 'alloy',
        language: 'en',
        personality_prompt: 'You are a test agent.',
        temperature: '0.7',
      },
    };

    const result = await appTester(
      App.creates.create_business.operation.perform,
      createBundle
    );
    expect(result).toHaveProperty('business_id');
    expect(result.name).toBe('Zapier Test Business');
  });

  test('create_agent sends correct payload', async () => {
    // Get a business first
    const businesses = await appTester(
      App.triggers.new_business.operation.perform,
      bundle
    );
    if (businesses.length === 0) {
      console.log('No businesses to test agent creation, skipping');
      return;
    }

    const createBundle = {
      ...bundle,
      inputData: {
        business_id: businesses[0].business_id,
        description: 'Zapier Test Agent',
        system_prompt: 'You are a test specialist.',
        trigger_tags: 'test, zapier',
        enabled: true,
      },
    };

    const result = await appTester(
      App.creates.create_agent.operation.perform,
      createBundle
    );
    expect(result).toHaveProperty('agent_id');
    expect(result.description).toBe('Zapier Test Agent');
  });
});
