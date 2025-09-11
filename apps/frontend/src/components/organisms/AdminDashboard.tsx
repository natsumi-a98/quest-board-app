import React, { useEffect, useState } from "react";
import { Search, Layers, User, PieChart, Settings, X, Eye } from "lucide-react";

// 管理者ダッシュボード（Next.js / React 単一ファイルコンポーネント）
// - Tailwind を想定（プロジェクトに Tailwind が設定済み）
// - デザインガイドのカラーパレット・タイポグラフィを反映し、アクセシビリティに配慮
// - 実データは fetch を呼ぶ想定。ここではダミーデータと fetch プレースホルダを使用。

type Quest = {
  id: number;
  title: string;
  status: "draft" | "published" | "closed" | "pending";
  difficulty: "easy" | "medium" | "hard";
  participants: number;
  maxParticipants: number | null;
  createdAt: string;
};

const DUMMY_QUESTS: Quest[] = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  title: `勇者の試練 #${i + 1}`,
  status: ["draft", "published", "pending", "closed"][i % 4] as Quest["status"],
  difficulty: ["easy", "medium", "hard"][i % 3] as Quest["difficulty"],
  participants: Math.floor(Math.random() * 8),
  maxParticipants: 10,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

export default function AdminDashboard() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: ここで API を呼び、クエストを取得
    setLoading(true);
    // simulate fetch
    setTimeout(() => {
      setQuests(DUMMY_QUESTS);
      setLoading(false);
    }, 300);
  }, []);

  const filtered = quests.filter((q) => {
    const matchesQuery = q.title.includes(query) || String(q.id) === query;
    const matchesStatus = statusFilter ? q.status === statusFilter : true;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#374151] to-[#1f2937] text-gray-100 font-sans">
      <style>{`
        :root {
          --color-primary: #1e3a8a;
          --color-gold: #fbbf24;
          --color-success: #16a34a;
          --color-danger: #dc2626;
          --color-brown: #451a03;
          --bg-card: #fef3c7;
          --radius: 12px;
        }
      `}</style>

      <header className="sticky top-0 z-40 bg-opacity-60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[var(--color-brown)] shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#fbbf24" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold" style={{ fontFamily: "Cinzel, serif" }}>
              管理ダッシュボード
            </h1>
          </div>

          <nav className="ml-auto flex items-center gap-3">
            <button
              aria-label="settings"
              className="flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--color-primary)]/90 hover:bg-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-gold)]"
            >
              <Settings size={16} /> 管理
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-6">
        {/* サイドバー */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="bg-[var(--bg-card)] text-[var(--color-brown)] rounded-2xl p-4 shadow-card" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-md bg-[var(--color-primary)] flex items-center justify-center text-white">A</div>
              <div>
                <div className="text-sm font-semibold">管理者</div>
                <div className="text-xs text-slate-600">master@example.com</div>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              <a className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[rgba(30,58,138,0.08)]" href="#">
                <PieChart size={16} /> ダッシュボード
              </a>
              <a className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[rgba(30,58,138,0.08)]" href="#">
                <Layers size={16} /> クエスト管理
              </a>
              <a className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[rgba(30,58,138,0.08)]" href="#">
                <User size={16} /> ユーザー管理
              </a>
              <a className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[rgba(30,58,138,0.08)]" href="#">
                <Settings size={16} /> 設定
              </a>
            </nav>
          </div>
        </aside>

        {/* メインエリア */}
        <section className="col-span-12 md:col-span-9 lg:col-span-10">
          {/* ステータスカード */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard title="総クエスト数" value={quests.length} icon={<Layers />} />
            <StatCard title="公開中" value={quests.filter((q) => q.status === "published").length} icon={<PieChart />} />
            <StatCard title="申請中" value={quests.filter((q) => q.status === "pending").length} icon={<User />} />
            <StatCard title="満員クエスト" value={quests.filter((q) => q.maxParticipants !== null && q.participants >= q.maxParticipants).length} icon={<X />} />
          </div>

          {/* 検索・フィルタ */}
          <div className="bg-[var(--bg-card)] rounded-2xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <div className="flex items-center w-full md:w-1/2 bg-white rounded-md p-2 shadow-inner">
                <Search size={18} className="text-slate-500" />
                <input
                  aria-label="search quests"
                  className="ml-2 w-full bg-transparent text-slate-800 focus:outline-none"
                  placeholder="クエストタイトルまたはIDで検索"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2 items-center">
                <select
                  aria-label="status filter"
                  value={statusFilter ?? ""}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                  className="rounded-md px-3 py-2 bg-white"
                >
                  <option value="">全て</option>
                  <option value="published">公開中</option>
                  <option value="pending">申請中</option>
                  <option value="draft">下書き</option>
                  <option value="closed">終了</option>
                </select>

                <button
                  className="px-3 py-2 rounded-md bg-[var(--color-primary)] text-white"
                  onClick={() => {
                    setQuery("");
                    setStatusFilter(null);
                  }}
                >
                  リセット
                </button>
              </div>
            </div>
          </div>

          {/* クエスト一覧（カードグリッド） */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-3">読み込み中...</div>
            ) : (
              filtered.map((q) => (
                <article
                  key={q.id}
                  className="bg-[var(--bg-card)] text-[var(--color-brown)] rounded-2xl p-4 shadow-card transform transition hover:scale-102"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "Cinzel, serif" }}>{q.title}</h3>
                      <div className="text-sm text-slate-600 mb-2">ID: {q.id} • 作成: {new Date(q.createdAt).toLocaleDateString()}</div>
                      <div className="flex gap-2 items-center text-sm">
                        <span className="px-2 py-1 rounded-md text-xs bg-[var(--color-gold)]/20">難易度: {q.difficulty}</span>
                        <span className="px-2 py-1 rounded-md text-xs bg-[var(--color-success)]/20">参加: {q.participants}/{q.maxParticipants ?? "-"}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      <button
                        aria-label={`view-${q.id}`}
                        onClick={() => setSelectedQuest(q)}
                        className="rounded-md px-2 py-1 bg-[var(--color-primary)] text-white"
                      >
                        <Eye size={16} />
                      </button>
                      <div className="text-xs text-slate-500">{q.status}</div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      {/* モーダル（クエスト詳細） */}
      {selectedQuest && (
        <Modal onClose={() => setSelectedQuest(null)}>
          <div className="p-6 max-w-2xl">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-semibold" style={{ fontFamily: "Cinzel, serif" }}>{selectedQuest.title}</h2>
              <button onClick={() => setSelectedQuest(null)} aria-label="close-modal" className="p-2 rounded-md bg-gray-100">
                <X />
              </button>
            </div>

            <div className="text-sm text-slate-700 mb-4">
              <p>ステータス: {selectedQuest.status}</p>
              <p>参加者: {selectedQuest.participants}/{selectedQuest.maxParticipants ?? "-"}</p>
              <p>難易度: {selectedQuest.difficulty}</p>
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-md bg-[var(--color-primary)] text-white">公開</button>
              <button className="px-4 py-2 rounded-md bg-[var(--color-brown)] text-white">下書きに戻す</button>
              <button className="px-4 py-2 rounded-md bg-[var(--color-danger)] text-white">削除</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ----------------------------- 小コンポーネント ----------------------------- */

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-4 shadow-card flex items-center gap-4">
      <div className="p-3 rounded-md bg-[var(--color-primary)] text-white">{icon}</div>
      <div>
        <div className="text-sm text-slate-600">{title}</div>
        <div className="text-2xl font-bold" style={{ fontFamily: "JetBrains Mono, monospace" }}>{value}</div>
      </div>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative z-10 w-full max-w-3xl mx-4">{children}</div>
    </div>
  );
}
