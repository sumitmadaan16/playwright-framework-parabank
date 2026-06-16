import {expect, test} from "@playwright/test";
import {get_account_by_id} from "../../utils/get_account_api";

test('Non-existent account ID - TC-NEG-05', async ({ request }) => {
    const AccId = 9999999999; // non existent fake id
    const account = await get_account_by_id(request, AccId, 404); //using utility function to fetch account response
    expect(account.status).toBe(404);
    // console.log(account.status)
});
