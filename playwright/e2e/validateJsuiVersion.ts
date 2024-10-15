// This test is run in CI to validate that the JSUI version is the one expected.
import {test, expect} from '@playwright/test';
import {pageURL} from '../utils/utils';

const expectedJsuiVersion = process.env.JSUI_VERSION;
console.log(`Expected JSUI version: ${expectedJsuiVersion}`);

if (expectedJsuiVersion) {
    test('validate JSUI version', async ({page}) => {
        test.setTimeout(180_000);
        await page.goto(pageURL());
        const coveoVersion = await page.evaluate(() => (window as any).Coveo.version);
        // Example value: {lib: '2.10120.0', product: '2.10120.0', supportedApiVersion: 2}
        expect(coveoVersion.lib).toBe(expectedJsuiVersion);
        expect(coveoVersion.product).toBe(expectedJsuiVersion);
    });
} else {
    console.log('No JSUI version to validate.');
}
