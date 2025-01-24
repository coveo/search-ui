import awsSDK from 'aws-sdk';
import {getPackageDefinitionFromPackageDir} from '../packages.mjs';

const cloudfront = new awsSDK.CloudFront();

/**
 * @param {import('../packages.mjs').PackageDir} dir
 */
function getMajorVersion(dir) {
  const {version} = getPackageDefinitionFromPackageDir(dir);
  return version.split('.')[0];
}

async function main() {
  const pathsToInvalidate = [
    '/atomic/latest/*',
    `/atomic/v${getMajorVersion('atomic')}/*`,
    '/headless/latest/*',
    `/headless/v${getMajorVersion('headless')}/*`,
    '/bueno/latest/*',
    `/bueno/v${getMajorVersion('bueno')}/*`,
  ];

  const invalidationRequest = cloudfront.createInvalidation({
    /* cspell:disable-next-line */
    DistributionId: 'E2VWLFSCSD1GLA',
    InvalidationBatch: {
      CallerReference: new Date().getTime().toString(),
      Paths: {
        Quantity: pathsToInvalidate.length,
        Items: pathsToInvalidate,
      },
    },
  });

  invalidationRequest.send((error, success) => {
    if (error) {
      console.log('ERROR WHILE INVALIDATING RESSOURCES ON CLOUDFRONT');
      console.log('*************');
      console.log(error.message);
      console.log('*************');
      throw error;
    }
    if (success) {
      console.log('INVALIDATION ON CLOUDFRONT SUCCESSFUL');
      console.log('*************');
      console.log(`PATHS INVALIDATED: ${pathsToInvalidate}`);
      console.log(`INVALIDATION ID : ${success.Invalidation.Id}`);
      console.log('*************');
    }
  });
}

main();