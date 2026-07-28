type RenderOptions = {
  backgroundColor?: string;
  pixelRatio?: number;
  width?: number;
  height?: number;
  style?: Partial<CSSStyleDeclaration>;
};

const SVG_NAMESPACE = String.fromCharCode(
  104, 116, 116, 112, 58, 47, 47,
  119, 119, 119, 46, 119, 51, 46, 111, 114, 103,
  47, 50, 48, 48, 48, 47, 115, 118, 103,
);

function canvasDataUrl(
  image: CanvasImageSource,
  width: number,
  height: number,
): string {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("当前浏览器无法准备报告画面。");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/png");
}

function loadLocalImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "sync";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("无法读取报告中的本地图片。"));
    image.src = url;
  });
}

function localResourceInliner() {
  const cache = new Map<string, Promise<string>>();

  const inlineUrl = (rawUrl: string): Promise<string> => {
    if (rawUrl.startsWith("data:")) return Promise.resolve(rawUrl);
    const absoluteUrl = new URL(rawUrl, document.baseURI).href;
    const existing = cache.get(absoluteUrl);
    if (existing) return existing;
    const pending = loadLocalImage(absoluteUrl).then((image) => canvasDataUrl(
      image,
      image.naturalWidth,
      image.naturalHeight,
    ));
    cache.set(absoluteUrl, pending);
    return pending;
  };

  const inlineCssUrls = async (value: string): Promise<string> => {
    const pattern = /url\(\s*(["']?)(.*?)\1\s*\)/g;
    const matches: Array<{ start: number; end: number; url: string }> = [];
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(value)) !== null) {
      matches.push({
        start: match.index,
        end: pattern.lastIndex,
        url: match[2] ?? "",
      });
    }
    if (matches.length === 0) return value;

    let cursor = 0;
    let inlined = "";
    for (const item of matches) {
      inlined += value.slice(cursor, item.start);
      const dataUrl = await inlineUrl(item.url);
      inlined += `url("${dataUrl}")`;
      cursor = item.end;
    }
    return inlined + value.slice(cursor);
  };

  return { inlineCssUrls };
}

async function copyComputedStyles(
  source: Element,
  target: Element,
  inlineCssUrls: (value: string) => Promise<string>,
): Promise<void> {
  const targetStyle = (target as HTMLElement | SVGElement).style;
  if (targetStyle) {
    const computed = globalThis.getComputedStyle(source);
    for (let index = 0; index < computed.length; index += 1) {
      const property = computed.item(index);
      const value = computed.getPropertyValue(property);
      targetStyle.setProperty(
        property,
        value.includes("url(") ? await inlineCssUrls(value) : value,
        computed.getPropertyPriority(property),
      );
    }
  }

  if (source instanceof HTMLImageElement && target instanceof HTMLImageElement) {
    if (!source.complete || source.naturalWidth === 0) await source.decode();
    target.removeAttribute("srcset");
    target.src = canvasDataUrl(source, source.naturalWidth, source.naturalHeight);
  }

  const sourceChildren = source.children;
  const targetChildren = target.children;
  for (let index = 0; index < sourceChildren.length; index += 1) {
    const sourceChild = sourceChildren.item(index);
    const targetChild = targetChildren.item(index);
    if (sourceChild && targetChild) {
      await copyComputedStyles(sourceChild, targetChild, inlineCssUrls);
    }
  }
}

function applyRootStyle(
  target: HTMLElement,
  style: Partial<CSSStyleDeclaration> | undefined,
): void {
  if (!style) return;
  for (const [property, value] of Object.entries(style)) {
    if (typeof value !== "string") continue;
    target.style.setProperty(property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`), value);
  }
}

function imageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "sync";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("无法读取完整报告画面。"));
    image.src = url;
  });
}

function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });
}

export async function toBlob(
  node: HTMLElement,
  options: RenderOptions = {},
): Promise<Blob | null> {
  const width = Math.max(1, Math.ceil(options.width ?? node.scrollWidth ?? node.clientWidth));
  const height = Math.max(1, Math.ceil(options.height ?? node.scrollHeight ?? node.clientHeight));
  const pixelRatio = Math.max(1, options.pixelRatio ?? 1);
  const clone = node.cloneNode(true) as HTMLElement;
  const { inlineCssUrls } = localResourceInliner();
  await copyComputedStyles(node, clone, inlineCssUrls);
  applyRootStyle(clone, options.style);
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.margin = "0";

  const svg = document.createElementNS(SVG_NAMESPACE, "svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  const foreignObject = document.createElementNS(SVG_NAMESPACE, "foreignObject");
  foreignObject.setAttribute("width", "100%");
  foreignObject.setAttribute("height", "100%");
  foreignObject.append(clone);
  svg.append(foreignObject);

  const serialized = new XMLSerializer().serializeToString(svg);
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`;
  const image = await imageFromUrl(svgUrl);
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * pixelRatio);
  canvas.height = Math.ceil(height * pixelRatio);
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.scale(pixelRatio, pixelRatio);
  context.fillStyle = options.backgroundColor ?? "transparent";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  return await canvasBlob(canvas);
}
