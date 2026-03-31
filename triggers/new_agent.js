'use strict';

const { makeRequest } = require('../lib/client');

const perform = async (z, bundle) => {
  const businessId = bundle.inputData.business_id;
  const agents = await makeRequest(
    z,
    bundle,
    'GET',
    `/businesses/${encodeURIComponent(businessId)}/agents`
  );

  return agents.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

module.exports = {
  key: 'new_agent',
  noun: 'Agent',
  display: {
    label: 'New Agent',
    description: 'Triggers when a new specialist agent is created for a business.',
  },
  operation: {
    inputFields: [
      {
        key: 'business_id',
        label: 'Business',
        type: 'string',
        required: true,
        dynamic: 'new_business.business_id.name',
        helpText: 'Select the business to watch for new agents.',
      },
    ],
    perform,
    sample: {
      business_id: 'biz_sample123',
      agent_id: 'agent_sample456',
      description: 'Appointment booking specialist',
      system_prompt: 'You help callers book appointments.',
      tools: [],
      knowledge_sources: [],
      trigger_tags: ['booking', 'appointment'],
      enabled: true,
      created_at: '2026-03-30T12:00:00Z',
      updated_at: '2026-03-30T12:00:00Z',
      stats: {
        total_invocations: 0,
        resolved_invocations: 0,
        avg_latency_ms: 0,
        avg_caller_rating: 0,
        paid_boost: 0,
      },
    },
    outputFields: [
      { key: 'business_id', label: 'Business ID', type: 'string' },
      { key: 'agent_id', label: 'Agent ID', type: 'string' },
      { key: 'description', label: 'Description', type: 'string' },
      { key: 'enabled', label: 'Enabled', type: 'boolean' },
      { key: 'created_at', label: 'Created At', type: 'datetime' },
    ],
  },
};
