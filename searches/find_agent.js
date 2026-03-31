'use strict';

const { makeRequest } = require('../lib/client');

const perform = async (z, bundle) => {
  const agents = await makeRequest(
    z,
    bundle,
    'GET',
    `/businesses/${encodeURIComponent(bundle.inputData.business_id)}/agents`
  );
  const query = bundle.inputData.description.toLowerCase();

  return agents.filter((a) => a.description.toLowerCase().includes(query));
};

module.exports = {
  key: 'find_agent',
  noun: 'Agent',
  display: {
    label: 'Find Agent',
    description: 'Finds a specialist agent by description within a business.',
  },
  operation: {
    inputFields: [
      {
        key: 'business_id',
        label: 'Business',
        type: 'string',
        required: true,
        dynamic: 'new_business.business_id.name',
        helpText: 'Select the business to search agents in.',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: true,
        helpText: 'The description (or partial description) to search for.',
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
  },
};
