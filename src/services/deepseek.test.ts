import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateEnding, generateNextTurn, generateOpening } from "../game/engine";
import { endingFixture, turnFixture } from "../test/fixtures";
import { requestCompletion } from "./deepseek";

const messages = [
  { role: "system" as const, content: "system" },
  { role: "user" as const, content: "user" },
];

const seed = {
  id: "alexander-lives",
  era: "ancient" as const,
  year: -323,
  location: "巴比伦",
  chinaRelated: false,
  baselineFacts: [
    "亚历山大于公元前323年在巴比伦去世。",
    "他没有留下明确且成年的继承人。",
    "其将领随后建立多个继业者王国。",
  ] as const,
  prompt: "如果亚历山大再活二十年？",
  domain: "war",
  visualTone: "ancient" as const,
};

const playedTurn = {
  turn: turnFixture,
  selectedChoiceId: "A",
  selectedChoiceLabel: "公开完整遗诏",
};

function completion(content = "{\"ok\":true}") {
  return new Response(
    JSON.stringify({
      id: "chatcmpl-test",
      object: "chat.completion",
      created: 1,
      model: "deepseek-v4-flash",
      choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: "stop" }],
      usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

describe("DeepSeek transport", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_DEEPSEEK_API_KEY", "test-key");
    vi.stubEnv("VITE_DEEPSEEK_MODEL", "deepseek-v4-flash");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("sends the structured V4 Flash request and returns message content", async () => {
    const fetcher = vi.fn().mockResolvedValue(completion());
    vi.stubGlobal("fetch", fetcher);

    await expect(requestCompletion(messages, { phase: "turn" })).resolves.toBe('{"ok":true}');
    const [url, init] = fetcher.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(url).toBe("https://api.deepseek.com/chat/completions");
    expect(init.headers.Authorization).toBe("Bearer test-key");
    expect(body).toMatchObject({
      model: "deepseek-v4-flash",
      thinking: { type: "disabled" },
      response_format: { type: "json_object" },
      stream: false,
      max_tokens: 1100,
    });
  });

  it("enables high-effort thinking only for the ending", async () => {
    const fetcher = vi.fn().mockResolvedValue(completion());
    vi.stubGlobal("fetch", fetcher);

    await requestCompletion(messages, { phase: "ending" });
    const body = JSON.parse(fetcher.mock.calls[0][1].body);
    expect(body).toMatchObject({
      thinking: { type: "enabled" },
      reasoning_effort: "high",
      max_tokens: 1800,
    });
  });

  it("retries a 429 response and succeeds", async () => {
    vi.useFakeTimers();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response("busy", { status: 429 }))
      .mockResolvedValueOnce(completion());
    vi.stubGlobal("fetch", fetcher);

    const pending = requestCompletion(messages, { phase: "turn" });
    await vi.runAllTimersAsync();
    await expect(pending).resolves.toBe('{"ok":true}');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("retries one server failure and then succeeds", async () => {
    vi.useFakeTimers();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(new Response("temporarily unavailable", { status: 503 }))
      .mockResolvedValueOnce(completion());
    vi.stubGlobal("fetch", fetcher);

    const pending = requestCompletion(messages, { phase: "turn" });
    await vi.runAllTimersAsync();
    await expect(pending).resolves.toBe('{"ok":true}');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("retries one network interruption and then succeeds", async () => {
    vi.useFakeTimers();
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("network offline"))
      .mockResolvedValueOnce(completion());
    vi.stubGlobal("fetch", fetcher);

    const pending = requestCompletion(messages, { phase: "turn" });
    await vi.runAllTimersAsync();
    await expect(pending).resolves.toBe('{"ok":true}');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("aborts a hanging request after 28 seconds", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn((_url: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        const signal = init?.signal;
        if (!signal) throw new Error("missing abort signal");
        signal.addEventListener(
          "abort",
          () => reject(new DOMException("aborted", "AbortError")),
          { once: true },
        );
      }),
    );
    vi.stubGlobal("fetch", fetcher);

    const pending = requestCompletion(messages, { phase: "turn" });
    await Promise.resolve();
    expect(fetcher).toHaveBeenCalledTimes(1);
    const signal = fetcher.mock.calls[0][1]?.signal;
    expect(signal?.aborted).toBe(false);
    const rejection = expect(pending).rejects.toMatchObject({ code: "timeout" });

    await vi.advanceTimersByTimeAsync(27_999);
    expect(signal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(signal?.aborted).toBe(true);
    await rejection;
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("preserves the timeout error while a response body is still loading", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn((_url: RequestInfo | URL, init?: RequestInit) => {
      const signal = init?.signal;
      if (!signal) throw new Error("missing abort signal");

      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          new Promise((_resolve, reject) => {
            signal.addEventListener(
              "abort",
              () => reject(new DOMException("aborted", "AbortError")),
              { once: true },
            );
          }),
      } as Response);
    });
    vi.stubGlobal("fetch", fetcher);

    const pending = requestCompletion(messages, { phase: "turn" });
    let rejection: unknown;
    const observed = pending.catch((error: unknown) => {
      rejection = error;
    });
    await vi.advanceTimersByTimeAsync(28_000);
    await observed;
    expect(rejection).toMatchObject({ code: "timeout" });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("does not retry an authentication failure", async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response("unauthorized", { status: 401 }));
    vi.stubGlobal("fetch", fetcher);

    await expect(requestCompletion(messages, { phase: "turn" })).rejects.toMatchObject({
      code: "unauthorized",
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("repairs one invalid opening payload and returns the validated turn", async () => {
    const invalid = '{"timelineName":"缺少其余字段"}';
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(completion(invalid))
      .mockResolvedValueOnce(completion(JSON.stringify(turnFixture)));
    vi.stubGlobal("fetch", fetcher);

    await expect(generateOpening(seed)).resolves.toMatchObject({
      chapter: 1,
      timelineName: "无王航线",
    });
    expect(fetcher).toHaveBeenCalledTimes(2);

    const repairBody = JSON.parse(fetcher.mock.calls[1][1].body);
    const repairPayload = JSON.parse(repairBody.messages.at(-1).content);
    expect(repairPayload).toMatchObject({
      task: "repair_invalid_json",
      targetSchema: "timeline_turn",
      untrustedInvalidModelOutput: invalid,
    });
  });

  it("stops after one unsuccessful schema repair", async () => {
    const fetcher = vi.fn().mockImplementation(() =>
      Promise.resolve(completion('{"still":"invalid"}')),
    );
    vi.stubGlobal("fetch", fetcher);

    await expect(generateOpening(seed)).rejects.toMatchObject({ code: "invalid_structure" });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("generates and validates the requested continuation chapter", async () => {
    const nextTurn = {
      ...turnFixture,
      chapter: 2,
      chapterName: "余震",
      previousEcho: turnFixture.choices[0].instantEcho,
    };
    const fetcher = vi.fn().mockResolvedValue(completion(JSON.stringify(nextTurn)));
    vi.stubGlobal("fetch", fetcher);

    await expect(
      generateNextTurn(seed, [playedTurn], 2, {
        intervention: { text: "让城市共同保管道路税", deviationClass: "reform" },
      }),
    ).resolves.toMatchObject({ chapter: 2, chapterName: "余震" });
  });

  it("generates and validates the alternate present", async () => {
    const fetcher = vi.fn().mockResolvedValue(completion(JSON.stringify(endingFixture)));
    vi.stubGlobal("fetch", fetcher);

    const ending = await generateEnding(seed, Array(5).fill(playedTurn));
    expect(ending).toMatchObject({ worldName: "公议纪元" });
    expect(ending.causalChains).toHaveLength(3);
  });
});
