import { useState } from "react";
import { X } from "@phosphor-icons/react";
import type { CustomSeedResult } from "../game/types";

const ERRORS: Record<Exclude<CustomSeedResult, { ok: true }>["reason"], string> = {
  empty: "先写下一条历史裂缝。",
  too_short: "再具体一点，至少写四个汉字。",
  too_long: "控制在 140 个字以内。",
  not_chinese: "请用中文描述这段历史。",
  modern_china: "请避开中国近现代史，换一个时间或地点。",
};

export function CustomSeedSheet({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (value: string) => CustomSeedResult;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const result = onSubmit(value);
    if (!result.ok) setError(ERRORS[result.reason]);
  };

  return (
    <div className="sheet-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="custom-seed-title">
        <header>
          <div><span>自定义卷宗</span><h2 id="custom-seed-title">从哪一刻开始改写？</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="关闭"><X size={22} /></button>
        </header>
        <label htmlFor="custom-seed-input">历史裂缝</label>
        <textarea
          id="custom-seed-input"
          value={value}
          maxLength={140}
          autoFocus
          placeholder="例如：如果古罗马在公元一世纪普及蒸汽动力"
          onChange={(event) => { setValue(event.target.value); setError(null); }}
        />
        <div className="sheet-meta"><span className="form-error" role="alert">{error}</span><span>{Array.from(value).length}/140</span></div>
        <button className="primary-command" type="button" onClick={submit}>开始改写</button>
      </section>
    </div>
  );
}
