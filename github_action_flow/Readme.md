
# 🚀 Node.js Todo App CI/CD Pipeline

This repository features a robust GitHub Actions-based CI/CD pipeline for a Node.js Todo application. The pipeline automates testing, static analysis, Docker image creation, vulnerability scanning, and deployment to DockerHub.

---

## 🔐 Required Secrets

Before running the pipeline, ensure the following secrets are configured in your GitHub repository:

| Secret Name       | Description                          |
|-------------------|--------------------------------------|
| `DOCKERHUB_USER`  | Your DockerHub username              |
| `DOCKERHUB_PASS`  | DockerHub password or access token   |
| `SONAR_TOKEN`     | SonarCloud authentication token      |

---

## 📁 Pipeline Overview

The CI/CD workflow is defined in `.github/workflows/ci.yaml` located at the root of this repository. Below is a breakdown of its functionality:

### 🟢 Trigger Conditions

The pipeline runs automatically on:

- Pushes to the `main` branch affecting files in the `src/` directory
- Pull requests that modify files in the `src/` directory

---

### ✅ 1. Test

Runs unit tests and collects code coverage.

- Installs dependencies using `npm install` and `npm ci`
- Executes tests with coverage: `npm test -- --coverage`
- Uploads the coverage report (`lcov.info`) as an artifact

---

### 🧠 2. Static Analysis

Performs code quality checks using [SonarCloud](https://sonarcloud.io).

- Downloads the coverage report
- Moves `lcov.info` to the `src/` directory
- Executes a SonarCloud scan with:
  - `sonar.projectKey`: `yourgithubusername_reponame`
  - `sonar.organization`: `yourgithubusername`
  - Coverage report path: `lcov.info`
  - Quality gate enforcement enabled

---

### 🛠️ 3. Build & Security Scan

Builds and pushes the Docker image after passing static analysis.

- Logs in to DockerHub using stored secrets
- Builds the image using `Dockerfile.prod`
- Saves the image as `image.tar`
- Scans the image using [Trivy](https://github.com/aquasecurity/trivy) for **CRITICAL** vulnerabilities
- Pushes the image to DockerHub if the scan passes with git commit SHA

