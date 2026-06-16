import {expect, Locator, Page} from "@playwright/test";

class fundTransferPage {
    page: Page;

    transferFundsBTN: Locator;
    amountTF: Locator;
    transferComplete: Locator;
    fromAccount: Locator;
    toAccount: Locator;
    transferBTN: Locator;
    transferAmt: Locator;
    errorMsg: Locator

    constructor(page: Page) {
        this.page = page;
        this.transferFundsBTN = page.locator("//a[@href='transfer.htm']");
        this.amountTF = page.locator('input#amount');
        this.fromAccount = page.locator('select#fromAccountId');
        this.toAccount = page.locator('select#toAccountId');
        this.transferBTN = page.locator('//input[@class = "button"]');
        this.transferComplete = page.getByText('Transfer Complete!');
        this.transferAmt = page.locator('span#amountResult');
        // error msg if fund transfer fails
        this.errorMsg = page.locator('//div[@id="showError"]/p')
    }

    async transferFundsAToB(webUrl: string, amount: string, fromAcc: string, toAcc: string) {
        await this.page.goto(webUrl);
        await this.page.waitForLoadState('networkidle');
        await this.transferFundsBTN.click();
        await this.amountTF.fill(amount);
        await this.fromAccount.selectOption(fromAcc);
        await this.toAccount.selectOption(toAcc);
        await this.transferBTN.click();
        await this.page.waitForLoadState('networkidle');
        await this.transferComplete.waitFor({ state: 'visible' });
        // asserting that transfer complete message is visible
        await expect(this.transferComplete).toBeVisible();
        const transferredAmount = await this.transferAmt.innerText();

        return transferredAmount.trim();
    }

}

export default fundTransferPage;