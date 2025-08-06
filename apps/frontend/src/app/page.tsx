// app/page.tsx
import QuestsPage from '@/components/QuestsPage';

export default function Home() {
  return (
    <>
      <header>ここは共通のヘッダー</header>
      <main>
        <QuestsPage />
      </main>
      <footer>フッター</footer>
    </>
  );
}
