import { test, expect } from '@playwright/test';
import RegisterUserPage from "../../pages/register.page";
import loginUserPage from "../../pages/login.page";
import openNewAccountPage from "../../pages/open_new_account.page";
import requestLoanPage from "../../pages/request_loan.page";
import { getData, getUniqueUsername } from "../../utils/dataHelper";

const data = getData();
const uniqueUserName = getUniqueUsername(data.user.userName);

test.describe("Request Loan Flow", () => {
    let checkingAccNumber: string;

    test.beforeAll(async ({ browser }) => {
        // console.log(`${uniqueUserName}`);
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
        // Open a checking account to use as the loan source
        const accPage = new openNewAccountPage(page);
        await accPage.openCheckingAccount(data.url.baseUrl);
        checkingAccNumber = await accPage.getAccountNumber();
        // console.log(`${checkingAccNumber}`);
        await context.close();
    });

    test('Request Loan - TC-UI-06', async ({ page }) => {
        const loginUser = new loginUserPage(page);
        await loginUser.loginUser(data.url.baseUrl, uniqueUserName, data.user.password);
        const loanPage = new requestLoanPage(page);
        await loanPage.requestingLoan(data.url.baseUrl, checkingAccNumber);

        await page.screenshot({ path: `screenshots/loan_request.png`, fullPage: true });
    });

});