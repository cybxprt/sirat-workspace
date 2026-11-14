export const PROVIDERS = [
  { id: 'gemini-api', name: 'Google Gemini API', protocol: 'gemini', endpoint: 'https://generativelanguage.googleapis.com/v1beta', docs: 'https://ai.google.dev/gemini-api/docs', mode: 'official-api', note: 'Uses a Google AI Studio API key and the documented Gemini generateContent API.' },
  { id: 'openai', name: 'OpenAI API', protocol: 'openai', endpoint: 'https://api.openai.com/v1', docs: 'https://platform.openai.com/docs', mode: 'official-api', note: 'Official API access; ChatGPT web subscription is separate from API billing.' },
  { id: 'groq', name: 'Groq', protocol: 'openai', endpoint: 'https://api.groq.com/openai/v1', docs: 'https://console.groq.com/docs', mode: 'compatible-api', note: 'OpenAI-compatible endpoint; model and rate availability depend on your account.' },
  { id: 'deepseek', name: 'DeepSeek API', protocol: 'openai', endpoint: 'https://api.deepseek.com/v1', docs: 'https://api-docs.deepseek.com', mode: 'compatible-api', note: 'Use a model ID currently listed in your provider account.' },
  { id: 'openrouter', name: 'OpenRouter', protocol: 'openai', endpoint: 'https://openrouter.ai/api/v1', docs: 'https://openrouter.ai/docs', mode: 'compatible-api', note: 'Model access and free/paid routing are controlled by OpenRouter.' },
  { id: 'mistral', name: 'Mistral API', protocol: 'openai', endpoint: 'https://api.mistral.ai/v1', docs: 'https://docs.mistral.ai', mode: 'compatible-api', note: 'API key and model access are provider-controlled.' },
  { id: 'xai', name: 'xAI API', protocol: 'openai', endpoint: 'https://api.x.ai/v1', docs: 'https://docs.x.ai', mode: 'compatible-api', note: 'API model access is separate from the Grok consumer subscription.' },
  { id: 'together', name: 'Together AI', protocol: 'openai', endpoint: 'https://api.together.xyz/v1', docs: 'https://docs.together.ai', mode: 'compatible-api', note: 'Use only models enabled for your account.' },
  { id: 'fireworks', name: 'Fireworks AI', protocol: 'openai', endpoint: 'https://api.fireworks.ai/inference/v1', docs: 'https://docs.fireworks.ai', mode: 'compatible-api', note: 'Provider-side quota and model permissions apply.' },
  { id: 'cerebras', name: 'Cerebras', protocol: 'openai', endpoint: 'https://api.cerebras.ai/v1', docs: 'https://inference-docs.cerebras.ai', mode: 'compatible-api', note: 'Provider-side model and rate limits apply.' },
  { id: 'ollama', name: 'Ollama (local)', protocol: 'openai', endpoint: 'http://127.0.0.1:11434/v1', docs: 'https://ollama.com', mode: 'local', note: 'Local inference; no cloud subscription required. Local server must be running.' },
  { id: 'lmstudio', name: 'LM Studio (local)', protocol: 'openai', endpoint: 'http://127.0.0.1:1234/v1', docs: 'https://lmstudio.ai', mode: 'local', note: 'Local inference when the LM Studio server is enabled.' },
  { id: 'vllm', name: 'vLLM (self-hosted)', protocol: 'openai', endpoint: 'http://127.0.0.1:8000/v1', docs: 'https://docs.vllm.ai', mode: 'local', note: 'Connect to your own vLLM OpenAI-compatible server.' },
  { id: 'custom', name: 'Custom OpenAI-compatible endpoint', protocol: 'openai', endpoint: '', docs: '', mode: 'custom', note: 'For a provider or gateway implementing the OpenAI chat completions format.' },
  { id: 'chatgpt-web', name: 'ChatGPT web', protocol: 'browser', endpoint: 'https://chatgpt.com', docs: 'https://help.openai.com', mode: 'browser-only', note: 'Opens the official website; no browser session extraction or plan bypass.' },
  { id: 'claude-web', name: 'Claude web', protocol: 'browser', endpoint: 'https://claude.ai', docs: 'https://support.anthropic.com', mode: 'browser-only', note: 'Opens the official website; API access is configured separately.' },
  { id: 'copilot-web', name: 'Microsoft Copilot', protocol: 'browser', endpoint: 'https://copilot.microsoft.com', docs: 'https://support.microsoft.com/copilot', mode: 'browser-only', note: 'Opens the official website; consumer features remain account-controlled.' },
  { id: 'qwen-web', name: 'Qwen web', protocol: 'browser', endpoint: 'https://chat.qwen.ai', docs: 'https://qwen.ai', mode: 'browser-only', note: 'Opens the official website; API access requires a supported endpoint.' }
];

export function getProvider(id) {
  return PROVIDERS.find(provider => provider.id === id) ?? null;
}
