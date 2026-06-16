import { Locator, Page, expect } from "@playwright/test";

class requestLoanPage {
    page: Page;

    requestLoanBTN: Locator;
    loanAmountTF: Locator;
    downPaymentTF: Locator;
    fromAccountSelector: Locator;
    applyNowBTN: Locator;
    conformationMsg: Locator;
    loanProcessingDate: Locator;
    newAccountId : Locator

    constructor(page: Page) {
        this.page = page;
        this.requestLoanBTN = page.getByRole('link', { name: "Request Loan" });
        this.loanAmountTF = page.locator('input#amount');
        this.downPaymentTF = page.locator('input#downPayment');
        this.fromAccountSelector = page.locator('select#fromAccountId');
        this.applyNowBTN = page.locator("//input[@class='button']");
        this.conformationMsg = page.locator('div#loanRequestApproved p').first()
        this.loanProcessingDate = page.locator('td#responseDate');
        this.newAccountId = page.locator('div#loanRequestApproved a')
    }

    async requestingLoan(webUrl: string, checkingAccountNumber: string) {
        await this.page.goto(webUrl);
        await this.page.waitForLoadState('networkidle');
        await this.requestLoanBTN.click();
        await this.page.waitForLoadState('networkidle');

        await this.loanAmountTF.fill("500");
        await this.downPaymentTF.fill("100");
        await this.fromAccountSelector.selectOption(checkingAccountNumber);
        await this.applyNowBTN.click();
        await this.page.waitForLoadState('networkidle');

        // check confirmation message is visible
        await expect(this.conformationMsg).toHaveText('Congratulations, your loan has been approved.', { timeout: 10000 });
        // const msgText = await this.conformationMsg.innerText();
        // console.log(msgText);

        // check loan processing date is visible and print it
        await expect(this.loanProcessingDate).toBeVisible();
        // const dateText = await this.loanProcessingDate.innerText();
        // console.log(dateText);
    }
}

export default requestLoanPage;