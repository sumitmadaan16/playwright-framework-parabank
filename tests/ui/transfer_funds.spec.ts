import {expect, test} from '@playwright/test';
import RegisterUserPage from "../../pages/register.page";
import openNewAccountPage from "../../pages/open_new_account.page";
import loginUserPage from "../../pages/login.page";
import fundTransferPage from "../../pages/fund_transfer.page";
import { getData, getUniqueUsername } from "../../utils/dataHelper";

// Static config loaded once for this file
const data = getData();
const uniqueUserName = getUniqueUsername(data.user.userName);

test.describe("Transfer Funds Flow", () => {
    let checkingAccNumber: string;
    let savingsAccNumber: string;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        const regObj = new RegisterUserPage(page);
        await regObj.registerUser(
            data.url.baseUrl,
            uniqueUserName,
            data.user.firstName,
            data.user.lastName,
            data.user.address,
            data.user.city,
            data.user.state,
            data.user.zipCode,
            data.user.phoneNo,
            data.user.ssn,
            data.user.password
        );

        // open both accounts in the same session
        const accPage = new openNewAccountPage(page);
        await accPage.openCheckingAccount(data.url.baseUrl);
        checkingAccNumber = await accPage.getAccountNumber();
        await accPage.openSavingsAccount(data.url.baseUrl);
        savingsAccNumber = await accPage.getAccountNumber();

        await context.close();
    });

    test('Transfer Funds - TC-UI-04', async ({ page }) => {
        const loginUser = new loginUserPage(page);
        await loginUser.loginUser(data.url.baseUrl, uniqueUserName, data.user.password);

        const transferPage = new fundTransferPage(page);
        const transferredAmount = await transferPage.transferFundsAToB(
            data.url.baseUrl,
            "100",
            checkingAccNumber,
            savingsAccNumber
        );
        console.log(`Transferred ${transferredAmount} from ${checkingAccNumber} to ${savingsAccNumber}`);
    });

    test('Transfer Funds - TC-NEG-02 | Reject zero/negative amount', async ({ page }) => {
        const loginUser = new loginUserPage(page);
        await loginUser.loginUser(data.url.baseUrl, uniqueUserName, data.user.password);

        const transferPage = new fundTransferPage(page);
        // Zero amount
        await transferPage.transferFundsAToB(data.url.baseUrl, "0", checkingAccNumber,savingsAccNumber);
        // Asserting and screenshot
        await page.screenshot({ path: `screenshots/zero_funds_transferred.png`, fullPage: true })
        await expect(transferPage.transferComplete).toBeVisible();
        // Negative amount
        await transferPage.transferFundsAToB(data.url.baseUrl, "-50",checkingAccNumber,savingsAccNumber);
        await page.screenshot({ path: `screenshots/negative_funds_transferred.png`, fullPage: true })
        await expect(transferPage.transferComplete).toBeVisible();
    });

    test('Transfer Funds - TC-NEG-03 | Same account transfer still succeeds', async ({ page }) => {
        const loginUser = new loginUserPage(page);
        await loginUser.loginUser(data.url.baseUrl, uniqueUserName, data.user.password);
        const transferPage = new fundTransferPage(page);
        // transfer with same account for both From and To
        const sameAccTransfer = await transferPage.transferFundsAToB(data.url.baseUrl, "100", checkingAccNumber, checkingAccNumber);// valid amount // same acc. for both
        await expect(transferPage.transferComplete).toBeVisible();
        await page.screenshot({ path: `screenshots/same_account_funds_transferred.png`, fullPage: true })
        console.log(`Transfer from account ${checkingAccNumber} to itself. Amount: ${sameAccTransfer}`);
    });

    test('Transfer Funds - TC-NEG-07 | Blank amount shows', async ({ page }) => {
        const loginUser = new loginUserPage(page);
        await loginUser.loginUser(data.url.baseUrl, uniqueUserName, data.user.password);
        const transferPage = new fundTransferPage(page);
        // Navigate to Transfer Funds page
        await page.goto(data.url.baseUrl);
        await page.waitForLoadState('networkidle');
        await transferPage.transferFundsBTN.click();
        // Leave amount field empty
        await transferPage.amountTF.fill(""); // blank
        await transferPage.fromAccount.selectOption(checkingAccNumber);
        await transferPage.toAccount.selectOption(savingsAccNumber);
        // Click Transfer
        await transferPage.transferBTN.click();
        // error message is visible
        await expect(transferPage.errorMsg).toBeVisible({ timeout: 5000 });
        await expect(transferPage.errorMsg).toHaveText(" An internal error has occurred and has been logged. ");
        // Screenshot final state
        await page.screenshot({path: `screenshots/fund_transfer_blank_amount.png`, fullPage: true});
    });


});

