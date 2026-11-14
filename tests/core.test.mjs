import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeBaseUrl,
  resolveChatEndpoint,
  classifyFeature,
  sanitizeError
} from '../src/core.js';

test('normalizes a provider base URL without adding duplicate slashes', () => {
  assert.equal(normalizeBaseUrl('https://api.example.com/v1/'), 'https://api.example.com/v1');
});

test('rejects non-HTTP protocols and embedded credentials', () => {
  assert.throws(() => normalizeBaseUrl('javascript:alert(1)'), /HTTP or HTTPS/);
  assert.throws(() => normalizeBaseUrl('https://user:pass@example.com/v1'), /credentials/);
});

test('resolves OpenAI-compatible chat completion endpoint', () => {
  assert.equal(
    resolveChatEndpoint('https://api.example.com/v1'),
    'https://api.example.com/v1/chat/completions'
  );
  assert.equal(
    resolveChatEndpoint('https://api.example.com/v1/chat/completions'),
    'https://api.example.com/v1/chat/completions'
  );
});

test('classifies entitlement evidence without upgrading or guessing', () => {
  assert.equal(classifyFeature({ status: 'available' }), 'available');
  assert.equal(classifyFeature({ status: 'unavailable' }), 'unavailable');
  assert.equal(classifyFeature({ status: 'unknown' }), 'unknown');
  assert.equal(classifyFeature({ requiresPlan: true }), 'entitlement_required');
  assert.equal(classifyFeature({ status: 'premium' }), 'unknown');
});

test('redacts a supplied secret from provider error text', () => {
  assert.equal(
    sanitizeError('Request failed with key secret-123', 'secret-123'),
    'Request failed with key [REDACTED]'
  );
});
