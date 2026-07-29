import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type CardCommitOrigin = {
  left: number;
  top: number;
  width: number;
  height: number;
  screenLeft: number;
  screenTop: number;
  screenWidth: number;
  screenHeight: number;
};

type Particle = {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  lifetime: number;
  driftX: number;
  liftY: number;
  wobble: number;
  ember: boolean;
};

const FLIGHT_AND_SETTLE_MS = 720;
const DISSOLVE_MS = 720;
export const CARD_COMMIT_DURATION_MS = FLIGHT_AND_SETTLE_MS + DISSOLVE_MS + 20;
const PARTICLE_PADDING = 56;

function seededNoise(x: number, y: number, salt: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + salt * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function runParticleDissolve({
  source,
  target,
  width,
  height,
  accent,
}: {
  source: HTMLCanvasElement;
  target: HTMLCanvasElement;
  width: number;
  height: number;
  accent: string;
}) {
  const sourceContext = source.getContext("2d", { willReadFrequently: true });
  const targetContext = target.getContext("2d");
  if (!sourceContext || !targetContext) return null;

  let pixels: ImageData;
  try {
    pixels = sourceContext.getImageData(0, 0, source.width, source.height);
  } catch {
    return null;
  }

  const deviceScale = Math.min(window.devicePixelRatio || 1, 2);
  const canvasWidth = width + PARTICLE_PADDING * 2;
  const canvasHeight = height + PARTICLE_PADDING * 2;
  target.width = Math.ceil(canvasWidth * deviceScale);
  target.height = Math.ceil(canvasHeight * deviceScale);
  target.style.width = `${canvasWidth}px`;
  target.style.height = `${canvasHeight}px`;
  targetContext.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);

  const sourceScaleX = source.width / width;
  const sourceScaleY = source.height / height;
  const step = Math.max(3, Math.round(width / 58));
  const particles: Particle[] = [];

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const sourceX = Math.min(source.width - 1, Math.floor((x + step / 2) * sourceScaleX));
      const sourceY = Math.min(source.height - 1, Math.floor((y + step / 2) * sourceScaleY));
      const offset = (sourceY * source.width + sourceX) * 4;
      const alpha = pixels.data[offset + 3];
      if (alpha < 28) continue;

      const noise = seededNoise(x, y, 1);
      const drift = seededNoise(x, y, 2);
      const lift = seededNoise(x, y, 3);
      const verticalProgress = 1 - y / Math.max(1, height);
      particles.push({
        x,
        y,
        size: Math.min(step + 1, width - x, height - y),
        color: `rgba(${pixels.data[offset]}, ${pixels.data[offset + 1]}, ${pixels.data[offset + 2]}, ${alpha / 255})`,
        delay: verticalProgress * 310 + noise * 145,
        lifetime: 260 + lift * 260,
        driftX: 14 + drift * 42,
        liftY: 18 + lift * 42,
        wobble: noise * Math.PI * 2,
        ember: seededNoise(x, y, 4) > .925,
      });
    }
  }

  if (particles.length === 0) return null;

  let frame = 0;
  const startedAt = performance.now();
  const draw = (now: number) => {
    const elapsed = now - startedAt;
    targetContext.clearRect(0, 0, canvasWidth, canvasHeight);

    for (const particle of particles) {
      const local = elapsed - particle.delay;
      const progress = Math.max(0, Math.min(1, local / particle.lifetime));
      const eased = 1 - Math.pow(1 - progress, 3);
      const alpha = local < 0 ? 1 : Math.pow(1 - progress, 1.45);
      if (alpha <= .015) continue;

      const flutter = Math.sin(eased * 7 + particle.wobble) * 4.5 * eased;
      const x = PARTICLE_PADDING + particle.x + particle.driftX * eased + flutter;
      const y = PARTICLE_PADDING + particle.y - particle.liftY * eased - 18 * eased * eased;
      const size = particle.size * (1 - eased * .55);

      targetContext.globalAlpha = alpha;
      targetContext.fillStyle = particle.ember && progress > .02 && progress < .42
        ? accent
        : particle.color;
      targetContext.fillRect(x, y, Math.max(.7, size), Math.max(.7, size));
    }

    targetContext.globalAlpha = 1;
    if (elapsed < DISSOLVE_MS) frame = window.requestAnimationFrame(draw);
  };

  frame = window.requestAnimationFrame(draw);
  return () => window.cancelAnimationFrame(frame);
}

