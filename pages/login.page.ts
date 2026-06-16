import { Locator, Page } from "@playwright/test";

class loginUserPage {
    page: Page;
    userNameTF: Locator;
    passwordTF: Locator;
    loginBTN: Locator;
    loggedInIndicator: Locator;
    errorMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userNameTF = page.locator('[name="username"]');
        this.passwordTF = page.locator('[name="password"]');
        this.loginBTN = page.getByRole('button', { name: 'Log In' });
        this.loggedInIndicator = page.locator('#leftPanel h2');
        this.errorMsg = page.locator("//p[@class='error']");
    }

    async loginUser(webUrl: string, userName: string, password: string) {
        await this.page.goto(webUrl);
        await this.page.waitForLoadState('networkidle');
        await this.userNameTF.fill(userName);
        await this.passwordTF.fill(password);
        await this.loginBTN.click();
        await this.page.waitForLoadState('networkidle');
    }
}

export default loginUserPage;
