import { expect, Locator, Page } from "@playwright/test";

class openNewAccount {
    page: Page;

    openNewAccountBTN: Locator;
    selectAccountType: Locator;
    openAccountSubmitBTN: Locator;
    successMessage: Locator;
    accountNumberLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.openNewAccountBTN = page.getByRole('link', { name: 'Open New Account' });
        this.selectAccountType = page.locator('#type').first();
        this.openAccountSubmitBTN = page.locator('//input[@class="button"]');
        this.successMessage = page.getByText('Congratulations, your account is now open.');
        this.accountNumberLink = page.locator('//a[@id ="newAccountId"]');
    }

    async openSavingsAccount(url: string) {
        await this.page.waitForLoadState('networkidle');
        await this.openNewAccountBTN.click();
        await this.selectAccountType.selectOption('1');
        await this.page.waitForLoadState('networkidle');
        await this.openAccountSubmitBTN.click();
        // asserting that success message of opening new account is visible
        await expect(this.successMessage).toBeVisible({ timeout: 10000 });
        // asserting that account number of new account is visible
        await expect(this.accountNumberLink).toBeVisible();
        // asserting that account number of new account contains digit
        await expect(this.accountNumberLink).toHaveText(/\d+/);
        // asserting that account number of new account is a link
        await expect(this.accountNumberLink).toHaveAttribute('href', /activity\.htm\?id=\d+/); // completes TC-UI-03
    }

    async openCheckingAccount(url: string) {
        await this.page.waitForLoadState('networkidle');
        await this.openNewAccountBTN.click();
        await this.selectAccountType.selectOption('0');
        await this.page.waitForLoadState('networkidle');
        await this.openAccountSubmitBTN.click();
        await expect(this.successMessage).toBeVisible({ timeout: 10000 });
        await expect(this.accountNumberLink).toBeVisible();
        await expect(this.accountNumberLink).toHaveText(/\d+/);
        await expect(this.accountNumberLink).toHaveAttribute('href', /activity\.htm\?id=\d+/);  // completes TC-UI-03
    }

    async getAccountNumber(): Promise<string> {
        const accNumber = await this.accountNumberLink.innerText();
        return accNumber.trim();
    }
}

export default openNewAccount;