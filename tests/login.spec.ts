import { test, expect } from "@playwright/test";

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

test("TC_LOGIN_POS_001", async ({ page }) => {
  await page.getByPlaceholder(locatorEmail).fill(userHelpdesk);
  await page.getByPlaceholder(locatorPassword).fill(passHelpdesk);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/admin\/d0w4suxz4qa$/)
  await expect(page).toHaveTitle("🖨 Repair Service");
});

test("TC_LOGIN_NEG_001", async ({ page }) => {
  await page.getByPlaceholder(locatorEmail).fill("invalidUser");
  await page.getByPlaceholder(locatorPassword).fill("invalid123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByText("The username/email or password is incorrect, please re-enter")).toBeVisible();
  await expect(page.getByText("Customer Service")).toBeVisible();
  await expect(page).toHaveURL(goto_CustomerService);
});

test("TC_LOGIN_UI_001", async ({ page }) => {
  const toggleHide = page.getByRole("img", { name: "eye-invisible" });
  const toggleEye = page.getByRole("img", { name: "eye" });
  const passwordInput = page.getByPlaceholder(locatorPassword);

  await passwordInput.fill("Ddol01234#");
  await expect(passwordInput).toHaveAttribute("type", "password");

  await toggleHide.click();
  await expect(passwordInput).toHaveAttribute("type", "text");

  await toggleEye.click();
  await expect(passwordInput).toHaveAttribute("type", "password");
});

test("TC_LOGIN_SEC_001 - backend rejects SQL injection", async ({ request }) => {
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
