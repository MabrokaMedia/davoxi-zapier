'use strict';

const { makeRequest } = require('../lib/client');
const { AGENT_LIMITS } = require('@davoxi/validation');

const perform = async (z, bundle) => {
  const body = {
    description: bundle.inputData.description,
    system_prompt: bundle.inputData.system_prompt,
  };

  // Client-side validation using shared constants
  if (!body.description || body.description.length > AGENT_LIMITS.DESCRIPTION_MAX) {
    throw new z.errors.Error(
      `Description is required and must be at most ${AGENT_LIMITS.DESCRIPTION_MAX} characters.`,
    );
  }
  if (!body.system_prompt || body.system_prompt.length > AGENT_LIMITS.SYSTEM_PROMPT_MAX) {
    throw new z.errors.Error(
      `System prompt is required and must be at most ${AGENT_LIMITS.SYSTEM_PROMPT_MAX} characters.`,
    );
  }

  if (bundle.inputData.trigger_tags) {
    body.trigger_tags = bundle.inputData.trigger_tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (body.trigger_tags.length > AGENT_LIMITS.TRIGGER_TAGS_MAX) {
      throw new z.errors.Error(
        `At most ${AGENT_LIMITS.TRIGGER_TAGS_MAX} trigger tags allowed.`,
      );
    }
  }

  if (bundle.inputData.enabled !== undefined) {
    body.enabled = bundle.inputData.enabled;
  }

  return makeRequest(
    z,
    bundle,
    'POST',
    `/businesses/${encodeURIComponent(bundle.inputData.business_id)}/agents`,
    body
  );
};

module.exports = {
  key: 'create_agent',
  noun: 'Agent',
  display: {
    label: 'Create Agent',
    description:
      'Creates a new specialist agent for a business. Specialist agents handle specific topics during calls (e.g. appointment booking, FAQ).',
  },
  operation: {
    inputFields: [
      {
        key: 'business_id',
        label: 'Business',
        type: 'string',
        required: true,
        dynamic: 'new_business.business_id.name',
        helpText: 'Select the business to add the agent to.',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'string',
        required: true,
        helpText: 'Short description of what this agent specializes in (e.g. "Appointment booking").',
      },
      {
        key: 'system_prompt',
        label: 'System Prompt',
        type: 'text',
        required: true,
        helpText: 'Instructions for the agent. Describes how it should behave when handling calls.',
      },
      {
        key: 'trigger_tags',
        label: 'Trigger Tags',
        type: 'string',
        required: false,
        helpText: 'Comma-separated tags that trigger this agent (e.g. booking, appointment, schedule).',
      },
      {
        key: 'enabled',
        label: 'Enabled',
        type: 'boolean',
        required: false,
        helpText: 'Whether the agent is active. Defaults to true.',
      },
    ],
    perform,
    sample: {
      business_id: 'biz_sample123',
      agent_id: 'agent_new456',
      description: 'Appointment booking specialist',
      system_prompt: 'You help callers book appointments.',
      tools: [],
      knowledge_sources: [],
      trigger_tags: ['booking', 'appointment'],
      enabled: true,
      created_at: '2026-03-31T12:00:00Z',
      updated_at: '2026-03-31T12:00:00Z',
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
