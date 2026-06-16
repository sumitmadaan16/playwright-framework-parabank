import test, { expect } from "@playwright/test";
import RegisterUserPage from "../../pages/register.page";
import openNewAccount from "../../pages/open_new_account.page";
import { getData, getUniqueUsername } from "../../utils/dataHelper";
import { login_user } from "../../utils/login_api";
import { get_accounts } from "../../utils/get_account_api";

const data = getData();
const uniqueUserName = getUniqueUsername(data.user.userName);
let newAccountNumber: string;

test.beforeAll("Registration + Account Creation via UI", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Register user via UI
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

    // Open Savings Account via UI
    const openAccount = new openNewAccount(page);
    await openAccount.openSavingsAccount(data.url.registeredUrl);

    await page.screenshot({ path: `screenshots/beforeAll_open_savings_account.png`, fullPage: true });
    // Capture new account number from confirmation screen
    newAccountNumber = await openAccount.getAccountNumber();

    await context.close();
});

test("TC-E2E-02 | Hybrid – UI + API Validation", async ({ request }) => {
    // Login via API
    const loginRes = await login_user(request, uniqueUserName, data.user.password);
    const customer_id = loginRes.id;

    // Fetch accounts via API using get_accounts helper
    const accountData = await get_accounts(request, customer_id);
    // console.log(accountData);

    //Locate the new account in the list
    const found = accountData.find(acc => acc.id === Number(newAccountNumber));
    expect(found).toBeDefined();
    // Fetch individual account details using get_accounts helper again
    const refreshedAccounts = await get_accounts(request, customer_id);
    const accountJson = refreshedAccounts.find(acc => acc.id === Number(newAccountNumber));
    // Assert account type is SAVINGS
    expect(accountJson?.type).toBe("SAVINGS");
    // Assert balance is non-negative
    expect(accountJson?.balance).toBeGreaterThanOrEqual(0);
    // Logs for clarity
    console.log("Validated Account:", accountJson);
});
