import { useState } from "react";
import { ArrowLeft, ArrowRight, ClockCounterClockwise, Eye, Lightning, Play, Sparkle } from "@phosphor-icons/react";
import { buildTravelerProfile, getTravelerAbility, PERSONALITY_QUESTIONS } from "../game/profile";
import type { TravelerPersonalityDimensions, TravelerProfile } from "../game/types";

type CalibrationStep = "intro" | number | "result";

export function TravelerProfileScreen({ onSubmit, onStartExperience }: {
  onSubmit: (profile: TravelerProfile) => void;
  onStartExperience: () => Promise<boolean> | void;
}) {
  const [step, setStep] = useState<CalibrationStep>("intro");
  const [answers, setAnswers] = useState<Partial<TravelerPersonalityDimensions>>({});
  const profile = Object.keys(answers).length === 4
    ? buildTravelerProfile(answers as TravelerPersonalityDimensions)
    : null;
  const ability = profile ? getTravelerAbility(profile) : null;

  const begin = () => {
    void onStartExperience();
    setStep(0);
  };

  const choose = (questionIndex: number, value: string) => {
    const question = PERSONALITY_QUESTIONS[questionIndex];
    setAnswers((current) => ({ ...current, [question.dimension]: value }));
    setStep(questionIndex === PERSONALITY_QUESTIONS.length - 1 ? "result" : questionIndex + 1);
  };

  const goBack = () => {
    if (step === "result") setStep(PERSONALITY_QUESTIONS.length - 1);
    else if (typeof step === "number") setStep(step === 0 ? "intro" : step - 1);
  };

  return (
    <main className="calibration-screen" data-stage={String(step)}>
      <img className="calibration-screen__art" src="/assets/generating-opening.webp" alt="" />

      {step === "intro" && (
        <section className="calibration-intro">
          <span className="calibration-kicker"><ClockCounterClockwise size={17} weight="bold" /> 时空入境处 · 2026</span>
          <div className="calibration-intro__title">
            <h1>I！我改变了历史</h1>
            <p>历史不会问你擅长什么。它只会在最坏的一刻，逼你暴露真正的本能。</p>
          </div>
          <div className="calibration-intro__signal" aria-label="四次历史困境">
            <i /><i /><i /><i />
            <span>4 次困境 · 生成本局时空人格</span>
          </div>
          <button className="primary-command calibration-start" type="button" onClick={begin}>
            <Play size={20} weight="fill" /> 开始人格校准
          </button>
        </section>
      )}

      {typeof step === "number" && (() => {
        const question = PERSONALITY_QUESTIONS[step];
        return (
          <section className="calibration-question">
            <header className="calibration-nav">
              <button type="button" onClick={goBack} aria-label="返回上一题"><ArrowLeft size={20} weight="bold" /></button>
              <div><span>{step + 1}</span><i>/</i><strong>4</strong></div>
            </header>
            <div className="calibration-progress" aria-hidden="true">
              {PERSONALITY_QUESTIONS.map((item, index) => <i key={item.dimension} className={index <= step ? "is-active" : ""} />)}
            </div>
            <span className="calibration-question__marker">困境 {String(step + 1).padStart(2, "0")} · {question.marker}</span>
            <h2>{question.situation}</h2>
            <p>{question.context}</p>
            <div className="calibration-choices">
              {question.options.map((option) => (
                <button key={option.code} type="button" onClick={() => choose(step, option.value)}>
                  <span>{option.code}</span>
                  <div><strong>{option.title}</strong><small>{option.detail}</small></div>
                  <ArrowRight size={20} weight="bold" />
                </button>
              ))}
            </div>
          </section>
        );
      })()}

      {step === "result" && profile && ability && (
        <section className="calibration-result">
          <header className="calibration-nav">
            <button type="button" onClick={goBack} aria-label="修改上一题"><ArrowLeft size={20} weight="bold" /></button>
            <span>校准完成</span>
          </header>
          <div className="type-reveal">
            <span>你的时空人格</span>
            <h2>{profile.typeCode}</h2>
            <strong>{profile.name}</strong>
            <p>{ability.strengths}</p>
          </div>
          <div className="type-rules">
            <article><Sparkle size={21} weight="fill" /><div><strong>每幕专属行动</strong><span>{ability.action}</span></div></article>
            <article><Eye size={21} weight="bold" /><div><strong>因果预判</strong><span>{ability.preview}</span></div></article>
            <article><Lightning size={21} weight="fill" /><div><strong>三次自由改命</strong><span>{ability.customAction}</span></div></article>
          </div>
          <button className="primary-command" type="button" onClick={() => onSubmit(profile)}>
            进入五十个历史瞬间 <ArrowRight size={21} weight="bold" />
          </button>
        </section>
      )}
    </main>
  );
}
