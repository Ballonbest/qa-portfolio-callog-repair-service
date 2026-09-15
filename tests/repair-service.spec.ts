import { test, expect } from "@playwright/test";
import { escape } from "querystring";

let goto_CustomerService = "https://samart-calllog.netserviceth.com/signin?redirect=/admin";
const locatorEmail = "Username/Email";
const locatorPassword = "Password";

const userHelpdesk = process.env.HELPDESK_USER;
const passHelpdesk = process.env.HELPDESK_PASSWORD;
const userItsupport = process.env.IT_SUPPORT_USER;
const passItsupport = process.env.IT_SUPPORT_PASSWORD;

if (!userHelpdesk || !passHelpdesk || !userItsupport || !passItsupport) {
  throw new Error("Missing in .env");
}

test.beforeEach(async ({ page }) => {
  await page.goto(goto_CustomerService);
});

test.describe("Repair Service - Helpdesk", () => {
  test("TC_LOGIN_POS_001 - Helpdesk Login สำเร็จ", async ({ page }) => {
    await page.getByPlaceholder(locatorEmail).fill(userHelpdesk);
    await page.getByPlaceholder(locatorPassword).fill(passHelpdesk);

    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/admin\/d0w4suxz4qa$/);
    await expect(page).toHaveTitle(/Repair Service/i);

    await expect(page.getByRole("link", { name: /Create Ticket/i })).toBeVisible();
  });

  test("TC_LOGIN_NEG_001 - Helpdesk Login ไม่สำเร็จ", async ({ page }) => {
    await page.getByPlaceholder(locatorEmail).fill("invalidUser");
    await page.getByPlaceholder(locatorPassword).fill("invalid123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("The username/email or password is incorrect, please re-enter")).toBeVisible();
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole("heading", { name: "Customer Service" })).toBeVisible();
  });

  test("TC_LOGIN_NEG_002 - Helpdesk Password ไม่ถูกต้อง", async ({ page }) => {
    await page.getByPlaceholder(locatorEmail).fill(userHelpdesk);
    await page.getByPlaceholder(locatorPassword).fill("invalid123");
    await page.getByRole("button", { name: "Sign in" }).click();

    const errorMessage = page.locator(".ant-notification-notice-message");

    await expect(errorMessage).toContainText("The username/email or password is incorrect, please re-enter");
    await expect(page).toHaveURL(/\/signin/);
    await expect(page.getByRole("heading", { name: "Customer Service" })).toBeVisible();
  });

  test("TC_LOGIN_UI_001 - ปุ่มโชว์/ซ่อนรหัสผ่านทำงานถูกต้อง", async ({ page }) => {
    const toggleHide = page.getByRole("img", { name: "eye-invisible" });
    const toggleEye = page.getByRole("img", { name: "eye" });
    const passwordInput = page.getByPlaceholder(locatorPassword);

    await passwordInput.fill(passHelpdesk);
    await expect(passwordInput).toHaveAttribute("type", "password");

    await toggleHide.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await toggleEye.click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("TC_LOGIN_SEC_001 - ป้องกัน SQL Injection ในช่อง Username", async ({ request }) => {
    const response = await request.post("https://samart-calllog.netserviceth.com/<LOGIN_API>", {
      data: {
        username: "' OR '1'='1",
        password: "anything",
      },
    });

    expect(response.status()).toBeLessThan(500);
    expect(response.status()).not.toBe(401);

    const body = await response.text();

    expect(body).not.toMatch(/sql syntax|database error|stack trace|internal server error/i);
  });
});

test.describe("Repair Service - IT Support", () => {
  test("TC_LOGIN_POS_001 - IT Support Login สำเร็จ", async ({ page }) => {
    await page.getByPlaceholder(locatorEmail).fill(userItsupport);
    await page.getByPlaceholder(locatorPassword).fill(passItsupport);

    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/admin\/d0w4suxz4qa$/);
    await expect(page).toHaveTitle(/Repair Service/i);
  });

  test("TC_LOGIN_NEG_001 - IT Support ไม่สำเร็จ", async ({ page }) => {
    await page.getByPlaceholder(locatorEmail).fill("invalidUser");
    await page.getByPlaceholder(locatorPassword).fill("invalid123");

    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole("heading", { name: "Customer Service" })).toBeVisible();
  });

  test("TC_LOGIN_NEG_002 - IT Support Password ไม่ถูกต้อง", async ({ page }) => {
    await page.getByPlaceholder(locatorEmail).fill(userItsupport);
    await page.getByPlaceholder(locatorPassword).fill("invalid123");

    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/admin/);
    await expect(page.getByRole("heading", { name: "Customer Service" })).toBeVisible();
  });

  test("TC_LOGIN_UI_001 - ปุ่มโชว์/ซ่อนรหัสผ่านทำงานถูกต้อง", async ({ page }) => {
    const toggleHide = page.getByRole("img", { name: "eye-invisible" });
    const toggleEye = page.getByRole("img", { name: "eye" });
    const passwordInput = page.getByPlaceholder(locatorPassword);

    await passwordInput.fill(passHelpdesk);
    await expect(passwordInput).toHaveAttribute("type", "password");

    await toggleHide.click();
    await expect(passwordInput).toHaveAttribute("type", "text");

    await toggleEye.click();
    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("TC_LOGIN_SEC_001 - ป้องกัน SQL Injection ในช่อง Username", async ({ request }) => {
    const response = await request.post("https://samart-calllog.netserviceth.com/<LOGIN_API>", {
      data: {
        username: "' OR '1'='1",
        password: "anything",
      },
    });

    expect(response.status()).toBeLessThan(500);
    expect(response.status()).not.toBe(401);

    const body = await response.text();

    expect(body).not.toMatch(/sql syntax|database error|stack trace|internal server error/i);
  });
});
