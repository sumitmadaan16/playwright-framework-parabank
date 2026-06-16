import test from "@playwright/test";
import RegisterUserPage from "../../pages/register.page";
import {getData, getData_api, getUniqueUsername, saveResults} from "../../utils/dataHelper";
import {login_user} from "../../utils/login_api";
import {get_accounts} from "../../utils/get_account_api";
import {createAccounts} from "../../utils/create_account_api";

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
    await context.close();
});

test("TC-API-01 Get all accounts", async ({ request }) => {
    const loginRes = await login_user(request, uniqueUserName, data.user.password);
    // console.log(loginRes);
    let results: any = {
        logged_in_user: loginRes,
        opened_accounts: [],
        all_accounts: []
    };
    saveResults(results);

    let data_api = getData_api();
    const customer_id = data_api.logged_in_user.id;
    // console.log(customer_id)
    const accountData = await get_accounts(request, customer_id);
    // console.log(accountData)
    const accId = accountData[0].id;
    // console.log(accId)

    const accTypeAll = [0, 1, 2]; // Checking, Savings, Loan
    for (const accType of accTypeAll) {
        const response = await createAccounts(request, customer_id, accType, accId);
        results.opened_accounts.push(response);
        saveResults(results);
    }

    results.all_accounts = await get_accounts(request, customer_id);
    saveResults(results);
});
