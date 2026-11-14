# Security

## Scope
SIRAT AI Universe is a browser client for endpoints the user explicitly configures. It does not unlock paid subscriptions, defeat provider quotas, extract browser sessions, or call undocumented consumer-web RPCs.

## API keys
- API keys are held in JavaScript memory for the current page session.
- Keys are never written to localStorage, IndexedDB, service-worker caches, or exported reports.
- Gemini API keys are sent to Google's documented Gemini API endpoint as required by that API.
- OpenAI-compatible keys are sent as bearer authorization headers to the configured endpoint.
- Browser API calls expose keys to the browser runtime and configured provider. Use only on a trusted device; do not host a shared/public instance for other users.

## Provider endpoints
Only HTTP and HTTPS URLs are accepted. Do not enter endpoints you do not control or trust. Local model endpoints may require provider-specific CORS configuration.

## Reporting
Never submit cookies, OAuth codes, access tokens, API keys, private prompts, or account identifiers in bug reports. Redact secrets before sharing logs.

## Responsible disclosure
Report security issues privately to the repository maintainer before public disclosure.