function getFlightGeometry(origin: CardCommitOrigin) {
  const widthLimit = origin.screenWidth * .36;
  const desiredScale = Math.min(1.12, widthLimit / Math.max(1, origin.width));
  let targetWidth = origin.width * Math.max(1.04, desiredScale);
  let targetHeight = origin.height * (targetWidth / Math.max(1, origin.width));
  const heightLimit = origin.screenHeight * .43;

  if (targetHeight > heightLimit) {
    const fit = heightLimit / targetHeight;
    targetWidth *= fit;
    targetHeight *= fit;
  }

  const targetLeft = origin.screenLeft + (origin.screenWidth - targetWidth) / 2;
  const targetTop = origin.screenTop + Math.max(56, Math.min(88, origin.screenHeight * .09));
  const fromX = origin.left - targetLeft;
  const fromY = origin.top - targetTop;

  return {
    targetLeft,
    targetTop,
    targetWidth,
    targetHeight,
    fromX,
    fromY,
    midX: fromX * .42,
    midY: fromY * .4 - 24,
    scaleX: origin.width / Math.max(1, targetWidth),
    scaleY: origin.height / Math.max(1, targetHeight),
  };
}

export function CardCommitFlight({
  origin,
  tier,
  displayLabel,
  description,
  icon,
  frame,
  accent,
  startRotation,
  reducedMotion,
  onComplete,
}: {
  origin: CardCommitOrigin;
  tier: string;
  displayLabel: string;
  description: string;
  icon: string;
  frame: string;
  accent: string;
  startRotation: number;
  reducedMotion: boolean;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"flying" | "dissolving">("flying");
  const [particleActive, setParticleActive] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const capturePromiseRef = useRef<Promise<HTMLCanvasElement | null> | null>(null);
  const completedRef = useRef(false);
  const geometry = getFlightGeometry(origin);

  useLayoutEffect(() => {
    if (
      reducedMotion
      || !cardRef.current
      || typeof navigator === "undefined"
      || navigator.userAgent.toLowerCase().includes("jsdom")
    ) return;

    const card = cardRef.current;
    capturePromiseRef.current = import("html-to-image")
      .then(({ toCanvas }) => toCanvas(card, {
        width: Math.ceil(geometry.targetWidth),
        height: Math.ceil(geometry.targetHeight),
        canvasWidth: Math.ceil(geometry.targetWidth),
        canvasHeight: Math.ceil(geometry.targetHeight),
        pixelRatio: 1,
        skipAutoScale: true,
      }))
      .catch(() => null);
  }, [geometry.targetHeight, geometry.targetWidth, reducedMotion]);

  useEffect(() => {
    const dissolveTimer = window.setTimeout(
      () => setPhase("dissolving"),
      reducedMotion ? 60 : FLIGHT_AND_SETTLE_MS,
    );
    const completeTimer = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete();
    }, reducedMotion ? 180 : CARD_COMMIT_DURATION_MS);

    return () => {
      window.clearTimeout(dissolveTimer);
      window.clearTimeout(completeTimer);
    };
  }, [onComplete, reducedMotion]);

  useEffect(() => {
    if (phase !== "dissolving" || reducedMotion) return undefined;
    let cancelled = false;
    let stopParticles = () => {};

    capturePromiseRef.current?.then((source) => {
      if (cancelled || !source || !particleCanvasRef.current) return;
      const stop = runParticleDissolve({
        source,
        target: particleCanvasRef.current,
        width: Math.ceil(geometry.targetWidth),
        height: Math.ceil(geometry.targetHeight),
        accent,
      });
      if (!stop) return;
      stopParticles = stop;
      setParticleActive(true);
    });

    return () => {
      cancelled = true;
      stopParticles();
    };
  }, [accent, geometry.targetHeight, geometry.targetWidth, phase, reducedMotion]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-hidden="true"
      className={`card-commit-flight is-${phase}${particleActive ? " has-particles" : ""}${reducedMotion ? " is-reduced-motion" : ""}`}
      data-phase={phase}
      style={{
        "--flight-left": `${geometry.targetLeft}px`,
        "--flight-top": `${geometry.targetTop}px`,
        "--flight-width": `${geometry.targetWidth}px`,
        "--flight-height": `${geometry.targetHeight}px`,
        "--flight-from-x": `${geometry.fromX}px`,
        "--flight-from-y": `${geometry.fromY}px`,
        "--flight-mid-x": `${geometry.midX}px`,
        "--flight-mid-y": `${geometry.midY}px`,
        "--flight-scale-x": geometry.scaleX,
        "--flight-scale-y": geometry.scaleY,
        "--flight-start-rotation": `${startRotation}deg`,
        "--flight-accent": accent,
        "--flight-frame": `url("${frame}")`,
        "--particle-padding": `${PARTICLE_PADDING}px`,
      } as React.CSSProperties}
    >
      <div className="card-commit-flight__card" ref={cardRef}>
        <span className="card-commit-flight__surface">
          <span className="card-commit-flight__tier">{tier}</span>
          <span className="card-commit-flight__art"><img src={icon} alt="" /></span>
          <strong>{displayLabel}</strong>
          <small>{description}</small>
        </span>
      </div>
      <canvas className="card-commit-flight__particles" ref={particleCanvasRef} />
    </div>,
    document.body,
  );
}
