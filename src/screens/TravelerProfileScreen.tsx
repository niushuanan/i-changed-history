import { useState } from "react";
import { ArrowRight, ClockCounterClockwise, UserCircle } from "@phosphor-icons/react";
import { getTravelerAbility, OCCUPATIONS, RISK_STYLES, STRENGTHS, validateTravelerProfile } from "../game/profile";
import type { TravelerOccupation, TravelerProfile, TravelerRiskStyle, TravelerStrength } from "../game/types";

const OCCUPATION_LABELS: Record<TravelerOccupation, string> = {
  student: "学生", product: "产品 / 运营", engineering: "工程 / 科技", business: "商业 / 金融", creative: "创作 / 传播", "public-service": "公共事务",
};
const STRENGTH_LABELS: Record<TravelerStrength, string> = {
  negotiation: "谈判", organization: "组织", technology: "技术", business: "商业", writing: "表达", strategy: "谋略", law: "法律", medicine: "医学",
};
const RISK_LABELS: Record<TravelerRiskStyle, { title: string; detail: string }> = {
  cautious: { title: "谨慎", detail: "先保住可控局面" }, balanced: { title: "权衡", detail: "在收益与代价间下注" }, bold: { title: "激进", detail: "敢把历史推向未知" },
};

export function TravelerProfileScreen({ onSubmit }: { onSubmit: (profile: TravelerProfile) => void }) {
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState<TravelerOccupation | null>(null);
  const [strengths, setStrengths] = useState<TravelerStrength[]>([]);
  const [riskStyle, setRiskStyle] = useState<TravelerRiskStyle | null>(null);
  const [error, setError] = useState("");
  const ability = occupation && strengths.length === 2 && riskStyle
    ? getTravelerAbility({ name: name || "穿越者", occupation, strengths: [strengths[0], strengths[1]], riskStyle })
    : null;

  const toggleStrength = (strength: TravelerStrength) => {
    setError("");
    setStrengths((current) => current.includes(strength) ? current.filter((item) => item !== strength) : current.length < 2 ? [...current, strength] : current);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = validateTravelerProfile({ name, occupation, strengths, riskStyle });
    if (!result.ok) { setError(Object.values(result.errors)[0] ?? "请完成穿越者档案"); return; }
    onSubmit(result.value);
  };

  return (
    <main className="profile-screen">
      <header className="profile-hero">
        <span><ClockCounterClockwise size={18} weight="bold" /> 时空入境处 · 2026</span>
        <h1>I！我改变了历史</h1>
        <p>你不是旁观者。几分钟后，你会带着今天的能力，成为一个真实历史瞬间里的关键参与者。</p>
      </header>
      <form className="profile-form" onSubmit={submit}>
        <section>
          <div className="form-heading"><UserCircle size={24} weight="bold" /><div><strong>穿越者档案</strong><small>不限制历史节点，决定每一代接力者的优势与代价</small></div></div>
          <label className="name-field">你的名字<input aria-label="你的名字" value={name} maxLength={12} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="2-12 个字" /></label>
        </section>
        <fieldset><legend><b>你来自什么领域？</b><small>选择一项</small></legend><div className="profile-options profile-options--two">{OCCUPATIONS.map((item) => <label key={item.value} className={occupation === item.value ? "is-selected" : ""}><input type="radio" name="occupation" checked={occupation === item.value} onChange={() => { setOccupation(item.value); setError(""); }} />{OCCUPATION_LABELS[item.value]}</label>)}</div></fieldset>
        <fieldset><legend><b>你最能依靠的能力？</b><small>必须选择两项 · {strengths.length}/2</small></legend><div className="profile-options profile-options--four">{STRENGTHS.map((item) => <label key={item.value} className={strengths.includes(item.value) ? "is-selected" : ""}><input type="checkbox" checked={strengths.includes(item.value)} onChange={() => toggleStrength(item.value)} />{STRENGTH_LABELS[item.value]}</label>)}</div></fieldset>
        <fieldset><legend><b>面对未知，你更倾向？</b><small>选择一项</small></legend><div className="risk-options">{RISK_STYLES.map((item) => <label key={item.value} className={riskStyle === item.value ? "is-selected" : ""}><input type="radio" name="risk" checked={riskStyle === item.value} onChange={() => { setRiskStyle(item.value); setError(""); }} /><strong>{RISK_LABELS[item.value].title}</strong><small>{RISK_LABELS[item.value].detail}</small></label>)}</div></fieldset>
        {ability && <section className="ability-preview"><span>你的时空能力</span><strong>{ability.title}</strong><p>{ability.strengths} · {ability.action}</p><small>{ability.style}</small></section>}
        <p className="profile-error" role="alert">{error}</p>
        <button className="primary-command" type="submit">生成我的历史坐标 <ArrowRight size={21} weight="bold" /></button>
      </form>
    </main>
  );
}
