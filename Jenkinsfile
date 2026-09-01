pipeline {

    agent any

    environment {

        AWS_REGION = "ap-south-1"

        ECR_REGISTRY = "508716860773.dkr.ecr.ap-south-1.amazonaws.com"

        FOOD_IMAGE = "${ECR_REGISTRY}/zomato-food-service"

        ORDER_IMAGE = "${ECR_REGISTRY}/zomato-order-service"

        FRONTEND_IMAGE = "${ECR_REGISTRY}/zomato-frontend"

        IMAGE_TAG = "${BUILD_NUMBER}"

    }

    stages {

        stage('Checkout') {

            steps {

                checkout scm

            }
        }

        stage('Test') {

            parallel {

                stage('Food Service Test') {

                    steps {

                        sh '''
                        cd food-service
                        npm install
                        npm test
                        '''

                    }
                }

                stage('Order Service Test') {

                    steps {

                        sh '''
                        cd order-service
                        npm install
                        npm test
                        '''

                    }
                }
            }
        }

        stage('Docker Build') {

            steps {

                sh """
                docker build \
                -t ${FOOD_IMAGE}:${IMAGE_TAG} \
                ./food-service

                docker build \
                -t ${ORDER_IMAGE}:${IMAGE_TAG} \
                ./order-service

                docker build \
                -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                ./frontend
                """

            }
        }

        stage('Login to ECR') {

            steps {

                sh """

                aws ecr get-login-password \
                --region ${AWS_REGION} |

                docker login \
                --username AWS \
                --password-stdin \
                ${ECR_REGISTRY}

                """

            }
        }

        stage('Push Images') {

            steps {

                sh """

                docker push ${FOOD_IMAGE}:${IMAGE_TAG}

                docker push ${ORDER_IMAGE}:${IMAGE_TAG}

                docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}

                """

            }
        }

        stage('Deploy Staging') {

            steps {

                sh """

                kubectl set image \
                deployment/food-service \
                food-service=${FOOD_IMAGE}:${IMAGE_TAG} \
                -n staging

                kubectl set image \
                deployment/order-service \
                order-service=${ORDER_IMAGE}:${IMAGE_TAG} \
                -n staging

                kubectl set image \
                deployment/frontend \
                frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} \
                -n staging

                """

            }
        }

        stage('Wait for Staging') {

            steps {

                sh """

                kubectl rollout status \
                deployment/food-service \
                -n staging \
                --timeout=180s

                kubectl rollout status \
                deployment/order-service \
                -n staging \
                --timeout=180s

                kubectl rollout status \
                deployment/frontend \
                -n staging \
                --timeout=180s

                """

            }
        }

        stage('Staging Validation') {

            steps {

                sh """

                kubectl get pods -n staging

                kubectl get svc -n staging

                """

            }
        }

        stage('Production Deployment') {

            when {

                branch 'main'

            }

            steps {

                sh """

                kubectl set image \
                deployment/food-service \
                food-service=${FOOD_IMAGE}:${IMAGE_TAG} \
                -n production

                kubectl set image \
                deployment/order-service \
                order-service=${ORDER_IMAGE}:${IMAGE_TAG} \
                -n production

                kubectl set image \
                deployment/frontend \
                frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} \
                -n production

                """

            }
        }

        stage('Production Validation') {

            when {

                branch 'main'

            }

            steps {

                sh """

                kubectl rollout status \
                deployment/food-service \
                -n production \
                --timeout=180s

                kubectl rollout status \
                deployment/order-service \
                -n production \
                --timeout=180s

                kubectl rollout status \
                deployment/frontend \
                -n production \
                --timeout=180s

                """

            }
        }

    }

    post {

        success {

            echo "Deployment successful!"

        }

        failure {

            echo "Deployment failed!"

        }

    }

}
