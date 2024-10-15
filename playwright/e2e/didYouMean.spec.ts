import {test, expect} from '@playwright/test';
import {pageURL} from '../utils/utils';
import {isUaSearchEvent} from '../utils/requests';
import {SearchboxSelectors} from '../utils/selectors';

test.describe('Did you mean', () => {
    test('Did you mean automatic', async ({page}) => {
        const query = 'tets';
        await page.goto(pageURL('00_standardSP4automated_1'));
        await SearchboxSelectors(page).searchboxInput.first().fill(query);
        const uaRequestSearchQuery = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'searchboxSubmit' &&
                request.postDataJSON()[0]?.actionType === 'search box' &&
                request.postDataJSON()[0]?.queryText === query,
            {timeout: 5_000},
        );
        const uaRequestDidYouMeanAutomatic = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'didyoumeanAutomatic' &&
                request.postDataJSON()[0]?.actionType === 'misc',
            {timeout: 5_000},
        );
        await SearchboxSelectors(page).searchboxIcon.click();
        await uaRequestSearchQuery;
        await uaRequestDidYouMeanAutomatic;
    });

    test('Did you mean click', async ({page}) => {
        const query = 'testt';
        await page.goto(pageURL('00_standardSP4automated_1'));
        await SearchboxSelectors(page).searchboxInput.first().fill(query);
        const uaRequestSearchQuery = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'searchboxSubmit' &&
                request.postDataJSON()[0]?.actionType === 'search box' &&
                request.postDataJSON()[0]?.queryText === query,
            {timeout: 5_000},
        );
        await SearchboxSelectors(page).searchboxIcon.click();
        await uaRequestSearchQuery;
        await expect(page.getByText('Did you mean: test')).toBeVisible();

        const uaRequestDidYouMeanAutomatic = page.waitForRequest(
            (request) =>
                isUaSearchEvent(request) &&
                request.postDataJSON()[0]?.actionCause === 'didyoumeanClick' &&
                request.postDataJSON()[0]?.actionType === 'misc' &&
                request.postDataJSON()[0]?.queryText === 'test',
            {timeout: 5_000},
        );
        await page.getByRole('button', {name: 'test'}).click();
        await uaRequestDidYouMeanAutomatic;
    });
});
