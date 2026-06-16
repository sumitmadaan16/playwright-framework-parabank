import test, { expect } from "@playwright/test";
import { login_user } from "../../utils/login_api";
import { get_accounts } from "../../utils/get_account_api";
import { getData, getUniqueUsername } from "../../utils/dataHelper";
import RegisterUserPage from "../../pages/register.page";
import openNewAccount from "../../pages/open_new_account.page";
import { transfer_funds } from "../../utils/transfer_funds";

const data = getData();
const uniqueUserName = getUniqueUsername(data.user.userName);

let sourceBalanceBefore: number;
let destBalanceBefore: number;
let sourceAccountId: number;
let destAccountId: number;

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

test("TC-E2E-01 API – Account Balance Validation", async ({ request }) => {
    const loginRes = await login_user(request, uniqueUserName, data.user.password);
    const customer_id = loginRes.id;

    // Fetch accounts and capture balances BEFORE transfer
    const accountDataBefore = await get_accounts(request, customer_id);
    const sourceAccount = accountDataBefore[0];
    const destAccount = accountDataBefore[1];

    sourceBalanceBefore = sourceAccount.balance;
    destBalanceBefore = destAccount.balance;
    sourceAccountId = sourceAccount.id;
    destAccountId = destAccount.id;

    // console.log("Source balance before:", sourceBalanceBefore);
    // console.log("Dest balance before:", destBalanceBefore);

    // transfer funds
    const transferAmount = 100;
    await transfer_funds(request, sourceAccountId, destAccountId, transferAmount);

    // Fetching accounts again after transfer
    const accountDataAfter = await get_accounts(request, customer_id);
    const sourceAccountAfter = accountDataAfter.find((acc: any) => acc.id === sourceAccountId);
    const destAccountAfter = accountDataAfter.find((acc: any) => acc.id === destAccountId);

    const sourceBalanceAfter = sourceAccountAfter.balance;
    const destBalanceAfter = destAccountAfter.balance;

    // console.log("Source balance after:", sourceBalanceAfter);
    // console.log("Dist balance after:", destBalanceAfter);

    // Assert source account was debited correctly
    expect(sourceBalanceAfter).toBe(sourceBalanceBefore - transferAmount);
    // Assert destination account was credited correctly
    expect(destBalanceAfter).toBe(destBalanceBefore + transferAmount);
});