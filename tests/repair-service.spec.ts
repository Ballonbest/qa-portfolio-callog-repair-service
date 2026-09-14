import { test, expect } from "@playwright/test";
import { escape } from "querystring";

let goto_CustomerService = "https://samart-calllog.netserviceth.com/signin?redirect=/admin";
const locatorEmail = "Username/Email";
const locatorPassword = "Password";

const userHelpdesk = process.env.HELPDESK_USER;
const passHelpdesk = process.env.HELPDESK_PASSWORD;

if (!userHelpdesk || !passHelpdesk) {
  throw new Error("Missing HELPDESK_USER or HELPDESK_PASSWORD in .env");
}

test.beforeEach(async ({ page }) => {
  await page.goto(goto_CustomerService);
});

test.describe("Repair Service - Helpdesk", () => {
  test("TC_LOGIN_POS_001", async ({ page }) => {
    await page.getByPlaceholder(locatorEmail).fill(userHelpdesk);
    await page.getByPlaceholder(locatorPassword).fill(passHelpdesk);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/admin\/d0w4suxz4qa$/);
    await expect(page).toHaveTitle("🖨 Repair Service");
    await page.getByRole("link", { name: /Create Ticket/i }).click();
    await expect(page).toHaveURL(/\/admin\/z3no72inkol$/);
    await expect(page).toHaveTitle(/👩‍💻 Create Ticket/i);
  });

  test("TC_LOGIN_NEG_001", async ({ page }) => {
    await page.getByPlaceholder(locatorEmail).fill(userHelpdesk);
    await page.getByPlaceholder(locatorPassword).fill(passHelpdesk);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/admin\//);
    await expect(page.getByText("Repair Service", { exact: true }).first()).toBeVisible();
  });

  test("TC_REPAIR_PERM_002 - ไม่มี Checkbox และ Delete", async ({ page }) => {});
});

test.describe("Repair Service - IT Support", () => {
  test("TC_LOGIN_POS_001", async ({ page }) => {});

  test("TC_REPAIR_PERM_IT_002 - Reject คืนงานได้", async ({ page }) => {});

  test("TC_REPAIR_PERM_IT_003 - แสดงฟอร์มวิธีแก้ไขหลังรับเรื่อง", async ({ page }) => {});

  test("TC_REPAIR_PERM_IT_004 - ส่งต่อ Vendor แล้วยังเห็น Ticket", async ({ page }) => {});

  test("TC_REPAIR_PERM_IT_005 - ปิดเคสแล้วค้นย้อนหลังได้", async ({ page }) => {});
});
