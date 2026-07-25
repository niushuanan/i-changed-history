"use client";

import dynamic from "next/dynamic";

const HistoryGame = dynamic(
  () => import("../src/App").then(({ App }) => App),
  {
    ssr: false,
    loading: () => (
      <main className="app-stage" aria-label="新历史正在成形">
        <div className="mobile-prototype game-shell" />
      </main>
    ),
  },
);

export function GameClient() {
  return <HistoryGame />;
}
