import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import SavingsProgress from "./savings-progress";
import { savingsMilestone } from "../lib/savings";

describe("SavingsProgress", () => {
  it("hiển thị đúng phần trăm và số tiền còn thiếu", () => {
    const html = renderToStaticMarkup(
      <SavingsProgress milestone={savingsMilestone(500000, 1000000)} />
    );
    expect(html).toContain("50%");
    expect(html).toContain("500.000");
    expect(html).toContain("width:50%");
  });

  it("hiển thị 'Đã đủ tiền!' khi đạt mốc", () => {
    const html = renderToStaticMarkup(
      <SavingsProgress milestone={savingsMilestone(1000000, 1000000)} />
    );
    expect(html).toContain("Đã đủ tiền!");
    expect(html).toContain("width:100%");
  });

  it("hiển thị 0% khi chưa có đồng nào", () => {
    const html = renderToStaticMarkup(
      <SavingsProgress milestone={savingsMilestone(0, 1000000)} />
    );
    expect(html).toContain("0%");
    expect(html).toContain("width:0%");
  });
});
