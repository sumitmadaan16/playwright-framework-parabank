// @ts-ignore
import {expect} from "@playwright/test";

export async function login_user(request:any, username:string, password:string){
    const res:any=await request.get(`https://parabank.parasoft.com/parabank/services/bank/login/${username}/${password}`, {
        headers: { Accept: 'application/json' }
    })
    expect(res.status()).toBe(200)
    return await res.json()
}