// This test is run in CI to validate that the JSUI version is the one expected.
import {test, expect} from '@playwright/test';
import {pageURL} from '../utils/utils';

const expectedJsuiVersion = process.env.JSUI_VERSION;
const timeout = 180_000;

if (expectedJsuiVersion) {
    console.log(`Expected JSUI version: ${expectedJsuiVersion}`);

    test('validate JSUI version', async ({page}) => {
        test.setTimeout(timeout);
        await expect(async () => {
            await page.goto(pageURL());
            const coveoVersion = await page.evaluate(() => (window as any).Coveo.version);
            // Example value: {lib: '2.10120.0', product: '2.10120.0', supportedApiVersion: 2}
            expect(coveoVersion.lib).toBe(expectedJsuiVersion);
            expect(coveoVersion.product).toBe(expectedJsuiVersion);
        }).toPass({timeout});
    });
} else {
    console.log('No JSUI version to validate.');
}
