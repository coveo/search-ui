import {test} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaCustomEvent} from '../utils/requests';
import {GeneralSettingSelectors} from '../utils/selectors';

test.describe('Preference Change', () => {
    test.beforeEach(async ({page}) => {
        await page.goto(pageURL('00_standardSP4automated_1'));
        await GeneralSettingSelectors(page).generalSettingButton.click();
        await GeneralSettingSelectors(page).preferecesOption.click();
    });
    test('Test preferenceChange selected', async ({page}) => {
        const uaRequestPreferenceSelect = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'preferencesChange' &&
                request.postDataJSON()?.actionType === 'preferences' &&
                request.postDataJSON()?.customData.preferenceType === 'selected',
            {timeout: 5_000},
        );
        await page.getByRole('checkbox', {name: 'Always open results in new'}).click();
        await uaRequestPreferenceSelect;
    });

    test('Test preferenceChange deselected', async ({page}) => {
        await page.getByRole('checkbox', {name: 'Always open results in new'}).click();
        await page.waitForLoadState('networkidle');
        const uaRequestPreferenceSelect = page.waitForRequest(
            (request) =>
                isUaCustomEvent(request) &&
                request.postDataJSON()?.actionCause === 'preferencesChange' &&
                request.postDataJSON()?.actionType === 'preferences' &&
                request.postDataJSON()?.customData.preferenceType === 'unselected',
            {timeout: 5_000},
        );
        await page.getByRole('checkbox', {name: 'Always open results in new'}).click();
        await uaRequestPreferenceSelect;
    });
});
