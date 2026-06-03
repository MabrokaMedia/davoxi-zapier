'use strict';

// Unit tests for the input-hardening validation added to creates/* and searches/*.
// These tests stub `lib/client` so no HTTP is performed; we only assert that the
// `perform` function rejects bad input or coerces ambiguous input as intended.

jest.mock('../lib/client', () => ({
  makeRequest: jest.fn().mockResolvedValue({ ok: true }),
}));

const { makeRequest } = require('../lib/client');
const createAgent = require('../creates/create_agent');
const createBusiness = require('../creates/create_business');
const findBusiness = require('../searches/find_business');

const z = {
  errors: {
    Error: class ZapierError extends Error {
      constructor(msg) {
        super(msg);
        this.name = 'ZapierError';
      }
    },
  },
};

beforeEach(() => {
  makeRequest.mockClear();
  makeRequest.mockResolvedValue({ ok: true });
});

describe('create_agent — trigger_tags per-tag length', () => {
  const baseBundle = {
    inputData: {
      business_id: 'biz_1',
      description: 'd',
      system_prompt: 'p',
    },
  };

  test('accepts tags within 100 chars', async () => {
    const bundle = {
      ...baseBundle,
      inputData: {
        ...baseBundle.inputData,
        trigger_tags: ['booking', 'a'.repeat(100)].join(','),
      },
    };
    await expect(createAgent.operation.perform(z, bundle)).resolves.toBeDefined();
    expect(makeRequest).toHaveBeenCalledTimes(1);
    const body = makeRequest.mock.calls[0][4];
    expect(body.trigger_tags).toEqual(['booking', 'a'.repeat(100)]);
  });

  test('rejects when any tag exceeds 100 chars', async () => {
    const bundle = {
      ...baseBundle,
      inputData: {
        ...baseBundle.inputData,
        trigger_tags: 'short, ' + 'x'.repeat(101),
      },
    };
    await expect(createAgent.operation.perform(z, bundle)).rejects.toThrow(/most 100 characters/);
    expect(makeRequest).not.toHaveBeenCalled();
  });
});

describe('create_agent — enabled boolean coercion', () => {
  const base = {
    inputData: {
      business_id: 'biz_1',
      description: 'd',
      system_prompt: 'p',
    },
  };

  async function runWith(enabled) {
    makeRequest.mockClear();
    await createAgent.operation.perform(z, {
      ...base,
      inputData: { ...base.inputData, enabled },
    });
    return makeRequest.mock.calls[0][4].enabled;
  }

  test('true / "true" / 1 / "1" -> true', async () => {
    expect(await runWith(true)).toBe(true);
    expect(await runWith('true')).toBe(true);
    expect(await runWith(1)).toBe(true);
    expect(await runWith('1')).toBe(true);
  });

  test('any other value -> false (does not slip through truthy)', async () => {
    expect(await runWith('false')).toBe(false);
    expect(await runWith(false)).toBe(false);
    expect(await runWith('no')).toBe(false);
    expect(await runWith(0)).toBe(false);
  });

  test('omitted means key not set on body', async () => {
    makeRequest.mockClear();
    await createAgent.operation.perform(z, base);
    const body = makeRequest.mock.calls[0][4];
    expect(body).not.toHaveProperty('enabled');
  });
});

describe('create_business — voice_config length caps', () => {
  test('rejects voice longer than VOICE_MAX', async () => {
    await expect(
      createBusiness.operation.perform(z, {
        inputData: { name: 'Acme', voice: 'a'.repeat(65) },
      }),
    ).rejects.toThrow(/voice must be at most 64/);
  });

  test('rejects language longer than LANGUAGE_MAX', async () => {
    await expect(
      createBusiness.operation.perform(z, {
        inputData: { name: 'Acme', language: 'a'.repeat(17) },
      }),
    ).rejects.toThrow(/language must be at most 16/);
  });

  test('rejects personality_prompt longer than PERSONALITY_PROMPT_MAX', async () => {
    await expect(
      createBusiness.operation.perform(z, {
        inputData: { name: 'Acme', personality_prompt: 'a'.repeat(10_001) },
      }),
    ).rejects.toThrow(/personality_prompt must be at most 10000/);
  });

  test('accepts within-cap voice_config', async () => {
    await expect(
      createBusiness.operation.perform(z, {
        inputData: {
          name: 'Acme',
          voice: 'alloy',
          language: 'en',
          personality_prompt: 'Be helpful.',
        },
      }),
    ).resolves.toBeDefined();
  });

  test('rejects empty / non-string name', async () => {
    await expect(
      createBusiness.operation.perform(z, { inputData: { name: '' } }),
    ).rejects.toThrow(/name is required/);
    await expect(
      createBusiness.operation.perform(z, { inputData: { name: 12345 } }),
    ).rejects.toThrow(/name is required/);
  });

  test('rejects name longer than NAME_MAX', async () => {
    await expect(
      createBusiness.operation.perform(z, {
        inputData: { name: 'a'.repeat(201) },
      }),
    ).rejects.toThrow(/name is required and must be at most 200 characters/);
  });
});

describe('find_business — name type-check', () => {
  test('rejects non-string name', async () => {
    await expect(
      findBusiness.operation.perform(z, { inputData: { name: 12345 } }),
    ).rejects.toThrow(/name is required/);
  });

  test('rejects empty name', async () => {
    await expect(
      findBusiness.operation.perform(z, { inputData: { name: '' } }),
    ).rejects.toThrow(/name is required/);
  });

  test('passes name through and filters case-insensitively', async () => {
    makeRequest.mockResolvedValue([
      { name: 'Acme Corp' },
      { name: 'Other LLC' },
      { name: 'acme partners' },
    ]);
    const result = await findBusiness.operation.perform(z, {
      inputData: { name: 'ACME' },
    });
    expect(result).toEqual([{ name: 'Acme Corp' }, { name: 'acme partners' }]);
  });

  test('skips non-string business names without throwing', async () => {
    makeRequest.mockResolvedValue([
      { name: 'Acme Corp' },
      { name: undefined },
      { name: null },
    ]);
    const result = await findBusiness.operation.perform(z, {
      inputData: { name: 'acme' },
    });
    expect(result).toEqual([{ name: 'Acme Corp' }]);
  });
});
