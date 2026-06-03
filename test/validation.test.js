'use strict';

// Unit tests for input validation logic added as security fixes.
// These tests do NOT require a live API key — they test validation before any HTTP call.

// Minimal mock z object that provides z.errors.Error
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

// --- get_usage_summary period validation ---

const PERIOD_RE = /^(current|\d{4}-\d{2})$/;

function validatePeriod(period, zObj) {
  if (!PERIOD_RE.test(period)) {
    throw new zObj.errors.Error('Period must be "current" or in YYYY-MM format (e.g. "2026-03").');
  }
}

describe('get_usage_summary period validation', () => {
  test('accepts "current"', () => {
    expect(() => validatePeriod('current', z)).not.toThrow();
  });

  test('accepts YYYY-MM format', () => {
    expect(() => validatePeriod('2026-03', z)).not.toThrow();
    expect(() => validatePeriod('2025-12', z)).not.toThrow();
    expect(() => validatePeriod('2024-01', z)).not.toThrow();
  });

  test('rejects empty string', () => {
    expect(() => validatePeriod('', z)).toThrow(z.errors.Error);
  });

  test('rejects arbitrary text', () => {
    expect(() => validatePeriod('last-month', z)).toThrow(z.errors.Error);
    expect(() => validatePeriod('all', z)).toThrow(z.errors.Error);
    expect(() => validatePeriod('2026', z)).toThrow(z.errors.Error);
  });

  test('rejects SQL injection attempt', () => {
    expect(() => validatePeriod("current'; DROP TABLE usage;--", z)).toThrow(z.errors.Error);
  });

  test('rejects path traversal attempt', () => {
    expect(() => validatePeriod('../../../etc', z)).toThrow(z.errors.Error);
  });
});

// --- create_business phone number validation ---

const E164_RE = /^\+\d{7,15}$/;

function validatePhoneNumbers(csv, zObj) {
  const phones = csv.split(',').map((p) => p.trim()).filter(Boolean);
  const invalid = phones.filter((p) => !E164_RE.test(p));
  if (invalid.length > 0) {
    throw new zObj.errors.Error(
      `Invalid phone number(s) — must be E.164 format (e.g. +15551234567): ${invalid.join(', ')}`
    );
  }
  return phones;
}

describe('create_business phone number validation', () => {
  test('accepts valid E.164 numbers', () => {
    expect(() => validatePhoneNumbers('+15551234567', z)).not.toThrow();
    expect(() => validatePhoneNumbers('+33612345678', z)).not.toThrow();
    expect(() => validatePhoneNumbers('+15551234567, +33612345678', z)).not.toThrow();
  });

  test('rejects numbers without + prefix', () => {
    expect(() => validatePhoneNumbers('15551234567', z)).toThrow(z.errors.Error);
  });

  test('rejects letters in number', () => {
    expect(() => validatePhoneNumbers('+1555abc4567', z)).toThrow(z.errors.Error);
  });

  test('rejects empty string after split', () => {
    const phones = validatePhoneNumbers('+15551234567,', z);
    expect(phones).toEqual(['+15551234567']);
  });

  test('rejects number too short (< 7 digits after +)', () => {
    expect(() => validatePhoneNumbers('+12345', z)).toThrow(z.errors.Error);
  });

  test('rejects number too long (> 15 digits after +)', () => {
    expect(() => validatePhoneNumbers('+1234567890123456', z)).toThrow(z.errors.Error);
  });

  test('rejects SQL injection attempt in phone list', () => {
    expect(() => validatePhoneNumbers("+15551234567, ' OR 1=1--", z)).toThrow(z.errors.Error);
  });

  test('returns parsed array of valid phones', () => {
    const result = validatePhoneNumbers('+15551234567, +33612345678', z);
    expect(result).toEqual(['+15551234567', '+33612345678']);
  });
});
