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

        stage('Setup Gunicorn') {
            steps {
                sh '''
                chmod +x gunicorn.sh
                ./gunicorn.sh
                '''
            }
        }

        stage('Setup NGINX') {
            steps {
                sh '''
                chmod +x nginx.sh
                ./nginx.sh
                '''
            }
        }

        stage('Restart Services') {
            steps {
                sh '''
                sudo systemctl restart gunicorn
                sudo systemctl restart nginx
                '''
            }
        }
    }
}