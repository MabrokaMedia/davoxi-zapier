'use strict';

const { makeRequest } = require('../lib/client');

const perform = async (z, bundle) => {
  const businesses = await makeRequest(z, bundle, 'GET', '/businesses');

  // Sort by created_at descending so Zapier sees newest first
  return businesses.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

module.exports = {
  key: 'new_business',
  noun: 'Business',
  display: {
    label: 'New Business',
    description: 'Triggers when a new business is created in Davoxi.',
  },
  operation: {
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
    outputFields: [
      { key: 'business_id', label: 'Business ID', type: 'string' },
      { key: 'name', label: 'Name', type: 'string' },
      { key: 'phone_numbers', label: 'Phone Numbers' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
      { key: 'updated_at', label: 'Updated At', type: 'datetime' },
    ],
  },
};
