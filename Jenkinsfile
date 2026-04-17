pipeline {
    agent any

    stages {

        stage('Initial Setup') {
            steps {
                sh '''
                chmod +x initial-setup.sh
                ./initial-setup.sh
                '''
            }
        }

    }
}