# cafe-webapi Project

A sample Web API built with **TypeScript + Node.js**, packaged into a **Docker** container for easy deployment in any Docker-supported environment.

---

## 1. Project Overview

- Provides a `/test` endpoint that:
  1. Requests an authorization token from the third-party API (`System_Login`)
  2. Uses the token to call the `Xact_CreateTO` API
  3. Returns the combined response as JSON

---

## 2. Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v8.x or higher
- **Docker**: v20.x or higher (for containerized runs)
- Basic familiarity with the command line

---

## 3. Local Development (Without Docker)

1. Clone the repository:
   ```bash
   git clone <repo-url> cafe-webapi
   cd cafe-webapi
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the project root:
   ```env
   PORT=3000
   API_USER=501
   API_PASS=501
   BASE_URL=https://erun.cloud/16463D_HKJEBN_Cafe_api/api.asmx
   ```
4. Start in development mode (auto-reload):
   ```bash
   npm run dev
   ```
5. Test the endpoint:
   ```bash
   curl http://localhost:3000/test
   ```

---

## 4. Build and Run (Compiled)

1. Compile TypeScript:
   ```bash
   npm run build
   ```
2. Run the compiled code:
   ```bash
   npm start
   ```

---

## 5. Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t cafe-api:latest .
   ```
2. Run the Docker container:
   ```bash
   docker run -d \
     --name cafe-api \
     -p 3000:3000 \
     --env-file .env \
     cafe-api:latest
   ```
3. Verify the container is running:
   ```bash
   docker ps
   docker logs cafe-api
   curl http://localhost:3000/test
   ```
4. Stop and remove the container:
   ```bash
   docker stop cafe-api
   docker rm cafe-api
   ```

---

## 6. FAQ

- **Why multi-stage build?**  
  The first stage compiles TypeScript and installs devDependencies, the second stage produces a smaller image with only production dependencies.

- **How to add or modify routes?**  
  Edit `src/index.ts` under the `app.get('/test', ...)` section.

---

## 7. Next Steps

- Push the image to a container registry (e.g., Docker Hub, AWS ECR).
- Integrate into a CI/CD pipeline for automated builds and deployments.
- Deploy on Kubernetes, ECS, or other container orchestration platforms.

---

### Author

Victor

_This README is written in English. Code snippets and technical terms remain in English._
