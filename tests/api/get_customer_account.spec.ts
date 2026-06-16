import { test, expect } from '@playwright/test'
import { get_customer_accounts } from '../../utils/get_account_api'

const c_id = 10000

test('TC-NEG-06 non-existent customer ID', async ({ request }) => {
    const result = await get_customer_accounts(request, c_id, 400)
    // status should be 400 , if no customer account is present
    expect(result.status).toBe(400)
    // Plain text error response
    expect(result.body.toLowerCase()).toContain(`could not find customer #${c_id}`)
    // console.log('result:', result.body)
})