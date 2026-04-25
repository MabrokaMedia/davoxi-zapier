'use strict';

// Inline copy of AGENT_LIMITS from @davoxi/validation (packages/validation/src/constants.ts).
// Kept in sync manually — update when the source constants change.
const AGENT_LIMITS = {
  DESCRIPTION_MAX: 5_000,
  SYSTEM_PROMPT_MAX: 10_000,
  TRIGGER_TAGS_MAX: 20,
  TRIGGER_TAG_LENGTH_MAX: 100,
  KNOWLEDGE_SOURCES_MAX: 10,
  AGENT_ID_MAX: 50,
  AGENT_ID_PATTERN: /^[a-zA-Z0-9_-]+$/,
};

module.exports = { AGENT_LIMITS };
