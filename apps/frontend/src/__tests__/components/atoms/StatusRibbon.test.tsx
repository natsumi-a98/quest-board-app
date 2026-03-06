import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusRibbon from "@/components/atoms/StatusRibbon";

describe("StatusRibbon", () => {
  it("participating のとき「募集中」と表示される", () => {
    render(<StatusRibbon status="participating" />);
    expect(screen.getByText("募集中")).toBeInTheDocument();
  });

  it("completed のとき「完了済み」と表示される", () => {
    render(<StatusRibbon status="completed" />);
    expect(screen.getByText("完了済み")).toBeInTheDocument();
  });

  it("applied のとき「応募中」と表示される", () => {
    render(<StatusRibbon status="applied" />);
    expect(screen.getByText("応募中")).toBeInTheDocument();
  });

  it("participating のとき青系のクラスが付く", () => {
    const { container } = render(<StatusRibbon status="participating" />);
    expect(container.firstChild?.firstChild).toHaveClass("text-blue-800");
  });

  it("completed のとき緑系のクラスが付く", () => {
    const { container } = render(<StatusRibbon status="completed" />);
    expect(container.firstChild?.firstChild).toHaveClass("text-green-800");
  });

  it("applied のときオレンジ系のクラスが付く", () => {
    const { container } = render(<StatusRibbon status="applied" />);
    expect(container.firstChild?.firstChild).toHaveClass("text-orange-800");
  });
});
