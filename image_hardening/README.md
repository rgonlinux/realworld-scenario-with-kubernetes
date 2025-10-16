# Image Hardening

1. **Clone the repository and enter the directory:**
```
git clone git@github.com:rgonlinux/realworld-scenario-with-kubernetes.git
```

2. **Build and start the containers:**
```
docker-compose up -d --build
```
3. **Open your browser to access application [http://localhost:3000](http://localhost:3000)**  

>Manual Testing

- Use the web GUI at `/`
- Or, test with `curl`:
```
curl -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d '{"task":"Your Todo"}'
curl http://localhost:3000/api/todos
```

4. **To Check Health of application use the below endpoint**

```
http://localhost:3000/health
```

5. **To Scan the docker image and docker file:**

- Install - [trivy](https://trivy.dev/v0.18.3/installation/)

```
trivy config ../Dockerfile.prod
```

```
trivy image <username>/<image-name>:<tag>
```

- If we encounter vulnerabilities, install or remove the files or packages recommended by Trivy

6. **To Stop the application:**

```
docker-compose down
```