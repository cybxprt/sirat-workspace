import { PROVIDERS, getProvider } from './providers.js';
import { normalizeBaseUrl, resolveChatEndpoint, classifyFeature, sanitizeError, extractOpenAIText, extractGeminiText } from './core.js';

const $ = selector => document.querySelector(selector);
const STORAGE_KEY = 'sirat-ai-universe:provider-settings';
const state = { providerId: 'gemini-api', apiKey: '', connected: false };

function readSavedSettings() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function currentConfig() { return readSavedSettings()[state.providerId] || {}; }
function notify(message) { $('#chat-status').textContent = message; }
function activeProvider() { return getProvider(state.providerId); }

function saveSettings() {
  const all = readSavedSettings();
  all[state.providerId] = {
    endpoint: $('#endpoint').value.trim(),
    model: $('#model').value.trim()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  renderStats();
  notify('Settings saved; API key was not stored.');
}

function updateProviderNote() {
  const provider = activeProvider();
  $('#provider-note').textContent = provider.note;
  const browserOnly = provider.mode === 'browser-only';
  $('#endpoint').disabled = browserOnly;
  $('#model').disabled = browserOnly;
  $('#api-key').disabled = browserOnly;
  state.apiKey = '';
  $('#api-key').value = '';
  state.connected = false;
  notify('Not connected');
}

function loadProviderConfig() {
  const provider = activeProvider();
  const config = currentConfig();
  $('#endpoint').value = config.endpoint ?? provider.endpoint;
  $('#model').value = config.model ?? '';
  updateProviderNote();
}

function populateProviders() {
  const select = $('#provider-select');
  for (const provider of PROVIDERS) {
    const option = document.createElement('option');
    option.value = provider.id;
    option.textContent = provider.name;
    select.append(option);
  }
  const saved = readSavedSettings();
  state.providerId = getProvider(saved.lastProviderId)?.id ?? 'gemini-api';
  select.value = state.providerId;
  loadProviderConfig();
}

function renderStats() {
  const saved = readSavedSettings();
  const configured = Object.values(saved).filter(item => item && typeof item === 'object' && item.endpoint && item.model).length;
  $('#provider-count').textContent = String(PROVIDERS.length);
  $('#configured-count').textContent = String(configured);
  $('#session-status').textContent = state.connected ? 'Connected' : 'Offline';
}

function renderProviderCards() {
  const grid = $('#provider-grid');
  for (const provider of PROVIDERS) {
    const card = document.createElement('article');
    card.className = 'provider-card';
    const title = document.createElement('h3');
    title.textContent = provider.name;
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = provider.mode.toUpperCase();
    const note = document.createElement('p');
    note.textContent = provider.note;
    const link = document.createElement('a');
    link.href = provider.mode === 'browser-only' ? provider.endpoint : (provider.docs || provider.endpoint || '#');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = provider.mode === 'browser-only' ? 'Open official website ↗' : 'Integration documentation ↗';
    card.append(title, meta, note, link);
    grid.append(card);
  }
}

function renderCapabilities() {
  const rows = [
    ['Official API calls', 'Available when a valid provider key and model are configured'],
    ['Local model inference', 'Available when Ollama, LM Studio, or vLLM is running'],
    ['Consumer web subscriptions', 'Provider-controlled; not modified by this application'],
    ['Premium model entitlement', classifyFeature({ requiresPlan: true })],
    ['Usage quotas and rate limits', 'Provider-controlled; cannot be removed locally'],
    ['Unverified model features', classifyFeature({ status: 'unknown' })],
    ['Browser-only services', 'Open official website; no session extraction']
  ];
  for (const [name, status] of rows) {
    const row = document.createElement('div');
    row.className = 'capability-row';
    const label = document.createElement('span');
    label.textContent = name;
    const value = document.createElement('span');
    value.textContent = status;
    row.append(label, value);
    $('#capability-list').append(row);
  }
}

function addBubble(role, text, isError = false) {
  const log = $('#chat-log');
  log.querySelector('.empty-state')?.remove();
  const bubble = document.createElement('div');
  bubble.className = 'bubble ' + role + (isError ? ' error' : '');
  bubble.textContent = text;
  log.append(bubble);
  log.scrollTop = log.scrollHeight;
}

async function sendOpenAICompatible(model, prompt, apiKey) {
  const endpoint = resolveChatEndpoint($('#endpoint').value);
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers.Authorization = 'Bearer ' + apiKey;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], stream: false })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || payload?.message || ('HTTP ' + response.status));
  return extractOpenAIText(payload) || 'The provider returned no text content.';
}

async function sendGemini(model, prompt, apiKey) {
  if (!apiKey) throw new Error('A Google AI Studio API key is required for Gemini API access.');
  const safeModel = model.replace(/^models\//, '');
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/' +
    encodeURIComponent(safeModel) + ':generateContent?key=' + encodeURIComponent(apiKey);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || ('HTTP ' + response.status));
  return extractGeminiText(payload) || 'The provider returned no text content.';
}

async function handleChat(event) {
  event.preventDefault();
  const provider = activeProvider();
  const prompt = $('#prompt').value.trim();
  const model = $('#model').value.trim();
  const apiKey = $('#api-key').value;
  if (!prompt) return;

  if (provider.mode === 'browser-only') {
    addBubble('assistant', 'This provider is browser-only in this version. Use Open provider to continue on its official website.', true);
    return;
  }
  if (!model) { addBubble('assistant', 'Enter the exact model ID enabled for your provider account.', true); return; }
  if (provider.mode !== 'local' && !apiKey) {
    addBubble('assistant', 'Enter an API key. A consumer website subscription is not an API key.', true);
    return;
  }

  addBubble('user', prompt);
  $('#prompt').value = '';
  $('#send-button').disabled = true;
  notify('Request in progress…');

  try {
    if (provider.protocol !== 'gemini') normalizeBaseUrl($('#endpoint').value);
    const answer = provider.protocol === 'gemini'
      ? await sendGemini(model, prompt, apiKey)
      : await sendOpenAICompatible(model, prompt, apiKey);
    addBubble('assistant', answer);
    state.connected = true;
    notify('Request succeeded');
  } catch (error) {
    addBubble('assistant', sanitizeError(error.message, apiKey), true);
    state.connected = false;
    notify('Request failed');
  } finally {
    $('#send-button').disabled = false;
    renderStats();
  }
}

function openProvider() {
  const provider = activeProvider();
  const url = provider.mode === 'browser-only' ? provider.endpoint : provider.docs;
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

function clearSettings() {
  localStorage.removeItem(STORAGE_KEY);
  state.apiKey = '';
  state.connected = false;
  $('#api-key').value = '';
  $('#model').value = '';
  $('#endpoint').value = activeProvider().endpoint;
  renderStats();
  notify('Saved settings cleared');
}

function navigate(view) {
  document.querySelectorAll('.view').forEach(node => node.classList.toggle('active', node.id === 'view-' + view));
  document.querySelectorAll('.nav-item').forEach(node => node.classList.toggle('active', node.dataset.view === view));
  const button = document.querySelector('[data-view="' + view + '"]');
  $('#view-title').textContent = button?.textContent ?? 'Overview';
}

document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.view)));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.go)));
$('#provider-select').addEventListener('change', event => {
  state.providerId = event.target.value;
  loadProviderConfig();
  renderStats();
});
$('#save-provider').addEventListener('click', saveSettings);
$('#open-provider').addEventListener('click', openProvider);
$('#chat-form').addEventListener('submit', handleChat);
$('#clear-settings').addEventListener('click', clearSettings);

populateProviders();
renderProviderCards();
renderCapabilities();
renderStats();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
