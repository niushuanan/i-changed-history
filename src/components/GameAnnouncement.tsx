import { Archive, CardsThree, DiceFive, Sparkle, X } from "@phosphor-icons/react";

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
          <h2 id="game-announcement-title">抽一段历史，亲手改写它</h2>
          <p>你会随机进入一个真实历史转折点，成为当时的一名关键人物。接下来的四次选择，会写完他的一生，也会改变 2026。</p>
        </div>
        <ol>
          <li>
            <i><DiceFive size={24} weight="duotone" /></i>
            <div><strong>先抽一个历史开局</strong><span>卡牌会沿时间匀速旋转，随后揭晓一个真实历史现场。</span></div>
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
            <div><strong>四次选择，走完一生</strong><span>第四次选择落定就解锁这段历史；档案可以反复重玩，结局继续写到 2026。</span></div>
          </li>
        </ol>
        <button className="game-announcement__action" type="button" onClick={onClose}>
          开始抽取
        </button>
      </section>
    </div>
  );
}
