# SIRAT AI Universe

**One workspace. Multiple AI providers. Transparent capabilities.**

SIRAT AI Universe is a free-first, provider-neutral AI workspace. It connects to documented provider APIs, OpenAI-compatible gateways, and local model servers through a single responsive PWA.

> This project does not activate paid subscriptions, bypass provider authentication, remove quotas, unlock server-side premium models, or impersonate consumer accounts. It exposes only the access your provider account, API key, or local model genuinely grants.

## Current release

- Responsive dark dashboard
- Provider catalog for Gemini API, OpenAI, Groq, DeepSeek, OpenRouter, Mistral, xAI, Together AI, Fireworks, Cerebras, Ollama, LM Studio, vLLM, and custom OpenAI-compatible endpoints
- Browser-only launch links for ChatGPT, Claude, Copilot, and Qwen consumer websites
- Gemini generateContent adapter
- OpenAI-compatible chat completions adapter
- Provider endpoint and model configuration
- API keys held in memory only (not persisted)
- Local settings store endpoint and model only
- Capability registry with available, unavailable, unknown, and entitlement-required states
- Installable PWA shell with offline static assets
- Dependency-free Node tests and GitHub Actions CI

Provider names do not imply that an account has access, a free quota, or a particular model. Check the provider's current dashboard and documentation.

## Quick start

Requires Node.js 22+ (or Python 3).

```bash
npm run build
python -m http.server 8080 --directory dist
```

Or serve the repository root directly during development:

```bash
python -m http.server 8080
```

Open the local URL printed by the server. Service workers require HTTP(S), not the file protocol.

## Connect a provider

1. Open AI Workspace.
2. Choose a provider.
3. Enter the exact model ID enabled for your provider account.
4. Enter an API key if the provider requires one.
5. Send a test prompt.

The API key remains in memory for the current page session. Reloading the page clears it. Saved provider settings contain only provider ID, endpoint, and model ID.

### Gemini API

Create an API key through Google AI Studio and choose a model currently enabled for that key. This is Gemini API access, not a Gemini consumer subscription.

### OpenAI-compatible APIs

The app sends requests to the configured endpoint plus /chat/completions. If the endpoint already ends with /chat/completions, it is used unchanged. The endpoint must implement the OpenAI chat completions request/response format.

### Local models

- Ollama default: http://127.0.0.1:11434/v1
- LM Studio default: http://127.0.0.1:1234/v1
- vLLM default: http://127.0.0.1:8000/v1

Start the local server and use a model ID loaded by that server. Configure CORS if your browser blocks requests from the app origin.

## Consumer websites vs APIs

A ChatGPT, Claude, Gemini, Copilot, or Grok web subscription is not automatically an API key. Consumer websites may have their own account entitlements, limits, and terms. Browser-only entries open the official website instead of reading cookies, reverse-engineering private endpoints, or replaying account sessions.

## Capability states

| State | Meaning |
|---|---|
| Available | Verified by the user/provider integration |
| Unavailable | Provider explicitly reports it unavailable |
| Unknown | No reliable evidence |
| Entitlement required | Provider controls access through a plan or account permission |

A UI switch cannot change a server-side entitlement. The registry reports evidence, not fabricated activation.

## Tests and build

```bash
npm test
npm run check
npm run build
```

The production build copies only the explicit static PWA allowlist (index.html, manifest.webmanifest, sw.js, src/, and assets/) into dist/. Tests verify that development fixtures and environment files are not shipped.

## Vercel deployment

The repository includes vercel.json. Connect the GitHub repository to Vercel with the root directory set to the repository root. Vercel runs npm run build and serves dist/. Pushes to the production branch deploy automatically; pull requests receive preview deployments when enabled. No provider API keys are required for the static deployment.

## Security

Read SECURITY.md before configuring API keys. Do not share browser cookies, OAuth codes, access tokens, or API keys. Do not use this app on an untrusted shared device.

## Roadmap

- Provider-specific model discovery where documented APIs support it
- Streaming responses
- Conversation history with explicit local-only storage controls
- Tool/function calling adapters
- Multimodal request adapters
- Agent workflows with user approval gates
- Cost and quota telemetry where provider APIs expose it
- Import/export of non-secret workspace configuration
- Optional self-hosted backend proxy to keep keys off the browser

## License

MIT. Provider trademarks and APIs remain the property of their respective owners.

---

**SIRAT / DEV MD Nazmul ALAM MITHU**
