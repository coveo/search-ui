import {defineConfig, devices} from '@playwright/test';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// dotenv.config({ path: path.resolve(__dirname, './env', '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: 'e2e',
    timeout: process.env.CI ? 3 * 60 * 1000 : 60 * 1000,
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 4 : 8,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI
        ? [['html'], ['list'], ['json', {outputFile: 'test-results.json'}], ['github']]
        : [['html'], ['list']],
    reportSlowTests: {max: 10, threshold: 60 * 1000},
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://127.0.0.1:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on',
        screenshot: 'only-on-failure',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'validate-jsui-version',
            testMatch: 'validateJsuiVersion.ts',
        },

        {
            name: 'chromium',
            testIgnore: 'validateJsuiVersion.ts',
            use: {
                ...devices['Desktop Chrome'],
                headless: true,
            },
        },

        {
            name: 'firefox',
            testIgnore: 'validateJsuiVersion.ts',
            use: {
                ...devices['Desktop Firefox'],
                headless: true,
            },
        },

        {
            name: 'webkit',
            testIgnore: 'validateJsuiVersion.ts',
            use: {
                ...devices['Desktop Safari'],
                headless: true,
            },
        },
    ],
});
