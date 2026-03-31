'use strict';

const { makeRequest } = require('../lib/client');

const perform = async (z, bundle) => {
  const businesses = await makeRequest(z, bundle, 'GET', '/businesses');
  const query = bundle.inputData.name.toLowerCase();

  return businesses.filter((b) => b.name.toLowerCase().includes(query));
};

module.exports = {
  key: 'find_business',
  noun: 'Business',
  display: {
    label: 'Find Business',
    description: 'Finds a business by name.',
  },
  operation: {
    inputFields: [
      {
        key: 'name',
        label: 'Business Name',
        type: 'string',
        required: true,
        helpText: 'The name (or partial name) to search for.',
      },
    ],
    perform,
    sample: {
      business_id: 'biz_sample123',
      name: 'Acme Corp',
      phone_numbers: ['+15551234567'],
      voice_config: {
        voice: 'alloy',
        language: 'en',
        personality_prompt: 'You are a helpful assistant.',
      },
      master_config: {
        temperature: 0.7,
        max_specialists_per_turn: 3,
      },
      created_at: '2026-03-30T12:00:00Z',
      updated_at: '2026-03-30T12:00:00Z',
    },
  },
};
