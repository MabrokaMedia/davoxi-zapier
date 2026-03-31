'use strict';

const { makeRequest } = require('./lib/client');

const test = async (z, bundle) => {
  const profile = await makeRequest(z, bundle, 'GET', '/users/me');
  return profile;
};

const authentication = {
  type: 'custom',
  fields: [
    {
      computed: false,
      key: 'api_key',
      required: true,
      label: 'API Key',
      type: 'string',
      helpText:
        'Your Davoxi API key. Find it in your [Davoxi Dashboard](https://app.davoxi.com) under Settings > API Keys.',
    },
  ],
  test,
  connectionLabel: '{{email}}',
};

module.exports = authentication;
