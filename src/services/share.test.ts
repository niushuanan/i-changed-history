import { afterEach, describe, expect, it, vi } from "vitest";
import { saveFrontPage } from "./share";

const node = document.createElement("article");
const blob = new Blob(["png"], { type: "image/png" });

afterEach(() => {
  vi.restoreAllMocks();
});

describe("front-page export", () => {
  it("renders the complete scrollable report instead of only the visible viewport", async () => {
    const scrollingReport = document.createElement("article");
    Object.defineProperties(scrollingReport, {
      scrollWidth: { configurable: true, value: 390 },
      scrollHeight: { configurable: true, value: 1420 },
    });
    const renderToBlob = vi.fn().mockResolvedValue(blob);

    await saveFrontPage(scrollingReport, {
      worldName: "完整纪元",
      shareLine: "完整报告",
    }, {
      renderToBlob,
      navigator: { share: vi.fn().mockResolvedValue(undefined), canShare: () => true },
      document,
      url: { createObjectURL: vi.fn(), revokeObjectURL: vi.fn() },
      schedule: (callback) => callback(),
    });

    expect(renderToBlob).toHaveBeenCalledWith(scrollingReport, expect.objectContaining({
      width: 390,
      height: 1420,
      style: expect.objectContaining({ overflow: "visible" }),
    }));
  });

  it("uses native file sharing when the browser supports it", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const canShare = vi.fn().mockReturnValue(true);
    const renderToBlob = vi.fn().mockResolvedValue(blob);

    await expect(
      saveFrontPage(node, {
        worldName: "城网纪元",
        shareLine: "我把历史改写到了 2026。",
      }, {
        renderToBlob,
        navigator: { share, canShare },
        document,
        url: { createObjectURL: vi.fn(), revokeObjectURL: vi.fn() },
        schedule: (callback) => callback(),
      }),
    ).resolves.toBe("shared");

    expect(renderToBlob).toHaveBeenCalledWith(node, expect.objectContaining({ pixelRatio: 2 }));
    expect(share).toHaveBeenCalledWith(expect.objectContaining({
      title: "哎！我改变了历史？",
      text: "我把历史改写到了 2026。",
      files: [expect.any(File)],
    }));
  });

  it("downloads a PNG when native file sharing is unavailable", async () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const createObjectURL = vi.fn().mockReturnValue("blob:front-page");
    const revokeObjectURL = vi.fn();

    await expect(
      saveFrontPage(node, { worldName: "城/网:纪元", shareLine: "头版" }, {
        renderToBlob: vi.fn().mockResolvedValue(blob),
        navigator: {},
        document,
        url: { createObjectURL, revokeObjectURL },
        schedule: (callback) => callback(),
      }),
    ).resolves.toBe("downloaded");

    expect(click).toHaveBeenCalledOnce();
    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:front-page");
  });

  it("fails clearly when the page cannot be rendered", async () => {
    await expect(
      saveFrontPage(node, { worldName: "城网纪元", shareLine: "头版" }, {
        renderToBlob: vi.fn().mockResolvedValue(null),
        navigator: {},
        document,
        url: { createObjectURL: vi.fn(), revokeObjectURL: vi.fn() },
        schedule: (callback) => callback(),
      }),
    ).rejects.toThrow("无法生成头版图片");
  });
});
