export async function transfer_funds(request:any, sourceAccountId:number, destAccountId:number, amt:number){
    return await request.post(`https://parabank.parasoft.com/parabank/services/bank/transfer`, {
        headers: {Accept: 'application/json'},
        params: {
            fromAccountId: sourceAccountId,
            toAccountId: destAccountId,
            amount: amt,
        },
    })
}