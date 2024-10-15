pipeline {
    agent any
    environment {
        GITHUB_CREDENTIALS = credentials('github-user')  // Credenciais do GitHub
        SONAR_TOKEN = credentials('SONAR_TOKEN')  // SonarCloud token
        JAVA_HOME = 'C:/Program Files/Java/jdk-17'  // Caminho do JDK 17
        MAVEN_HOME = 'C:/Users/kelvi/devtools/apache-maven-3.9.9'  // Caminho do Maven
    }
    stages {
        stage('Checkout') {
            steps {
                // Checkout da branch em que o pipeline está rodando
                git branch: "${env.BRANCH_NAME}", url: 'https://github.com/kelvinfernandess04/SoloQuest.git', credentialsId: 'GITHUB_CREDENTIALS'
            }
        }
        stage('Build with Maven') {
            steps {
                script {
                    withEnv(["JAVA_HOME=${JAVA_HOME}", "MAVEN_HOME=${MAVEN_HOME}", "PATH+MAVEN=${MAVEN_HOME}/bin"]) {
                        bat "${MAVEN_HOME}/bin/mvn -f SoloQuest/pom.xml clean install"
                    }
                }
            }
        }
        stage('SonarCloud Analysis') {
            steps {
                withSonarQubeEnv('sonarcloud') {  // Nome do servidor SonarCloud configurado no Jenkins
                    withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                        script {
                            def scannerHome = tool name: 'sonarqube_scanner', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                            bat(
                                "${scannerHome}/bin/sonar-scanner.bat " +
                                "-Dsonar.projectKey=kelvinfernandess04_SoloQuest " +
                                "-Dsonar.organization=kelvinfernandess04 " +
                                "-Dsonar.sources=. " +
                                "-Dsonar.java.binaries=SoloQuest/target/classes " +
                                "-Dsonar.branch.name=${env.BRANCH_NAME} " +  // Nome da branch dinâmica
                                "-Dsonar.host.url=https://sonarcloud.io " +
                                "-Dsonar.login=${SONAR_TOKEN}"
                            )
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
