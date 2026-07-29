import { Archive, CardsThree, Stack, Sparkle, X } from "@phosphor-icons/react";

export function GameAnnouncement({ onClose }: { onClose: () => void }) {
  const announcementName = import.meta.env.VITE_INTERACTIVE_SPACE === "true"
    ? "体验说明"
    : "游戏说明";
  return (
    <div className="game-announcement-backdrop">
      <section
        className="game-announcement"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-announcement-title"
      >
        <header>
          <span><Sparkle size={15} weight="fill" /> {announcementName}</span>
          <button type="button" aria-label={`关闭${announcementName}`} onClick={onClose}>
            <X size={18} weight="bold" />
          </button>
        </header>
        <div className="game-announcement__title">
          <small>一局约 3—5 分钟</small>
          <h2 id="game-announcement-title">选一段历史，亲手改写它</h2>
          <p>先挑一个你感兴趣的时代，再选择其中的真实历史转折点。接下来的四次抉择，会写完同一个人的一生，也会改变 2026。</p>
        </div>
        <ol>
          <li>
            <i><Stack size={24} weight="duotone" /></i>
            <div><strong>先选剧本组，再选现场</strong><span>第一次可免费打开任意一组；之后由你决定下一个解锁方向。</span></div>
          </li>
          <li>
            <i><CardsThree size={24} weight="duotone" /></i>
            <div><strong>每一幕，只选一张牌</strong><span>循史让眼前这条轨道照常落地，破局会扭转结果，天外则直接动用一种超能力。</span></div>
          </li>
          <li>
            <i><Sparkle size={24} weight="duotone" /></i>
            <div><strong>不满意，就 Roll 换牌</strong><span>每幕最多换三次；按住先看详情，上划才会正式打出。</span></div>
          </li>
          <li>
            <i><Archive size={24} weight="duotone" /></i>
            <div><strong>通关得币，继续开新组</strong><span>结局报告生成后，首次通关奖励 1 枚解锁代币；重玩不会重复得币。</span></div>
          </li>
        </ol>
        <button className="game-announcement__action" type="button" onClick={onClose}>
          开始选组
        </button>
      </section>
    </div>
  );
}
