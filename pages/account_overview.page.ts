import { Locator, Page, expect } from "@playwright/test";

class accountOverview {
    page: Page;

    accountOverviewBTN: Locator;
    accountRows: Locator;

    constructor(page: Page) {
        this.page = page;
        this.accountOverviewBTN = page.getByRole('link', { name: 'Accounts Overview' });
        // this locator finds all the links to accounts present in account overview section
        this.accountRows = page.locator('#accountTable tbody tr td a');
    }

    async getAllAccountsNumber() {
        await this.accountOverviewBTN.click();
        // Wait for at least one account row to be visible before reading
        await this.page.waitForSelector('#accountTable tbody tr td a', { state: 'visible', timeout: 15000 });
        await this.page.waitForTimeout(1000);
        const count = await this.accountRows.count(); // counting the no of accounts
        const numbers: string[] = []; // declaring an array of strings named numbers
        for (let i = 0; i < count; i++) {
            const text = await this.accountRows.nth(i).innerText();
            numbers.push(text.trim());
        }
        return numbers;
    }

    async verifyAccountNumberExists(accountNumberSavings: string, accountNumberChecking: string) {
        const allNumbers = await this.getAllAccountsNumber();
        expect(allNumbers).toContain(accountNumberSavings);
        if (!allNumbers.includes(accountNumberSavings)) {
            throw new Error(`Savings account number ${accountNumberSavings} not found in Accounts Overview. Found: ${allNumbers.join(', ')}`);
        }
        expect(allNumbers).toContain(accountNumberChecking);
        if (!allNumbers.includes(accountNumberChecking)) {
            throw new Error(`Checking account number ${accountNumberChecking} not found in Accounts Overview. Found: ${allNumbers.join(', ')}`);
        }
    }

    async balanceCheck(url: string, accountA: string, accountB: string) {
        await this.accountOverviewBTN.click();
        // Wait for table to be fully loaded
        await this.page.waitForSelector('#accountTable tbody tr td a', { state: 'visible', timeout: 15000 });
        // await this.page.waitForTimeout(1000);

        const rows = this.page.locator('#accountTable tbody tr');
        const rowCount = await rows.count();
        // creating 2 variables for balances of both account, and type annotation reffers that either it should be a string or null values and initialized as null
        let balanceA: string | null = null;
        let balanceB: string | null = null;
        // traversing through all the rows
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i); //fetching ith row
            const firstCellText = await row.locator('td').first().innerText();
            if (firstCellText.includes('Total')) continue;
            const accountNumber = await row.locator('td a').innerText();
            const balanceText = await row.locator('td').nth(1).innerText();
            //matching if account number , matches the account number of A
            if (accountNumber.trim() === accountA) {
                balanceA = balanceText.replace('$', '').trim();
            }
            //matching if account number , matches the account number of B
            if (accountNumber.trim() === accountB) {
                balanceB = balanceText.replace('$', '').trim();
            }
        }
        if (!balanceA || !balanceB) {
            throw new Error(`Could not find balances for accounts ${accountA} or ${accountB}`);
        }
        return { balanceA: Number(balanceA), balanceB: Number(balanceB) };
    }
}
export default accountOverview;