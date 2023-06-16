node('linux && docker') {
  checkout scm
  def tag = env.TAG_NAME

  withEnv([
    'npm_config_cache=npm-cache'
  ]){
    withDockerContainer(image: 'node:18', args: '-u=root') {
      stage('Install') {
        // Prevents "not a git directory" issue.
        sh "git config --global --add safe.directory '*'"
        sh 'npm i -g npm@latest'
        sh 'npm install'
      }

      stage('Build') {
        sh 'npm run injectVersion'
        sh 'npm run build'

        sh 'npm run minimize'
      }

      stage('Install Chrome') {
        sh "wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -"
        sh "echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | tee /etc/apt/sources.list.d/google-chrome.list"
        sh "apt-get update"
        sh "apt-get install -y google-chrome-stable"
        sh "google-chrome --version"
      }

      stage('Test') {
        sh 'npm run unitTests'
        
        if (tag) {
          sh 'npm run accessibilityTests'
        }

        sh 'set +e'
        // sh 'npm run uploadCoverage'
        sh 'set -e'
        sh 'npm run validateTypeDefinitions'
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
        sh 'npm run docsitemap'
      }

      stage('Github Release') {
        sh 'npm run zipForGitReleases'
        
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

        sh 'node ./build/deployment-pipeline.deploy.js || true'
      }
    }

  }
}