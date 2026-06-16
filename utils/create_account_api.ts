import {expect} from "@playwright/test";

export async function createAccounts(request: any, c_id: number, accType: number, fromAccountId: number) {
    const accountCreatedResponse = await request.post(`https://parabank.parasoft.com/parabank/services/bank/createAccount`,
        {
            headers: { Accept: "application/json" },
            params: {
                customerId: c_id,
                newAccountType: accType,
                fromAccountId: fromAccountId,
            },
        }
    );
    expect(accountCreatedResponse.status()).toBe(200);
    return await accountCreatedResponse.json();
}
