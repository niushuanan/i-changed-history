import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChoiceCardFace } from "./ChoiceCardFace";

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

type AshParticle = {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  lifetime: number;
  driftX: number;
  liftY: number;
  wobble: number;
};

const FLIGHT_MS = 520;
const SETTLE_MS = 100;
const DISSOLVE_MS = 620;
const DISSOLVE_START_MS = FLIGHT_MS + SETTLE_MS;
export const CARD_COMMIT_DURATION_MS = DISSOLVE_START_MS + DISSOLVE_MS + 20;
const PARTICLE_PADDING = 48;
const MIN_ASH_PARTICLE_COUNT = 96;
const MAX_ASH_PARTICLE_COUNT = 150;

function seededNoise(x: number, y: number, salt: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + salt * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function runAshDissolve({
  target,
  width,
  height,
  accent,
}: {
  target: HTMLCanvasElement;
  width: number;
  height: number;
  accent: string;
}) {
  const context = target.getContext("2d");
  if (!context) return () => {};

  const deviceScale = Math.min(window.devicePixelRatio || 1, 1.5);
  const canvasWidth = width + PARTICLE_PADDING * 2;
  const canvasHeight = height + PARTICLE_PADDING * 2;
  target.width = Math.ceil(canvasWidth * deviceScale);
  target.height = Math.ceil(canvasHeight * deviceScale);
  target.style.width = `${canvasWidth}px`;
  target.style.height = `${canvasHeight}px`;
  context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
  context.imageSmoothingEnabled = false;

  const palette = [accent, "#e8dcc0", "#9d8f75", "#403a31", "#211e1a"];
  const particleCount = Math.max(
    MIN_ASH_PARTICLE_COUNT,
    Math.min(MAX_ASH_PARTICLE_COUNT, Math.round(width * height / 220)),
  );
  const particles: AshParticle[] = Array.from({ length: particleCount }, (_, index) => {
    const xNoise = seededNoise(index, 1, 1);
    const yNoise = seededNoise(index, 2, 2);
    const motionNoise = seededNoise(index, 3, 3);
    const sizeNoise = seededNoise(index, 4, 4);
    const y = height * (.035 + yNoise * .93);
    const verticalProgress = 1 - y / Math.max(1, height);
    return {
      x: width * (.025 + xNoise * .95),
      y,
      size: 1.1 + sizeNoise * 3.2,
      color: palette[Math.floor(seededNoise(index, 5, 5) * palette.length)] ?? accent,
      delay: verticalProgress * 330 + seededNoise(index, 6, 6) * 62,
      lifetime: 190 + motionNoise * 250,
      driftX: 10 + seededNoise(index, 7, 7) * 42,
      liftY: 24 + seededNoise(index, 8, 8) * 58,
      wobble: seededNoise(index, 9, 9) * Math.PI * 2,
    };
  });

  let frame = 0;
  const startedAt = performance.now();
  const draw = (now: number) => {
    const elapsed = now - startedAt;
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    for (const particle of particles) {
      const local = elapsed - particle.delay;
      if (local < 0) continue;
      const progress = Math.min(1, local / particle.lifetime);
      const eased = 1 - Math.pow(1 - progress, 3);
      const alpha = Math.pow(1 - progress, 1.35);
      if (alpha <= .018) continue;

      const flutter = Math.sin(eased * 7 + particle.wobble) * 4 * eased;
      const x = PARTICLE_PADDING + particle.x + particle.driftX * eased + flutter;
      const y = PARTICLE_PADDING + particle.y - particle.liftY * eased - 12 * eased * eased;
      const size = Math.max(.65, particle.size * (1 - eased * .62));

      context.globalAlpha = alpha;
      context.fillStyle = particle.color;
      context.fillRect(x, y, size, size * (1.15 + eased));
    }

    context.globalAlpha = 1;
    if (elapsed < DISSOLVE_MS) frame = window.requestAnimationFrame(draw);
  };

  frame = window.requestAnimationFrame(draw);
  return () => window.cancelAnimationFrame(frame);
}

function quadraticPoint(start: number, control: number, progress: number) {
  const inverse = 1 - progress;
  return inverse * inverse * start + 2 * inverse * progress * control;
}

export function getFlightGeometry(origin: CardCommitOrigin) {
  const widthLimit = origin.screenWidth * .4;
  const desiredScale = Math.min(1.16, widthLimit / Math.max(1, origin.width));
  let targetWidth = origin.width * Math.max(1.05, desiredScale);
  let targetHeight = origin.height * (targetWidth / Math.max(1, origin.width));
  const heightLimit = origin.screenHeight * .45;

  if (targetHeight > heightLimit) {
    const fit = heightLimit / targetHeight;
    targetWidth *= fit;
    targetHeight *= fit;
  }

  const targetLeft = origin.screenLeft + (origin.screenWidth - targetWidth) / 2;
  const targetTop = origin.screenTop + 8;
  const fromX = origin.left - targetLeft;
  const fromY = origin.top - targetTop;
  const controlX = fromX * .78;
  const controlY = fromY * .58 - Math.min(24, Math.max(0, fromY) * .06);
  const point25 = {
    x: quadraticPoint(fromX, controlX, .25),
    y: quadraticPoint(fromY, controlY, .25),
  };
  const point50 = {
    x: quadraticPoint(fromX, controlX, .5),
    y: quadraticPoint(fromY, controlY, .5),
  };
  const point75 = {
    x: quadraticPoint(fromX, controlX, .75),
    y: quadraticPoint(fromY, controlY, .75),
  };

  return {
    targetLeft,
    targetTop,
    targetWidth,
    targetHeight,
    fromX,
    fromY,
    point25,
    point50,
    point75,
    scaleX: origin.width / Math.max(1, targetWidth),
    scaleY: origin.height / Math.max(1, targetHeight),
  };
}

export function CardCommitFlight({
  origin,
  tier,
  deviationClass,
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
  deviationClass: "nudge" | "reform" | "rupture";
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
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const completedRef = useRef(false);
  const geometry = useMemo(() => getFlightGeometry(origin), [origin]);

  useEffect(() => {
    const dissolveTimer = window.setTimeout(
      () => setPhase("dissolving"),
      reducedMotion ? 60 : DISSOLVE_START_MS,
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
    if (
      phase !== "dissolving"
      || reducedMotion
      || !particleCanvasRef.current
      || (typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("jsdom"))
    ) return undefined;
    return runAshDissolve({
      target: particleCanvasRef.current,
      width: Math.ceil(geometry.targetWidth),
      height: Math.ceil(geometry.targetHeight),
      accent,
    });
  }, [accent, geometry.targetHeight, geometry.targetWidth, phase, reducedMotion]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="card-commit-layer" aria-hidden="true">
      <div
        className={`card-commit-flight is-${phase}${reducedMotion ? " is-reduced-motion" : ""}`}
        data-phase={phase}
        data-target-top={geometry.targetTop}
        style={{
          "--flight-left": `${geometry.targetLeft}px`,
          "--flight-top": `${geometry.targetTop}px`,
          "--flight-width": `${geometry.targetWidth}px`,
          "--flight-height": `${geometry.targetHeight}px`,
          "--flight-from-x": `${geometry.fromX}px`,
          "--flight-from-y": `${geometry.fromY}px`,
          "--flight-x-25": `${geometry.point25.x}px`,
          "--flight-y-25": `${geometry.point25.y}px`,
          "--flight-x-50": `${geometry.point50.x}px`,
          "--flight-y-50": `${geometry.point50.y}px`,
          "--flight-x-75": `${geometry.point75.x}px`,
          "--flight-y-75": `${geometry.point75.y}px`,
          "--flight-scale-x": geometry.scaleX,
          "--flight-scale-y": geometry.scaleY,
          "--flight-start-rotation": `${startRotation}deg`,
          "--flight-rotation-25": `${startRotation * .72}deg`,
          "--flight-rotation-50": `${startRotation * .4}deg`,
          "--flight-rotation-75": `${startRotation * .14}deg`,
          "--flight-accent": accent,
          "--flight-frame": `url("${frame}")`,
          "--particle-padding": `${PARTICLE_PADDING}px`,
        } as React.CSSProperties}
      >
        <div className={`choice-card choice-card--${deviationClass} card-commit-flight__card`}>
          <ChoiceCardFace
            description={description}
            displayLabel={displayLabel}
            frame={frame}
            icon={icon}
            tier={tier}
          />
        </div>
        <canvas className="card-commit-flight__particles" ref={particleCanvasRef} />
      </div>
    </div>,
    document.body,
  );
}
