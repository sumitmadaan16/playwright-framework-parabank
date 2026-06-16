import {expect, test} from '@playwright/test';
import RegisterUserPage from "../../pages/register.page";
import loginUserPage from "../../pages/login.page";
import openNewAccountPage from "../../pages/open_new_account.page";
import { getData, getUniqueUsername } from "../../utils/dataHelper";

const data = getData();
const uniqueUserName = getUniqueUsername(data.user.userName);

test.describe("Open Checking Account Flow", () => {

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

        await context.close();
    });

    test('Opening Checking Account - TC-UI-02', async ({ page }) => {
        const loginUser = new loginUserPage(page);
        await loginUser.loginUser(data.url.baseUrl, uniqueUserName, data.user.password);

        const checkingAcc = new openNewAccountPage(page);
        await checkingAcc.openCheckingAccount(data.url.baseUrl);

        const accNumber = await checkingAcc.getAccountNumber();
        expect(accNumber).toMatch(/^\d+$/);
        // console.log(`Checking account created: ${accNumber}`);

        await page.screenshot({ path: `screenshots/opening_checking_account.png`, fullPage: true });
    });

});