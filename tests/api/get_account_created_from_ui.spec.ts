import test, { expect } from "@playwright/test";
import RegisterUserPage from "../../pages/register.page";
import {getData, getUniqueUsername} from "../../utils/dataHelper";
import {get_accounts} from "../../utils/get_account_api";
import openNewAccount from "../../pages/open_new_account.page";
import {login_user} from "../../utils/login_api";

const data = getData();
const uniqueUserName = getUniqueUsername(data.user.userName);
let newAccountNumber : any

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

    // const loginObj : loginUserPage = new loginUserPage(page)
    // await loginObj.loginUser(data.url.baseUrl, uniqueUserName, data.user.password)

    const openAccount: openNewAccount = new openNewAccount(page)
    await openAccount.openSavingsAccount(data.url.registeredUrl)

    newAccountNumber = await openAccount.getAccountNumber()
    // console.log(newAccountNumber)
    await context.close();
});

test("TC-API-02 get account created from UI", async ({ request }) => {
    const loginRes = await login_user(request, uniqueUserName, data.user.password);
    const customer_id = loginRes.id

    const accountData = await get_accounts(request, customer_id);
    // console.log(accountData)
    const len = accountData.length
    const accId = accountData[len-1].id;
    expect(Number(newAccountNumber)).toBe(accId);
});
