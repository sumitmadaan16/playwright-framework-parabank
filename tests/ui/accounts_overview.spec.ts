import { test } from "@playwright/test";
import RegisterUserPage from "../../pages/register.page";
import loginUserPage from "../../pages/login.page";
import openNewAccountPage from "../../pages/open_new_account.page";
import accountOverviewPage from "../../pages/account_overview.page";
import { getData, getUniqueUsername } from "../../utils/dataHelper";

// Static config loaded once for this file
const data = getData();

// Unique username scoped to this file — generated once at module load
const uniqueUserName = getUniqueUsername(data.user.userName);

test.describe("Account Creation Flow", () => {
    // serial mode: TC-UI-02 sets savingsAccNumber, TC-UI-03 sets checkingAccNumber,
    // TC-UI-04 reads both — must run in order in the same worker
    test.describe.configure({ mode: 'serial' });

    let savingsAccNumber: string;
    let checkingAccNumber: string;

    test.beforeAll("registration logic",async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        // Registration on ParaBank auto-logs in — no separate loginUser needed as we are using browser fixture
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

        await context.close();
    });

    test("Opening Savings Account - TC-UI-01", async ({ page }) => {
        const loginUser = new loginUserPage(page);
        await loginUser.loginUser(data.url.baseUrl, uniqueUserName, data.user.password);

        const savingAcc = new openNewAccountPage(page);
        await savingAcc.openSavingsAccount(data.url.baseUrl);

        savingsAccNumber = await savingAcc.getAccountNumber();
        await page.screenshot({ path: `screenshots/open_savings_account.png`, fullPage: true });

        // console.log(`${savingsAccNumber}`);
    });

    test("Opening Checking Account - TC-UI-02", async ({ page }) => {
        const loginUser = new loginUserPage(page);
        await loginUser.loginUser(data.url.baseUrl, uniqueUserName, data.user.password);

        const checkingAcc = new openNewAccountPage(page);
        await checkingAcc.openCheckingAccount(data.url.baseUrl);

        checkingAccNumber = await checkingAcc.getAccountNumber();
        await page.screenshot({ path: `screenshots/open_checking_account.png`, fullPage: true });

        // console.log(`${checkingAccNumber}`);
    });

    test('Account Overview - TC-UI-04', async ({ page }) => {
        const loginUser = new loginUserPage(page);
        await loginUser.loginUser(data.url.baseUrl, uniqueUserName, data.user.password);

        const overviewPage = new accountOverviewPage(page);
        await overviewPage.verifyAccountNumberExists(savingsAccNumber, checkingAccNumber);
        await page.screenshot({ path: `screenshots/account_overview_table.png`, fullPage: true });

    });

});