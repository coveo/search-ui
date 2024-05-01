export const pageURL = (locationBase = '00_standardSP4automated_1') => {
    return `https://coveo-test-search.netlify.app/custom/${locationBase}.html`
}

export const compareAlphanumericalValues = (valueA: string, valueB: string): number => {
    return valueA.localeCompare(valueB, 'en', { sensitivity: 'base' });
};