pipeline {
    agent any

    environment {
        GITHUB_CREDENTIALS = credentials('github-user')  // Credenciais do GitHub
        SONAR_TOKEN = credentials('sonar-token')  // Token do SonarQube
        JAVA_HOME = "C:/Program Files/Java/jdk-17"  // Caminho do JDK 17
        MAVEN_HOME = "C:/Users/kelvi/devtools/apache-maven-3.9.9"  // Caminho do Maven
    }

    stages {
        stage('Checkout') {
            steps {
                // Clona o repositório do GitHub
                git branch: 'main', 
                    url: 'https://github.com/kelvinfernandess04/SoloQuest.git', 
                    credentialsId: 'github-credentials'
            }
        }

        stage('Build with Maven') {
            steps {
                script {
                    // Compila o projeto utilizando Maven
                    withEnv(["JAVA_HOME=${JAVA_HOME}", "MAVEN_HOME=${MAVEN_HOME}", "PATH+MAVEN=${MAVEN_HOME}/bin"]) {
                        bat "${MAVEN_HOME}/bin/mvn -f Solo-Quest/pom.xml clean install"
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    // Define a instalação do SonarQube Scanner no Jenkins
                    def scannerHome = tool 'sonarqube_scanner'  // Nome da instalação do scanner no Jenkins

                    // Executa a análise com o SonarQube
                    withSonarQubeEnv('sonarqube_server') {  // Nome do servidor SonarQube configurado no Jenkins
                        bat """
                            ${scannerHome}/bin/sonar-scanner.bat \
                            -Dsonar.projectKey=SoloQuest \
                            -Dsonar.sources=. \
                            -Dsonar.java.binaries=Solo-Quest/target/classes \
                            -Dsonar.host.url=http://localhost:9000 \
                            -Dsonar.login=${SONAR_TOKEN}
                        """
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
