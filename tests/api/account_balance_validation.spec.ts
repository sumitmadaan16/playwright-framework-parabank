import test, { expect } from "@playwright/test";
import { login_user } from "../../utils/login_api";
import { get_accounts } from "../../utils/get_account_api";
import { getData, getUniqueUsername } from "../../utils/dataHelper";
import RegisterUserPage from "../../pages/register.page";
import openNewAccount from "../../pages/open_new_account.page";

const data = getData();
const uniqueUserName = getUniqueUsername(data.user.userName);

// Shared variables at file scope
let sourceBalanceBefore: number;
let destBalanceBefore: number;

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

test("TC-API-05 | API – Account Balance Validation", async ({ request }) => {
    const loginRes = await login_user(request, uniqueUserName, data.user.password);
    const customer_id = loginRes.id;
    const accountData = await get_accounts(request, customer_id);
    // console.log(accountData);
    // assume first two accounts are source and destination
    const sourceAccount = accountData[0];
    const destAccount = accountData[1];
    //Store balances
    sourceBalanceBefore = sourceAccount.balance;
    destBalanceBefore = destAccount.balance;
    // Asserting both balances are numeric
    expect(typeof sourceBalanceBefore).toBe("number");
    expect(typeof destBalanceBefore).toBe("number");
    // Assert both balances are non-negative
    expect(sourceBalanceBefore).toBeGreaterThanOrEqual(0);
    expect(destBalanceBefore).toBeGreaterThanOrEqual(0);

    // console.log("Source balance before:", sourceBalanceBefore);
    // console.log("Destination balance before:", destBalanceBefore);
});
