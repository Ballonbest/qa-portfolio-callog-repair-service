import { test, expect } from "@playwright/test";

test.describe("Repair Service - Helpdesk", () => {
  test("TC_REPAIR_PERM_001 - ไม่มีปุ่มรับเรื่องและแก้ไข", async ({ page }) => {
    // Step 1: เปิดหน้า Repair Service

    // Step 2: เปิด Ticket 1 รายการ

    // Step 3: ตรวจสอบ Permission
    await expect(page.getByRole("button", { name: "รับเรื่อง" })).toHaveCount(0);

    // TODO: เพิ่มปุ่มแก้ไข หลังจากรู้ชื่อ/Locator จริง
  });

  test("TC_REPAIR_UI_001 - Export ทำงานได้", async ({ page }) => {
    // Step 1: อยู่หน้า Repair Service

    // Step 2: กด Export
    const downloadPromise = page.waitForEvent("download");

    await page.getByRole("button", { name: /export/i }).click();

    const download = await downloadPromise;

    // Expected Result:
    // ต้อง Download Excel ได้
    expect(download.suggestedFilename()).toMatch(/\.(xlsx|xls)$/i);
  });

  test("TC_REPAIR_PERM_002 - ไม่มี Checkbox และ Delete", async ({ page }) => {
    // Expected Result:
    // Helpdesk ไม่มี Delete
    await expect(page.getByRole("button", { name: /delete|ลบ/i })).toHaveCount(0);

    // TODO:
    // เช็ก checkbox หลังจากดู DOM จริงของตาราง
  });
});

// ======================================================
// Repair Service - IT Support
// ======================================================

test.describe("Repair Service - IT Support", () => {
  test("TC_REPAIR_PERM_IT_001 - รับเคสได้", async ({ page }) => {
    // Precondition:
    // มี Ticket สถานะ "รอรับเรื่อง"

    // Step 1: เปิด Ticket

    // Step 2: กดรับเรื่อง
    await page.getByRole("button", { name: "รับเรื่อง" }).click();

    // Expected Result:
    await expect(page.getByText("กำลังดำเนินการ")).toBeVisible();

    await expect(page.getByRole("button", { name: /reject/i })).toBeVisible();
  });

  test("TC_REPAIR_PERM_IT_002 - Reject คืนงานได้", async ({ page }) => {
    // Precondition:
    // Ticket อยู่สถานะ "กำลังดำเนินการ"

    // Step: กด Reject
    await page.getByRole("button", { name: /reject/i }).click();

    // Expected Result:
    await expect(page.getByText("คืนงาน")).toBeVisible();
  });

  test("TC_REPAIR_PERM_IT_003 - แสดงฟอร์มวิธีแก้ไขหลังรับเรื่อง", async ({ page }) => {
    // Expected Result:
    // มีช่องวิธีแก้ไข
    await expect(page.getByLabel(/วิธีแก้ไข/i)).toBeVisible();

    // มีปุ่มบันทึก
    await expect(page.getByRole("button", { name: "บันทึก" })).toBeVisible();

    // มีปุ่มส่งต่อ Vendor
    await expect(page.getByRole("button", { name: /ส่งต่อ vendor/i })).toBeVisible();

    // TODO:
    // ตรวจชื่อผู้รับเคส
    // ตรวจข้อมูลฝั่งซ้ายว่า Read-only
  });

  test("TC_REPAIR_PERM_IT_004 - ส่งต่อ Vendor แล้วยังเห็น Ticket", async ({ page }) => {
    // เก็บ Ticket No. ก่อนส่ง Vendor
    const ticketNo = "TODO_TICKET_NO";

    // Step: ส่งต่อ Vendor
    await page.getByRole("button", { name: /ส่งต่อ vendor/i }).click();

    // Expected Result:
    // Ticket ยังต้องหาเจอใน IT Support
    await expect(page.getByText(ticketNo)).toBeVisible();
  });

  test("TC_REPAIR_PERM_IT_005 - ปิดเคสแล้วค้นย้อนหลังได้", async ({ page }) => {
    const ticketNo = "TODO_TICKET_NO";

    // Step 1: กดบันทึก
    await page.getByRole("button", { name: "บันทึก" }).click();

    // Expected Result 1:
    // Ticket หายจากรายการหลัก
    await expect(page.getByText(ticketNo)).toHaveCount(0);

    // Step 2:
    // TODO: ใช้ Filter ค้นหา ticketNo

    // Expected Result 2:
    // TODO:
    // await expect(page.getByText(ticketNo)).toBeVisible();
  });
});
