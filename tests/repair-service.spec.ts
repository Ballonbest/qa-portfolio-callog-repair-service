import { test, expect } from "@playwright/test";

const UrlRepairService = "https://samart-calllog.netserviceth.com/admin/d0w4suxz4qa";
const locatorEmail = "Username/Email";
const locatorPassword = "Password";

const userHelpdesk = process.env.HELPDESK_USER;
const passHelpdesk = process.env.HELPDESK_PASSWORD;
const userItsupport = process.env.IT_SUPPORT_USER;
const passItsupport = process.env.IT_SUPPORT_PASSWORD;

test.describe("Repair Service - Helpdesk", () => {
  test.beforeEach("gotoUrl", async ({ page }) => {
    await page.goto(UrlRepairService);

    await page.getByPlaceholder(locatorEmail).fill(userHelpdesk!);
    await page.getByPlaceholder(locatorPassword).fill(passHelpdesk!);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/admin\//);
  });

  test("TC_REPAIR_PERM_001", async ({ page }) => {
    await page.getByText("X20260915132750", { exact: true }).click();

    const ticketDetail = page.getByRole("dialog");

    await expect(ticketDetail).toBeVisible();
    await expect(ticketDetail.getByText("รายละเอียด Ticket")).toBeVisible();

    await expect(page.getByText(/Unauthenticated/i)).toHaveCount(0);

    await expect(ticketDetail.getByRole("button", { name: "รับเรื่อง" })).toHaveCount(0);
  });

  test("TC_REPAIR_UI_001", async ({ page }) => {
    await page.getByRole("button", { name: "Export" }).click();

    const exportDialog = page.getByRole("dialog");

    await expect(exportDialog).toBeVisible();

    const downloadPromise = page.waitForEvent("download");

    await exportDialog.getByRole("button", { name: "Start export" }).click();

    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.xlsx$/);
  });

  test("TC_REPAIR_PERM_002", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Delete" })).not.toBeVisible();
  });
});

test.describe("Repair Service - IT Support", () => {
  test.beforeEach("gotoUrl", async ({ page }) => {
    await page.goto(UrlRepairService);

    await page.getByPlaceholder(locatorEmail).fill(userItsupport!);
    await page.getByPlaceholder(locatorPassword).fill(passItsupport!);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/admin\//);
  });

  test("TC_REPAIR_PERM_IT_001", async ({ page }) => {
    await page.getByText("X20260915132750", { exact: true }).click();

    const ticketDialog = page.getByRole("dialog");

    await expect(ticketDialog).toBeVisible();
    await expect(ticketDialog.getByText("X20260915132750")).toBeVisible();
    await expect(ticketDialog.getByRole("button", { name: "รับเรื่อง" })).toBeVisible();
  });

  test("TC_REPAIR_PERM_IT_002", async ({ page }) => {
    await page.getByText("X20260915132750", { exact: true }).click();

    const ticketDialog = page.getByRole("dialog");

    await ticketDialog.getByRole("button", { name: "รับเรื่อง" }).click();

    await page.getByText("X20260915132750", { exact: true }).click();
    await expect(ticketDialog.getByText("กำลังดำเนินการ")).toBeVisible();
    await ticketDialog.getByRole("button", { name: "Reject" }).click();

    await page.getByText("X20260915132750", { exact: true }).click();
    await expect(ticketDialog.getByText("คืนงาน")).toBeVisible();
  });
});
