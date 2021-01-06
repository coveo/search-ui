node('linux && docker') {
  checkout scm

  withEnv([
    'npm_config_cache=npm-cache'
  ]){
    withDockerContainer(image: 'node:14', args: '-u=root') {
      stage('Install') {
        sh 'yarn install'
      }

      stage('Build') {
        sh '. ./read.version.sh'
        sh 'echo $PACKAGE_JSON_VERSION'
        sh 'yarn run injectTag'
        sh 'yarn run build'

        if (env.GIT_TAG_NAME) {
          sh 'yarn run minimize'
        }
      }

      stage('Install Chrome') {
        sh "wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -"
        sh "echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | tee /etc/apt/sources.list.d/google-chrome.list"
        sh "apt-get update"
        sh "apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 libxtst6 --no-install-recommends"
        sh "google-chrome --version"
      }

      stage('Test') {
        sh 'yarn run unitTests'
        
        if (env.GIT_TAG_NAME) {
          sh 'yarn run accessibilityTests'
        }

        sh 'set +e'
        // sh 'yarn run uploadCoverage'
        sh 'set -e'
        sh 'yarn run validateTypeDefinitions'
      }

      stage('Docs') {
        sh 'if [[ "x$GIT_TAG_NAME" != "x" && $IS_PULL_REQUEST_PUSH_BUILD = false ]]; then bash ./deploy.doc.sh ; fi'
        sh 'yarn run docsitemap'
        sh 'yarn run zipForGitReleases'
      }
    }

    if (!env.GIT_TAG_NAME) {
      return
    }

    stage('Deploy') {
      withCredentials([
          string(credentialsId: 'NPM_TOKEN', variable: 'NPM_TOKEN')
      ]) {
          sh(script: 'node ./build/npm.deploy.js')
      }
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