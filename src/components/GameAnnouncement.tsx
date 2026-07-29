import { Archive, CardsThree, DiceFive, Sparkle, X } from "@phosphor-icons/react";

export function GameAnnouncement({ onClose }: { onClose: () => void }) {
  return (
    <div className="game-announcement-backdrop">
      <section
        className="game-announcement"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-announcement-title"
      >
        <header>
          <span><Sparkle size={15} weight="fill" /> 新玩法公告</span>
          <button type="button" aria-label="关闭玩法公告" onClick={onClose}>
            <X size={18} weight="bold" />
          </button>
        </header>
        <div className="game-announcement__title">
          <small>不用选，命运会找到你</small>
          <h2 id="game-announcement-title">这一次，先抽历史</h2>
          <p>一百个真实历史瞬间藏在时间线上。按下抽取，时间会疾驰，然后把你留在唯一一个现场。</p>
        </div>
        <ol>
          <li>
            <i><DiceFive size={24} weight="duotone" /></i>
            <div><strong>抽中一段命运</strong><span>优先命中还没解锁的历史，不再面对一百张卡纠结。</span></div>
          </li>
          <li>
            <i><CardsThree size={24} weight="duotone" /></i>
            <div><strong>四次抉择，活完一生</strong><span>每幕上划打出一张牌；按住卡牌可以先读完整决定。</span></div>
          </li>
          <li>
            <i><Sparkle size={24} weight="duotone" /></i>
            <div><strong>每幕可以 Roll 3 次</strong><span>第一次立刻换牌，后两次由 AI 现场发出更意外的新牌。</span></div>
          </li>
          <li>
            <i><Archive size={24} weight="duotone" /></i>
            <div><strong>完成才会解锁</strong><span>结局会总结你的一生，以及这段历史如何改变 2026。</span></div>
          </li>
        </ol>
        <button className="game-announcement__action" type="button" onClick={onClose}>
          我知道了，开抽
        </button>
      </section>
    </div>
  );
}
