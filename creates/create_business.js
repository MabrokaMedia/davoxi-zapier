'use strict';

const { makeRequest } = require('../lib/client');

const perform = async (z, bundle) => {
  const body = {
    name: bundle.inputData.name,
  };

  if (bundle.inputData.phone_numbers) {
    body.phone_numbers = bundle.inputData.phone_numbers
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
  }

  if (bundle.inputData.voice || bundle.inputData.language || bundle.inputData.personality_prompt) {
    body.voice_config = {};
    if (bundle.inputData.voice) body.voice_config.voice = bundle.inputData.voice;
    if (bundle.inputData.language) body.voice_config.language = bundle.inputData.language;
    if (bundle.inputData.personality_prompt) {
      body.voice_config.personality_prompt = bundle.inputData.personality_prompt;
    }
  }

  if (bundle.inputData.temperature !== undefined) {
    body.master_config = {
      temperature: parseFloat(bundle.inputData.temperature),
    };
  }

  return makeRequest(z, bundle, 'POST', '/businesses', body);
};

module.exports = {
  key: 'create_business',
  noun: 'Business',
  display: {
    label: 'Create Business',
    description: 'Creates a new business in Davoxi.',
  },
  operation: {
    inputFields: [
      {
        key: 'name',
        label: 'Business Name',
        type: 'string',
        required: true,
        helpText: 'The name of the business.',
      },
      {
        key: 'phone_numbers',
        label: 'Phone Numbers',
        type: 'string',
        required: false,
        helpText: 'Comma-separated phone numbers (e.g. +15551234567, +15559876543).',
      },
      {
        key: 'voice',
        label: 'Voice',
        type: 'string',
        required: false,
        helpText: 'Voice model to use (e.g. alloy, echo, shimmer).',
      },
      {
        key: 'language',
        label: 'Language',
        type: 'string',
        required: false,
        helpText: 'Language code (e.g. en, fr, es).',
      },
      {
        key: 'personality_prompt',
        label: 'Personality Prompt',
        type: 'text',
        required: false,
        helpText: 'The personality prompt for the AI voice agent.',
      },
      {
        key: 'temperature',
        label: 'Temperature',
        type: 'number',
        required: false,
        helpText: 'AI temperature (0-2). Lower = more deterministic, higher = more creative.',
      },
    ],
    perform,
    sample: {
      business_id: 'biz_new123',
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
      created_at: '2026-03-31T12:00:00Z',
      updated_at: '2026-03-31T12:00:00Z',
    },
  },
};
