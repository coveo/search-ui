import {test} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaSearchEvent} from '../utils/requests';

test.describe('Tab', () => {
    test('Test tab change', async ({page}) => {
        await page.goto(pageURL('DynamicFacets'));
        const uaRequest_tabChange = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause == 'interfaceChange' &&
                request.postDataJSON()[0]?.actionType == 'interface' &&
                request.postDataJSON()[0]?.customData.interfaceChangeTo == 'Salesforce',
            {timeout: 5_000},
        );
        await page.getByRole('button', {name: 'Salesforce'}).click();
        await uaRequest_tabChange;
    });
});
