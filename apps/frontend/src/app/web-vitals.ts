/**
 * Web Vitals (LCP, FID/INP, CLS, FCP, TTFB) の計測と記録
 *
 * Next.js の組み込み Web Vitals サポートを利用し、
 * コンソールへのログ出力と将来的な外部サービス送信を行う。
 */

export type WebVitalMetric = {
  id: string;
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  navigationType: string;
};

/**
 * Web Vitals の閾値 (Google の推奨値)
 */
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
} as const;

type MetricName = keyof typeof THRESHOLDS;

function getRating(
  name: MetricName,
  value: number
): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

/**
 * Web Vitals メトリクスのハンドラ
 * - 開発環境: コンソールに出力
 * - 本番環境: 将来的に外部サービス (Analytics 等) に送信可能
 */
export function reportWebVitals(metric: WebVitalMetric): void {
  const { name, value, rating, id } = metric;

  if (process.env.NODE_ENV === "development") {
    const emoji =
      rating === "good" ? "✅" : rating === "needs-improvement" ? "⚠️" : "❌";
    console.log(
      `[Web Vitals] ${emoji} ${name}: ${value.toFixed(2)} (${rating}) [id: ${id}]`
    );
  }

  // 本番環境でのレポート先 (例: Google Analytics, Datadog RUM 等)
  // if (process.env.NODE_ENV === 'production') {
  //   sendToAnalytics({ name, value, rating, id });
  // }
}

/**
 * Web Vitals を手動で計測するユーティリティ
 * Next.js の reportWebVitals 以外に PerformanceObserver で補完計測する場合に使用
 */
export function observeWebVitals(): void {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }

  try {
    // Navigation Timing (TTFB)
    const navObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "navigation") {
          const navEntry = entry as PerformanceNavigationTiming;
          const ttfb = navEntry.responseStart - navEntry.requestStart;
          const rating = getRating("TTFB", ttfb);

          if (process.env.NODE_ENV === "development") {
            const emoji =
              rating === "good"
                ? "✅"
                : rating === "needs-improvement"
                  ? "⚠️"
                  : "❌";
            console.log(
              `[Web Vitals] ${emoji} TTFB: ${ttfb.toFixed(2)}ms (${rating})`
            );
          }
        }
      }
    });
    navObserver.observe({ type: "navigation", buffered: true });
  } catch {
    // PerformanceObserver がサポートされていないブラウザでは無視
  }
}
