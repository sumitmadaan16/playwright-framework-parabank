import { expect, test } from '@playwright/test';
import loginUserPage from "../../pages/login.page";
import { getData } from "../../utils/dataHelper";

const data = getData();
// wrong data
const userName = 'fakeUser123';
const password = 'wrongpass';

test('login user - TC-NEG-04', async ({ page }) => {
    const loginObj = new loginUserPage(page);
    await loginObj.loginUser(data.url.baseUrl, userName, password);
    //wrong password should show error
    // await page.waitForTimeout(2000)
    await expect(loginObj.errorMsg).toBeVisible();
    await expect(loginObj.errorMsg).toHaveText('The username and password could not be verified.');
    // final UI validation assert with a screenshot
    await page.screenshot({path: `screenshots/login_negative_${userName}.png`, fullPage: true});
});
