# Image Hardening
> We have developed a nodejs Dockerfile optimized for production environments using a minimal Alpine-based image and multi-stage builds. This approach significantly reduces the **final image size** while ensuring separation of build, test, and runtime stages. To enhance security, the container runs as a non-root user with enforced runtime restrictions. Additionally, the image has been scanned using Trivy to identify and remediate vulnerabilities, ensuring compliance with best practices for container security and reliability.

## 1. **[Dockerfile](https://github.com/rgonlinux/realworld-scenario-with-kubernetes/blob/main/Dockerfile.prod) explained** 
> - Build Stage: We start by creating a dedicated build stage that installs production dependencies and prepares the application files. This serves as the foundational layer for both testing and production, ensuring consistency and minimizing image size.
> - Test Stage: A separate test stage is included to run unit tests using Jest, allowing developers to validate application behavior before deployment. While this stage supports basic testing, it can be extended with tools like SonarQube for deeper code quality analysis.
> - Production Stage: The final stage copies the build artifacts into a secure runtime environment. It creates a non-root user to enforce least privilege access and runs the nodejs application with health checks enabled, following best practices for container security and reliability.
```
# ---- Build Stage ----
FROM node:24.10.0-alpine3.22 AS build
WORKDIR /usr/src/app
COPY src/package-lock.json src/package.json ./
RUN npm install --omit=dev --ignore-scripts
COPY src/app.js src/routes.js src/server.js ./
COPY src/public ./public

# ---- Test Stage ----
FROM  node:24.10.0-alpine3.22 AS test
WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app
COPY src/jest.config.js src/app.test.mjs ./
RUN npm install --ignore-scripts --save-dev jest  && npm test -- --coverage

# ---- Production Stage ----
FROM node:24.10.0-alpine3.22 AS production
RUN addgroup -S todo && adduser -S todo -G todo
WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app
RUN chown -R todo:todo /usr/src/app
USER todo
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --spider --quiet http://localhost:3000/health || exit 1
CMD ["node", "server.js"]

```

## 2. **To Scan the docker image and docker file:**

- Install - [trivy](https://trivy.dev/v0.18.3/installation/)
> To scan dockerfile - 
```
trivy config ../Dockerfile.prod
```
> To scan docker image -
```
trivy image <username>/<image-name>:<tag>
```
> - If we encounter vulnerabilities, install or remove the files or packages recommended by Trivy


## 3. **Build and start the containers:**
> There is a **docker-compose** file located in the root directory of this repository. We can use it to start the application, allowing developers to perform testing efficiently.
```
docker-compose up -d --build
```
> **Open your browser to access GUI application [http://localhost:3000](http://localhost:3000)**  
> **Manual Testing -**
> ```
> curl -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"task":"Your Todo"}'
> curl http://localhost:3000/api/todos
> ```

## 4. **To Check Health of application use the below endpoint**

```
http://localhost:3000/health
```

## 5. **To Stop the application:**

```
docker-compose down
```