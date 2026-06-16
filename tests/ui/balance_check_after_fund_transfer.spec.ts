import { test, expect } from '@playwright/test';
import RegisterUserPage from "../../pages/register.page";
import loginUserPage from "../../pages/login.page";
import openNewAccountPage from "../../pages/open_new_account.page";
import fundTransferPage from "../../pages/fund_transfer.page";
import accountOverviewPage from "../../pages/account_overview.page";
import { getData, getUniqueUsername } from "../../utils/dataHelper";

// Static config loaded once for this file
const data = getData();
// Unique username scoped to this file
const uniqueUserName = getUniqueUsername(data.user.userName);

const transferAmt = "100";

test.describe("Balance Check After Fund Transfer Flow", () => {
    test.describe.configure({ mode: 'serial' });
    let checkingAccNumber: string;
    let savingsAccNumber: string;
    let initialBalanceChecking: number;
    let initialBalanceSavings: number;

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

        const accPage = new openNewAccountPage(page);
        await accPage.openCheckingAccount(data.url.baseUrl);
        checkingAccNumber = await accPage.getAccountNumber();

        await accPage.openSavingsAccount(data.url.baseUrl);
        savingsAccNumber = await accPage.getAccountNumber();

        // Capture balances before any transfer
        const overviewPage = new accountOverviewPage(page);
        const balancesBefore = await overviewPage.balanceCheck(
            data.url.baseUrl,
            checkingAccNumber,
            savingsAccNumber
        );
        await page.screenshot({ path: `screenshots/balance_check_before.png`, fullPage: true });
        initialBalanceChecking = balancesBefore.balanceA;
        initialBalanceSavings = balancesBefore.balanceB;

        await context.close();
    });

    test('Transfer Funds before balance check - TC-UI-04', async ({ page }) => {
        const loginUser = new loginUserPage(page);
        await loginUser.loginUser(data.url.baseUrl, uniqueUserName, data.user.password);

        const transferPage = new fundTransferPage(page);
        const transferredAmount = await transferPage.transferFundsAToB(
            data.url.baseUrl,
            transferAmt,
            checkingAccNumber,
            savingsAccNumber
        );
        await page.screenshot({ path: `screenshots/transferFunds.png`, fullPage: true });
        expect(transferredAmount).toContain(transferAmt);

    });

    test('Balance Check After Fund Transfer - TC-UI-06', async ({ page }) => {
        const loginUser = new loginUserPage(page);
        await loginUser.loginUser(data.url.baseUrl, uniqueUserName, data.user.password);

        const overviewPage = new accountOverviewPage(page);
        const { balanceA, balanceB } = await overviewPage.balanceCheck(
            data.url.baseUrl,
            checkingAccNumber,
            savingsAccNumber
        );
        await page.screenshot({ path: `screenshots/balance_check_after.png`, fullPage: true });
        expect(balanceA).toBeCloseTo(initialBalanceChecking - Number(transferAmt), 2);
        expect(balanceB).toBeCloseTo(initialBalanceSavings + Number(transferAmt), 2);
    });

});