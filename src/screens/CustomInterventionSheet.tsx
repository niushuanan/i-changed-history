import { useState } from "react";
import { X } from "@phosphor-icons/react";
import type { DeviationClass } from "../game/schema";
import type { CustomSeedResult } from "../game/types";

const MODES: Array<{ label: string; value: DeviationClass; note: string }> = [
  { label: "微调", value: "nudge", note: "小幅偏转" },
  { label: "改写", value: "reform", note: "重组规则" },
  { label: "颠覆", value: "rupture", note: "切断原史" },
];

export function CustomInterventionSheet({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (value: string, deviationClass: DeviationClass) => CustomSeedResult;
}) {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<DeviationClass>("reform");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const result = onSubmit(value, mode);
    if (!result.ok) {
      setError(result.reason === "modern_china" ? "请避开中国近现代史。" : "请把干预写得更具体一些。");
    }
  };

  return (
    <div className="sheet-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="bottom-sheet intervention-sheet" role="dialog" aria-modal="true" aria-labelledby="intervention-title">
        <header>
          <div><span>直接落笔</span><h2 id="intervention-title">自己改写这一步</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭"><X size={22} /></button>
        </header>
        <label htmlFor="intervention-input">本幕干预</label>
        <textarea
          id="intervention-input"
          value={value}
          maxLength={140}
          autoFocus
          placeholder="写下你要这个世界立刻采取的行动"
          onChange={(event) => { setValue(event.target.value); setError(null); }}
        />
        <div className="impact-segments" role="radiogroup" aria-label="干预力度">
          {MODES.map((item) => (
            <button
              key={item.value}
              type="button"
              role="radio"
              aria-label={item.label}
              aria-checked={mode === item.value}
              className={mode === item.value ? "is-active" : ""}
              onClick={() => setMode(item.value)}
            >
              <strong>{item.label}</strong><small>{item.note}</small>
            </button>
          ))}
        </div>
        <div className="sheet-meta"><span className="form-error" role="alert">{error}</span><span>{Array.from(value).length}/140</span></div>
        <button className="primary-command" type="button" onClick={submit}>写入时间线</button>
      </section>
    </div>
  );
}
