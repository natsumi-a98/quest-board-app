"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/organisms/Header";

export const HeaderWrapper = () => {
  const pathname = usePathname();

  // ヘッダーを非表示にする画面のパス
  const hideHeaderPaths = ["/login", "/signUp"];

  // 指定されたパスではヘッダーを非表示にする
  const shouldShowHeader = !hideHeaderPaths.some((path) =>
    pathname?.includes(path)
  );

  if (!shouldShowHeader) {
    return null;
  }

  return <Header />;
};
