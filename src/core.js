export function normalizeBaseUrl(value) {
  if (typeof value !== 'string' || !value.trim()) throw new Error('Provider endpoint is required.');
  let parsed;
  try { parsed = new URL(value.trim()); }
  catch { throw new Error('Enter a valid provider endpoint URL.'); }
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only HTTP or HTTPS endpoints are supported.');
  if (parsed.username || parsed.password) throw new Error('Do not put credentials in the endpoint URL.');
  if (parsed.search || parsed.hash) throw new Error('Remove query parameters and fragments from the endpoint URL.');
  return parsed.toString().replace(/\/+$/, '');
}

export function resolveChatEndpoint(baseUrl) {
  const base = normalizeBaseUrl(baseUrl);
  return /\/chat\/completions$/i.test(base) ? base : base + '/chat/completions';
}

export function classifyFeature(evidence = {}) {
  if (evidence.requiresPlan === true) return 'entitlement_required';
  if (['available', 'unavailable', 'unknown'].includes(evidence.status)) return evidence.status;
  return 'unknown';
}

export function sanitizeError(message, secret = '') {
  let output = String(message ?? 'Unknown provider error');
  if (secret) output = output.split(secret).join('[REDACTED]');
  output = output.replace(/([?&](?:key|api_key|token)=)[^&\s]+/gi, '$1[REDACTED]');
  output = output.replace(/Bearer\s+[^\s,;]+/gi, 'Bearer [REDACTED]');
  return output.slice(0, 500);
}

export function extractOpenAIText(payload) {
  return payload?.choices?.[0]?.message?.content ?? '';
}

export function extractGeminiText(payload) {
  return (payload?.candidates?.[0]?.content?.parts ?? []).map(part => part.text ?? '').join('');
}
