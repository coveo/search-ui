const colors = require('colors');
const AWS = require('aws-sdk');

const cloudfront = new AWS.CloudFront();
const pathToInvalidate = `/searchui/v${process.env.PACKAGE_JSON_VERSION}/*`;

const invalidationRequest = cloudfront.createInvalidation({
  DistributionId: process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID,
  InvalidationBatch: {
    CallerReference: new Date().getTime().toString(),
    Paths: {
      Quantity: 1,
      Items: [pathToInvalidate]
    }
  }
});

invalidationRequest.send((error, success) => {
  if (error) {
    colors.red('ERROR WHILE INVALIDATING RESSOURCES ON CLOUDFRONT');
    colors.red('*************');
    colors.red(error.message);
    colors.red('*************');
    throw error;
  }
  if (success) {
    colors.green('INVALIDATION ON CLOUDFRONT SUCCESSFUL');
    colors.green('*************');
    colors.green(`PATH INVALIDATED: ${pathToInvalidate}`);
    colors.green(`INVALIDATION ID : ${success.Invalidation.Id}`);
    colors.green('*************');
  }
});
