import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { endingFixture } from "../test/fixtures";
import { alternatePresentSchema } from "../game/schema";
import type { PreparedReportImage } from "../services/share";
import { AlternatePresentScreen } from "./AlternatePresentScreen";

afterEach(cleanup);
const result = alternatePresentSchema.parse(endingFixture);

function prepared(page: "biography" | "world" = "biography"): PreparedReportImage {
  const blob = new Blob([page], { type: "image/png" });
  return {
    blob,
    file: new File([blob], `${page}.png`, { type: "image/png" }),
    objectUrl: `blob:${page}`,
    fileName: `${page}.png`,
    page,
    shareLine: result.shareLine,
  };
}

function screenProps(overrides: Partial<React.ComponentProps<typeof AlternatePresentScreen>> = {}) {
  return {
    result,
    deviation: 64,
    isMobileSave: false,
    onPrepare: vi.fn().mockResolvedValue(prepared()),
    onShare: vi.fn().mockResolvedValue("shared" as const),
    onDownload: vi.fn().mockReturnValue("downloaded" as const),
    onDispose: vi.fn(),
    onRestart: vi.fn(),
    ...overrides,
  };
}

describe("alternate present export", () => {
  it("downloads a complete PNG on the first desktop save click", async () => {
    let finish: ((value: PreparedReportImage) => void) | undefined;
    const onPrepare = vi.fn(() => new Promise<PreparedReportImage>((resolve) => { finish = resolve; }));
    const onDownload = vi.fn().mockReturnValue("downloaded" as const);
    const user = userEvent.setup();
    render(<AlternatePresentScreen {...screenProps({ onPrepare, onDownload })} />);

    await user.click(screen.getByRole("button", { name: "保存这一页" }));
    expect(screen.getByRole("button", { name: "正在生成完整图片" })).toBeDisabled();

    finish?.(prepared());
    expect(await screen.findByRole("button", { name: "PNG 已下载" })).toBeEnabled();
    expect(onDownload).toHaveBeenCalledWith(expect.objectContaining({ page: "biography" }));
  });

  it("prepares first and opens the mobile system panel only on a second click", async () => {
    const onPrepare = vi.fn().mockResolvedValue(prepared());
    const onShare = vi.fn().mockResolvedValue("shared" as const);
    const user = userEvent.setup();
    render(<AlternatePresentScreen {...screenProps({ isMobileSave: true, onPrepare, onShare })} />);

    await user.click(screen.getByRole("button", { name: "保存这一页" }));

    expect(await screen.findByRole("status")).toHaveTextContent("图片已准备好");
    expect(screen.getByRole("status")).toHaveTextContent("存储图像/保存到相册");
    expect(screen.getByRole("button", { name: "打开系统保存" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "下载 PNG" })).toBeEnabled();
    expect(onShare).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "打开系统保存" }));
    expect(onShare).toHaveBeenCalledOnce();
    expect(await screen.findByRole("status")).toHaveTextContent("已打开系统面板");
  });

  it("keeps a cancelled mobile image ready for sharing or PNG fallback", async () => {
    const image = prepared();
    const onShare = vi.fn().mockResolvedValue("cancelled" as const);
    const onDownload = vi.fn().mockReturnValue("downloaded" as const);
    const onDispose = vi.fn();
    const user = userEvent.setup();
    render(<AlternatePresentScreen {...screenProps({
      isMobileSave: true,
      onPrepare: vi.fn().mockResolvedValue(image),
      onShare,
      onDownload,
      onDispose,
    })} />);

    await user.click(screen.getByRole("button", { name: "保存这一页" }));
    await user.click(await screen.findByRole("button", { name: "打开系统保存" }));

    expect(await screen.findByRole("status")).toHaveTextContent("已取消，图片仍可保存");
    expect(screen.getByRole("button", { name: "再次打开系统保存" })).toBeEnabled();
    expect(onDispose).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "下载 PNG" }));
    expect(onDownload).toHaveBeenCalledWith(image);
    expect(screen.getByRole("status")).toHaveTextContent("PNG 已下载");
  });

  it("disposes the old prepared image when switching report pages", async () => {
    const biography = prepared("biography");
    const world = prepared("world");
    const onPrepare = vi.fn()
      .mockResolvedValueOnce(biography)
      .mockResolvedValueOnce(world);
    const onDispose = vi.fn();
    const user = userEvent.setup();
    render(<AlternatePresentScreen {...screenProps({
      isMobileSave: true,
      onPrepare,
      onDispose,
    })} />);

    await user.click(screen.getByRole("button", { name: "保存这一页" }));
    await screen.findByRole("button", { name: "打开系统保存" });
    await user.click(screen.getByRole("button", { name: "被改变的 2026" }));

    expect(onDispose).toHaveBeenCalledWith(biography);
    expect(screen.getByText(result.worldName)).toBeVisible();
    expect(screen.getByRole("button", { name: "保存这一页" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "保存这一页" }));
    expect(onPrepare).toHaveBeenLastCalledWith(result, "world");
  });

  it("disposes a prepared image when leaving the result screen", async () => {
    const image = prepared();
    const onDispose = vi.fn();
    const user = userEvent.setup();
    const view = render(<AlternatePresentScreen {...screenProps({
      isMobileSave: true,
      onPrepare: vi.fn().mockResolvedValue(image),
      onDispose,
    })} />);

    await user.click(screen.getByRole("button", { name: "保存这一页" }));
    await screen.findByRole("button", { name: "打开系统保存" });
    view.unmount();

    expect(onDispose).toHaveBeenCalledWith(image);
  });

  it("keeps the export action retryable after a render failure", async () => {
    const user = userEvent.setup();
    render(<AlternatePresentScreen {...screenProps({
      onPrepare: vi.fn().mockRejectedValue(new Error("render failed")),
    })} />);

    await user.click(screen.getByRole("button", { name: "保存这一页" }));
    expect(await screen.findByRole("status")).toHaveTextContent("完整图片生成失败，请重试");
    expect(screen.getByRole("button", { name: "重新生成图片" })).toBeEnabled();
  });

  it("pages between the biography and the changed 2026", async () => {
    const user = userEvent.setup();
    render(<AlternatePresentScreen {...screenProps()} />);

    expect(screen.getByText("白话本纪")).toBeVisible();
    expect(screen.getByText("史臣曰 · 文言")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "被改变的 2026" }));
    expect(screen.getByText(result.worldName)).toBeVisible();
    expect(screen.getByLabelText("2026普通人的一天")).toHaveTextContent(result.ordinaryLife2026.join("；"));
    expect(screen.queryByText(/人格|第一反应/)).not.toBeInTheDocument();
  });
});
