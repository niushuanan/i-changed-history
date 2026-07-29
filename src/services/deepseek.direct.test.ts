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
      reasoning: "fast",
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

    await requestCompletion(messages, { phase: "turn", reasoning: "fast" });

    expect(fetcher.mock.calls[0]?.[1]?.headers).toMatchObject({
      Authorization: "Bearer project-local-key",
    });
  });

  it("fails before the network when no local key is configured", async () => {
    vi.stubEnv("DEEPSEEK_API_KEY", "");
    vi.stubEnv("VITE_DEEPSEEK_API_KEY", "");
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);

    await expect(requestCompletion(messages, {
      phase: "turn",
      reasoning: "fast",
    })).rejects.toMatchObject({
      code: "missing_api_key",
    });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
