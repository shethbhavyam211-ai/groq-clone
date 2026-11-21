// Groq API client – calls through the Vite proxy to avoid CORS issues
// All requests go to /api/groq/... which is rewritten to https://api.groq.com/...

export interface GroqModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  active: boolean;
  context_window: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: { role?: string; content?: string };
    finish_reason: string | null;
  }>;
  x_groq?: { id: string; usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number; queue_time: number; prompt_time: number; completion_time: number; total_time: number } };
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    queue_time: number;
    prompt_time: number;
    completion_time: number;
    total_time: number;
  };
}

const BASE = '/api/groq/openai/v1';

function headers(apiKey: string) {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

/** List all available models */
export async function listModels(apiKey: string): Promise<GroqModel[]> {
  const res = await fetch(`${BASE}/models`, { headers: headers(apiKey) });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data ?? [];
}

/** Streaming chat completion – yields content delta strings */
export async function* streamChatCompletion(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  opts: {
    temperature?: number;
    max_completion_tokens?: number;
    top_p?: number;
    stream?: boolean;
    reasoning_effort?: string;
    response_format?: { type: string };
  } = {},
): AsyncGenerator<{ type: 'delta'; content: string } | { type: 'usage'; data: any } | { type: 'done' }> {
  const body: any = {
    model,
    messages,
    temperature: opts.temperature ?? 1,
    max_completion_tokens: opts.max_completion_tokens ?? 4096,
    top_p: opts.top_p ?? 1,
    stream: true,
  };
  if (opts.reasoning_effort) body.reasoning_effort = opts.reasoning_effort;
  if (opts.response_format) body.response_format = opts.response_format;

  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') {
        yield { type: 'done' };
        return;
      }
      try {
        const chunk: ChatCompletionChunk = JSON.parse(data);
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) {
          yield { type: 'delta', content: delta };
        }
        if (chunk.x_groq?.usage) {
          yield { type: 'usage', data: chunk.x_groq.usage };
        }
      } catch {
        // skip malformed
      }
    }
  }
}

/** Non-streaming chat completion */
export async function chatCompletion(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  opts: {
    temperature?: number;
    max_completion_tokens?: number;
  } = {},
): Promise<ChatCompletionResponse> {
  const body = {
    model,
    messages,
    temperature: opts.temperature ?? 1,
    max_completion_tokens: opts.max_completion_tokens ?? 4096,
    stream: false,
  };

  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }

  return res.json();
}

