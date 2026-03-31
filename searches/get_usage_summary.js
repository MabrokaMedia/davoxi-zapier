'use strict';

const { makeRequest } = require('../lib/client');

const perform = async (z, bundle) => {
  const period = bundle.inputData.period || 'current';
  const path = `/usage/summary?period=${encodeURIComponent(period)}`;
  const summary = await makeRequest(z, bundle, 'GET', path);
  // Zapier searches must return an array
  return [summary];
};

module.exports = {
  key: 'get_usage_summary',
  noun: 'Usage Summary',
  display: {
    label: 'Get Usage Summary',
    description: 'Gets the current usage summary (total calls, minutes, and cost).',
  },
  operation: {
    inputFields: [
      {
        key: 'period',
        label: 'Period',
        type: 'string',
        helpText: 'The billing period to retrieve (e.g. "current", "2026-03"). Defaults to current period.',
        required: false,
        default: 'current',
      },
    ],
    perform,
    sample: {
      total_calls: 150,
      total_minutes: 487.5,
      total_cost: 24.38,
      period_start: '2026-03-01T00:00:00Z',
      period_end: '2026-03-31T23:59:59Z',
    },
    outputFields: [
      { key: 'total_calls', label: 'Total Calls', type: 'integer' },
      { key: 'total_minutes', label: 'Total Minutes', type: 'number' },
      { key: 'total_cost', label: 'Total Cost ($)', type: 'number' },
      { key: 'period_start', label: 'Period Start', type: 'datetime' },
      { key: 'period_end', label: 'Period End', type: 'datetime' },
    ],
  },
};
