const exec = require('child_process').exec;
const colors = require('colors');
const AWS = require('aws-sdk');

const cloudfront = new AWS.CloudFront();
const pathToInvalidate = `/searchui/v${process.env.MAJOR_MINOR_VERSION}/*`;

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
    console.log(colors.red('ERROR WHILE INVALIDATING RESSOURCES ON CLOUDFRONT'));
    console.log(colors.red('*************'));
    console.log(colors.red(error.message));
    console.log(colors.red('*************'));
    exec('travis_terminate 1');
    throw error;
  }
  if (success) {
    console.log(colors.green('INVALIDATION ON CLOUDFRONT SUCCESSFUL'));
    console.log(colors.green('*************'));
    console.log(colors.green(`PATH INVALIDATED: ${pathToInvalidate}`));
    console.log(colors.green(`INVALIDATION ID : ${success.Invalidation.Id}`));
    console.log(colors.green('*************'));
  }
});
