import test, { expect } from "@playwright/test";
import { login_user } from "../../utils/login_api";
import { get_accounts } from "../../utils/get_account_api";
import { getData, getUniqueUsername } from "../../utils/dataHelper";
import RegisterUserPage from "../../pages/register.page";
import openNewAccount from "../../pages/open_new_account.page";
import {transfer_funds} from "../../utils/transfer_funds";

const data = getData();
const uniqueUserName = getUniqueUsername(data.user.userName);
let sourceBalance :number
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

test.fail("TC-NEG-01 fund Transfer", async ({ request }) => {
    // Login
    const loginRes = await login_user(request, uniqueUserName, data.user.password);
    const customer_id = loginRes.id;

    // source account balance
    const accountData = await get_accounts(request, customer_id);
    const sourceAccount = accountData[0];
    const destAccount = accountData[1];
    sourceBalance = sourceAccount.balance;

    const sourceAccountId = sourceAccount.id;
    const destAccountId = destAccount.id;

    const transferAmount = 100000; // amt significantly larger than balance
    const response = await transfer_funds(request, sourceAccountId, destAccountId, transferAmount);

    // asserting that API should not succeed
    expect(response).not.toBeNull();
    expect(response).not.toHaveProperty("success");
    expect(response.message || response).toContain("Insufficient funds");
});
