import {APIRequest, expect} from "@playwright/test";
import path = require("node:path");
// @ts-ignore
import fs from "node:fs";

export async function get_accounts(request:any, c_id:number){
    const accountDetailsDataPath=path.join(__dirname, '../test-data/accounts_details_api.json')
    const customerAccountResponse=await request.get(`https://parabank.parasoft.com/parabank/services/bank/customers/${c_id}/accounts`, {
        headers: {Accept:'application/json'}
    })
    expect(customerAccountResponse.status()).toBe(200)
    let accounts=await customerAccountResponse.json()
    fs.writeFileSync(accountDetailsDataPath, JSON.stringify(accounts, null, 2), 'utf-8')
    return accounts
}

export async function get_account_by_id(request: any, account_id: number, expectedStatus: number = 200) {
    const accountDataPath = path.join(__dirname, '../test-data/account_by_id_api.json')
    const accountResponse = await request.get(
        `https://parabank.parasoft.com/parabank/services/bank/accounts/${account_id}`,
        {
            headers: { Accept: 'application/json' }
        }
    )
    expect(accountResponse.status()).toBe(expectedStatus)
    const contentType = accountResponse.headers()['content-type'] ?? ''
    let body: any
    if (contentType.includes('application/json')) {
        body = await accountResponse.json()
        if (expectedStatus === 200) {
            fs.writeFileSync(accountDataPath, JSON.stringify(body, null, 2), 'utf-8')
        }
    } else {
        body = await accountResponse.text()
    }
    return {
        status: accountResponse.status(),
        headers: accountResponse.headers(),
        body
    }
}

export async function get_customer_accounts(request: any, customer_id: number, expectedStatus: number = 200) {
    const customerAccountsDataPath = path.join(__dirname, '../test-data/customer_accounts_api.json')
    const customerAccountsResponse = await request.get(`https://parabank.parasoft.com/parabank/services/bank/customers/${customer_id}/accounts`,
        {
            headers: { Accept: 'application/json' }
        }
    )
    expect(customerAccountsResponse.status()).toBe(expectedStatus)
    const contentType = customerAccountsResponse.headers()['content-type'] ?? ''
    let body: any
    if (contentType.includes('application/json')) {
        body = await customerAccountsResponse.json()
        if (expectedStatus === 200) {
            fs.writeFileSync(customerAccountsDataPath, JSON.stringify(body, null, 2), 'utf-8')
        }
    } else {
        body = await customerAccountsResponse.text()
    }
    return {
        status: customerAccountsResponse.status(),
        headers: customerAccountsResponse.headers(),
        body
    }
}