import test, { expect } from "@playwright/test";
import { login_user } from "../../utils/login_api";
import { get_accounts } from "../../utils/get_account_api";
import { getData, getUniqueUsername } from "../../utils/dataHelper";
import RegisterUserPage from "../../pages/register.page";
import openNewAccount from "../../pages/open_new_account.page";

const data = getData();
const uniqueUserName = getUniqueUsername(data.user.userName);

test.beforeAll("registration Logic", async ({ browser }) => {
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

    const openAccount = new openNewAccount(page);
    await openAccount.openSavingsAccount(data.url.registeredUrl);

    await context.close();
});

test("TC-API-04 | API – Account Details", async ({ request }) => {
    // Login
    const loginRes = await login_user(request, uniqueUserName, data.user.password);
    const customer_id = loginRes.id;
    // Get all accounts
    const accountData = await get_accounts(request, customer_id);
    //Pick the last account
    const lastAccount = accountData.at(-1); // modern JS shortcut for last element

    // Assert status and balance field
    expect(lastAccount).toHaveProperty("balance");
    expect(typeof lastAccount.balance).toBe("number");
    expect(lastAccount.balance).toBeGreaterThanOrEqual(0);
});
