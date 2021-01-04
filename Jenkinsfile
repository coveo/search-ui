node('linux && docker') {
  checkout scm
  def isMaster = env.BRANCH_NAME == 'master'

  withEnv([
    'npm_config_cache=npm-cache'
  ]){
    withDockerContainer(image: 'node:14', args: '-u=root') {
      stage('Setup') {
        sh 'export SOURCE_BRANCH=${BRANCH_NAME}'
        sh 'export IS_FORKED_PULL_REQUEST=$([[ $TRAVIS_PULL_REQUEST != false && $TRAVIS_PULL_REQUEST_SLUG != $TRAVIS_REPO_SLUG ]] && echo true || echo false)'
        sh 'export HAS_BETA_TAG=$([[ $TRAVIS_TAG =~ ^[0-9]+\\.[0-9]+\\.[0-9]+-beta$ && $IS_FORKED_PULL_REQUEST = false ]] && echo true || echo false)'
        sh 'export HAS_RELEASE_TAG=$([[ $TRAVIS_TAG =~ ^[0-9]+\\.[0-9]+\\.[0-9]+$ && $IS_FORKED_PULL_REQUEST = false ]] && echo true || echo false)'
        sh 'export IS_ON_FEATURE_BRANCH=$([[ $SOURCE_BRANCH =~ ^JSUI-[0-9]+ && $IS_FORKED_PULL_REQUEST = false ]] && echo true || echo false)'
        sh 'export IS_NIGHTLY=$([[ $HAS_BETA_TAG = true && $TRAVIS_EVENT_TYPE = cron ]] && echo true || echo false)'
        sh 'export IS_PULL_REQUEST_PUSH_BUILD=$([[ $TRAVIS_PULL_REQUEST = false && $IS_ON_FEATURE_BRANCH = true ]] && echo true || echo false)'
        sh 'echo $TRAVIS_BRANCH'
        sh 'echo $TRAVIS_PULL_REQUEST_BRANCH'
        sh 'echo $TRAVIS_PULL_REQUEST'
        sh 'echo $SOURCE_BRANCH'
        sh 'echo $IS_FORKED_PULL_REQUEST'
        sh 'echo $HAS_BETA_TAG'
        sh 'echo $HAS_RELEASE_TAG'
        sh 'echo $IS_ON_FEATURE_BRANCH'
        sh 'echo $IS_NIGHTLY'
        sh 'echo $IS_PULL_REQUEST_PUSH_BUILD'
      }

      stage('Install') {
          sh 'yarn install'
      }

      stage('Build') {
        sh '. ./read.version.sh'
        sh 'echo $PACKAGE_JSON_VERSION'
        sh 'yarn run injectTag'
        sh 'yarn run build'
        sh 'if [ "x$TRAVIS_TAG" != "x" ]; then yarn run minimize ; fi'
      }

      stage('Test') {
        sh 'yarn run unitTests'
        sh 'yarn run accessibilityTests'
        sh 'set +e'
        sh 'yarn run uploadCoverage'
        sh 'set -e'
        sh 'yarn run validateTypeDefinitions'
      }

      stage('Docs') {
        sh 'if [[ "x$TRAVIS_TAG" != "x" && $IS_PULL_REQUEST_PUSH_BUILD = false ]]; then bash ./deploy.doc.sh ; fi'
        sh 'yarn run docsitemap'
        sh 'yarn run zipForGitReleases'
      }
    }

    if (!isMaster) {
      return
    }

    withDockerContainer(image: '458176070654.dkr.ecr.us-east-1.amazonaws.com/jenkins/deployment_package:v7') {
      stage('Veracode package') {
        sh 'rm -rf veracode && mkdir veracode'

        sh 'mkdir veracode/search-ui'
        sh 'cp -R src package.json yarn.lock veracode/search-ui'
      }

      stage('Deployment pipeline upload') {
        sh 'deployment-package package create --with-deploy || true'
      }
    }
  }
}