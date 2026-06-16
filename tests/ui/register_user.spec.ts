import {expect, test} from '@playwright/test';
import RegisterUserPage from "../../pages/register.page";
import { getData, getUniqueUsername } from "../../utils/dataHelper";

// Static config loaded once for this file
const data = getData();
// Unique username scoped to this file — generated once at module load
const uniqueUserName = getUniqueUsername(data.user.userName);

test('Register User - TC-UI-01', async ({ page }) => {
    const regObj = new RegisterUserPage(page);
    await regObj.registerUser(
        data.url.baseUrl,
        uniqueUserName,
        data.user.firstName,
        data.user.lastName,
        data.user.address,
        data.user.city,
        data.user.state,
        data.user.zipCode,
        data.user.phoneNo,
        data.user.ssn,
        data.user.password
    );
    await expect(page).toHaveURL('https://parabank.parasoft.com/parabank/register.htm');
    await page.screenshot({ path: `screenshots/Registered_user.png`, fullPage: true })
});