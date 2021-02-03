node('linux && docker') {
  checkout scm
  def tag = env.TAG_NAME

  withEnv([
    'npm_config_cache=npm-cache'
  ]){
    withDockerContainer(image: 'nikolaik/python-nodejs:python3.8-nodejs10', args: '-u=root') {
      stage('Install') {
        sh 'yarn install'
      }

      stage('Build') {
        sh 'yarn run injectVersion'
        sh 'yarn run build'

        if (tag) {
          sh 'yarn run minimize'
        }
      }

      stage('Install Chrome') {
        sh "wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -"
        sh "echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | tee /etc/apt/sources.list.d/google-chrome.list"
        sh "apt-get update"
        sh "apt-get install -y google-chrome-stable"
        sh "google-chrome --version"
      }

      stage('Test') {
        sh 'yarn run unitTests'
        
        if (tag) {
          sh 'yarn run accessibilityTests'
        }

        sh 'set +e'
        // sh 'yarn run uploadCoverage'
        sh 'set -e'
        sh 'yarn run validateTypeDefinitions'
      }

      if (!tag) {
        return
      }

      stage('Docs') {
        withCredentials([
            usernameColonPassword(credentialsId: 'github-commit-token', variable: 'GITHUB_TOKEN')
        ]) {
            sh './deploy.doc.sh'
        }
        sh 'yarn run docsitemap'
      }

      stage('Github Release') {
        sh 'yarn run zipForGitReleases'
        
        withCredentials([
          usernamePassword(credentialsId: 'github-commit-token', usernameVariable: 'GITHUB_USERNAME', passwordVariable: 'GITHUB_TOKEN')
        ]) {
            sh 'node ./build/github-release.deploy.js'
        }
      }

      stage('Deploy') {
        withCredentials([
            string(credentialsId: 'NPM_TOKEN', variable: 'NPM_TOKEN')
        ]) {
            sh 'node ./build/npm.deploy.js'
        }

        sh 'rm -rf veracode && mkdir veracode'
        sh 'mkdir veracode/search-ui'
        sh 'cp -R src package.json yarn.lock veracode/search-ui'

        sh 'node ./build/deployment-pipeline.deploy.js || true'
      }
    }

  }
}