type ChoiceCardFaceProps = {
  description: string;
  displayLabel: string;
  frame: string;
  icon: string;
  showHoldCue?: boolean;
  tier: string;
};

export function ChoiceCardFace({
  description,
  displayLabel,
  frame,
  icon,
  showHoldCue = false,
  tier,
}: ChoiceCardFaceProps) {
  return (
    <span className="choice-card__surface">
      <img
        aria-hidden="true"
        className="choice-card__frame-image"
        draggable={false}
        src={frame}
      />
      {showHoldCue ? (
        <span className="choice-card__hold-cue" aria-hidden="true"><i /></span>
      ) : null}
      <span className="choice-card__tier">{tier}</span>
      <span className="choice-card__art"><img src={icon} alt="" draggable={false} /></span>
      <strong>{displayLabel}</strong>
      <small>{description}</small>
    </span>
  );
}
