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

        stage('Setup Python Virtual ENV') {
            steps {
                sh '''
                chmod +x envsetup.sh
                ./envsetup.sh
                '''
            }
        }
    }
}