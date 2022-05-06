node('linux && docker') {
  checkout scm

  withEnv([
    'npm_config_cache=npm-cache'
  ]){
    withDockerContainer(image: 'nikolaik/python-nodejs:python3.8-nodejs14', args: '-u=root') {
      stage('Cloudfront invalidation') {
        withCredentials([
          [
            $class: "AmazonWebServicesCredentialsBinding",
            credentialsId: "CloudfrontCacheInvalidation",
          ]
        ]) {
            sh 'yarn install'
            sh 'node invalidate.cloudfront.js'
        }
      }
    }

  }
}