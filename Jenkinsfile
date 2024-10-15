pipeline {
    agent any
    environment {
        GITHUB_CREDENTIALS = credentials('github-user')  // Credenciais do GitHub
        JAVA_HOME = 'C:/Program Files/Java/jdk-17'  // Caminho do JDK 17
        MAVEN_HOME = 'C:/Users/kelvi/devtools/apache-maven-3.9.9'  // Caminho do Maven
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/kelvinfernandess04/SoloQuest.git', credentialsId: 'github-credentials'
            }
        }
        stage('Build with Maven') {
            steps {
                script {
                    withEnv(["JAVA_HOME=${JAVA_HOME}", "MAVEN_HOME=${MAVEN_HOME}", "PATH+MAVEN=${MAVEN_HOME}/bin"]) {
                        bat "${MAVEN_HOME}/bin/mvn -f pom.xml clean install"
                    }
                }
            }
        }
        stage('SonarCloud Analysis') {
            steps {
                withSonarQubeEnv('sonarcloud') {  // Nome do servidor SonarCloud configurado no Jenkins
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                        script {
                            // Define o caminho do scanner instalado no Jenkins
                            def scannerHome = tool name: 'sonarqube_scanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                            bat """
                                "${scannerHome}/bin/sonar-scanner.bat" ^
                                -Dsonar.projectKey=kelvinfernandess04_SoloQuest ^
                                -Dsonar.organization=kelvinfernandess04 ^
                                -Dsonar.sources=. ^
                                -Dsonar.java.binaries=Solo-Quest/target/classes ^
                                -Dsonar.host.url=https://sonarcloud.io ^
                                -Dsonar.login=${SONAR_TOKEN}^
                                -Dsonar.token=${SONAR_TOKEN}
                            """
                        }
                    }
                }
            }
        }
    }
    post {
        always {
            echo 'Pipeline complete!'
        }
    }
}
