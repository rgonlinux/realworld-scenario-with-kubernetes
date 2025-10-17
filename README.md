## Node.js + MongoDB Todo APP with Docker and on EKS with Terraform

### Features

- Node.js Express REST API at - (`/api/todos`)
- MongoDB for persistent storage
- Dockerized deployment (multi-stage build, non-root user, .dockerignore)
- Simple GUI at `/` for adding and viewing todos
- Added Healthcheck instruction in dockerfile and in manifest
- Dockerfile and images scanned using Trivy to detect vulnerabilities
- Developer-friendly setup using Docker Compose
- Kubernetes manifests for AWS EKS, provisioned via Terraform and scan with tfsec
- Integrated Datadog Agent for real-time metrics, logs, and performance monitoring 

### Prerequisites

- Install - [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/)
- Install - [k3s](https://docs.k3s.io/quick-start)
- Install - [Helm](https://helm.sh/docs/intro/install/)
- Install - [Terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
- Install - [AWS-Cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions)
- Install - [Terrascan](https://runterrascan.io/docs/getting-started/)

### Flow

#### 1. [image_hardening](https://github.com/rgonlinux/realworld-scenario-with-kubernetes/tree/main/image_hardening)

>We will focus on Docker and image hardening to enhance the security and reliability of our application. We'll build our app by using a minimal base image such as Alpine to reduce the attack surface. The Dockerfile will be optimized with multi-stage builds and configured to run as a non-root user for improved container isolation. We'll scan the final image using tools like Trivy to identify and remediate any high or critical vulnerabilities. To validate the image and application behavior, we'll use Docker Compose for local testing before moving to production. This ensures our containerized environment is secure, efficient, and ready for deployment.

#### 2. [github_action_flow](https://github.com/rgonlinux/realworld-scenario-with-kubernetes/tree/main/github_action_flow)

>As we transition to a more advanced and automated workflow, we will integrate GitHub Actions to streamline our CI/CD pipeline. This setup will automatically trigger on every push or pull request to the main branch, initiating a series of quality and security checks. First, it will perform static code analysis using SonarCloud to detect bugs, code smells, and vulnerabilities code present in src folder. Next, it will run container image scanning with Trivy to identify any critical security issues. The pipeline will be configured to fail if any critical vulnerabilities are found, ensuring only secure builds proceed. Finally, Docker images will be pushed to the registry only if all SonarCloud quality gates are passed, enforcing a robust security and code quality standard before deployment.

#### 3. [kubernetes_hardening](https://github.com/rgonlinux/realworld-scenario-with-kubernetes/tree/main/kubernetes_hardening)

>As we prepare to deploy our application to production using Kubernetes, we are prioritizing a robust security and resource governance strategy. Our deployment will enforce the use of non-root containers to minimize privilege escalation risks using Gatekeeper to enforce custom security policies and compliance controls . We'll define resource limits and requests to ensure fair scheduling and prevent resource exhaustion across the cluster. To control traffic flow and enhance isolation, we'll implement Kubernetes NetworkPolicies that restrict pod-to-pod communication based on defined rules. For runtime protection, we'll enable Seccomp profiles to limit system calls and reduce the attack surface of our containers. These measures collectively strengthen our cluster's security posture and operational reliability for production workloads.

#### 4. [audit_logs](https://github.com/rgonlinux/realworld-scenario-with-kubernetes/tree/main/audit_logs)

>This guide explains how to enable Kubernetes audit logging in K3s by configuring the kube-apiserver with a custom audit policy. Audit logs provide detailed visibility into cluster activity and support compliance with standards like SOC2, GDPR, and HIPAA. 

#### 5. [go_live_with_eks](https://github.com/rgonlinux/realworld-scenario-with-kubernetes/tree/main/go_live_with_eks)

>This section demonstrates how to transition hardened Kubernetes workloads into a production-ready environment using Amazon EKS. We leverage EKS’s managed control plane, IAM integration, and native support for Kubernetes features to ensure scalable, secure, and compliant deployment of real-world applications in the cloud.

#### 6. [monitoring_and_logging](https://github.com/rgonlinux/realworld-scenario-with-kubernetes/tree/main/monitoring_and_logging)

>This guide provides a step-by-step walkthrough for setting up Datadog monitoring in a Kubernetes environment. It covers installing the Datadog Agent using Helm, configuring alerts for ImagePullBackOff pod failures, and testing the alert setup with a simulated broken image. 