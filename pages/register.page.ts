import {expect, Locator, Page} from "@playwright/test";

class RegisterUserPage {
    page: Page;

    registrationForm: Locator;
    firstName: Locator;
    lastName: Locator;
    address: Locator;
    city: Locator;
    state: Locator;
    zipCode: Locator;
    phoneNo: Locator;
    ssn: Locator;
    userName: Locator;
    password: Locator;
    confirmPass: Locator;
    registrationBTN: Locator;
    welcomeMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registrationForm = page.getByRole('link', { name: 'Register' });
        this.firstName = page.locator('//input[@id="customer.firstName"]');
        this.lastName = page.locator('//input[@id="customer.lastName"]');
        this.address = page.locator('//input[@id="customer.address.street"]');
        this.city = page.locator('//input[@id="customer.address.city"]');
        this.state = page.locator('//input[@id="customer.address.state"]');
        this.zipCode = page.locator('//input[@id="customer.address.zipCode"]');
        this.phoneNo = page.locator('#customer\\.phoneNumber');
        this.ssn = page.locator("#customer\\.ssn");
        this.userName = page.locator('#customer\\.username');
        this.password = page.locator('#customer\\.password');
        this.confirmPass = page.locator('#repeatedPassword');
        this.registrationBTN = page.getByRole('button', { name: 'Register' });
        this.welcomeMessage = page.locator("//h1[@class=\"title\"]");
    }

    async registerUser(
        webUrl: string,
        userName: string,
        firstName: string,
        lastName: string,
        address: string,
        city: string,
        state: string,
        zipCode: string,
        phoneNo: string,
        ssn: string,
        password: string
    ) {
        await this.page.goto(webUrl);
        await this.page.waitForLoadState('networkidle');
        await this.registrationForm.click();
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.address.fill(address);
        await this.city.fill(city);
        await this.state.fill(state);
        await this.zipCode.fill(zipCode);
        await this.phoneNo.fill(phoneNo);
        await this.ssn.fill(ssn);
        await this.userName.fill(userName);
        await this.password.fill(password);
        await this.confirmPass.fill(password);
        await this.registrationBTN.click();

        await this.page.waitForLoadState('networkidle');
        // checking that welcome message appears like -> Welcome, {firstname}{lastname}
        const welcomeText = await this.welcomeMessage.innerText();
        await expect.soft(welcomeText).toBe(`Welcome ${userName}`);
        // we did .trin() to remove any leading or trailing white spaces
        // console.log(`[Register] Registration successful. Welcome message: "${welcomeText.trim()}"`);
    }
}
export default RegisterUserPage;