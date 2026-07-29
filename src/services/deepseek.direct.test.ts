// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { requestCompletion } from "./deepseek";

const messages = [
  { role: "system" as const, content: "只返回 JSON" },
  { role: "user" as const, content: "生成下一幕" },
];

function completion(content = '{"ok":true}') {
  return new Response(
    JSON.stringify({ choices: [{ message: { content } }] }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

describe("local official DeepSeek transport", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("calls the official endpoint with V4 Flash outside the browser", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "local-test-key");
    vi.stubEnv("VITE_DEEPSEEK_API_KEY", "");
    vi.stubEnv("DEEPSEEK_MODEL", "deepseek-v4-flash");
    const fetcher = vi.fn().mockResolvedValue(completion());
    vi.stubGlobal("fetch", fetcher);

    await expect(requestCompletion(messages, {
      phase: "turn",
      reasoning: "minimal",
      requestKind: "turn-primary",
    })).resolves.toBe('{"ok":true}');

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher.mock.calls[0]?.[0]).toBe("https://api.deepseek.com/v1/chat/completions");
    expect(fetcher.mock.calls[0]?.[1]?.headers).toMatchObject({
      Authorization: "Bearer local-test-key",
      "Content-Type": "application/json",
    });
    expect(JSON.parse(String(fetcher.mock.calls[0]?.[1]?.body))).toMatchObject({
      model: "deepseek-v4-flash",
      response_format: { type: "json_object" },
      stream: true,
      stream_options: { include_usage: true },
      thinking: { type: "disabled" },
      max_tokens: 4096,
      messages,
    });
  });

  it("uses the current local project key when an older shell key also exists", async () => {
    vi.stubEnv("VITE_DEEPSEEK_API_KEY", "project-local-key");
    vi.stubEnv("DEEPSEEK_API_KEY", "stale-shell-key");
    const fetcher = vi.fn().mockResolvedValue(completion());
    vi.stubGlobal("fetch", fetcher);

    await requestCompletion(messages, { phase: "turn", reasoning: "minimal" });

    expect(fetcher.mock.calls[0]?.[1]?.headers).toMatchObject({
      Authorization: "Bearer project-local-key",
    });
  });

  it("can force Node soak traffic through the real local Worker contract", async () => {
    vi.stubEnv("SOAK_PROXY_BASE_URL", "http://localhost:3003");
    vi.stubEnv("VITE_DEEPSEEK_API_KEY", "");
    vi.stubEnv("DEEPSEEK_API_KEY", "");
    const fetcher = vi.fn().mockResolvedValue(completion());
    vi.stubGlobal("fetch", fetcher);

    await requestCompletion(messages, {
      phase: "turn",
      reasoning: "minimal",
      requestKind: "turn-primary",
    });

    expect(fetcher.mock.calls[0]?.[0]).toBe("http://localhost:3003/api/deepseek/completions");
    expect(fetcher.mock.calls[0]?.[1]?.headers).toEqual({
      "Content-Type": "application/json",
      Origin: "http://localhost:3003",
    });
    const body = JSON.parse(String(fetcher.mock.calls[0]?.[1]?.body));
    expect(body).toMatchObject({
      version: 1,
      phase: "turn",
      requestKind: "turn-primary",
      reasoning: "minimal",
      messages,
    });
    expect(body).not.toHaveProperty("model");
    expect(body).not.toHaveProperty("max_tokens");
  });

  it("fails before the network when no local key is configured", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "");
    vi.stubEnv("VITE_DEEPSEEK_API_KEY", "");
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);

    await expect(requestCompletion(messages, {
      phase: "turn",
      reasoning: "minimal",
    })).rejects.toMatchObject({
      code: "missing_api_key",
    });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
