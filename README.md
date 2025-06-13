[![Build Frontend](https://github.com/bkrajendra/blood-donation/actions/workflows/build-frontend.yml/badge.svg)](https://github.com/bkrajendra/blood-donation/actions/workflows/build-frontend.yml) 
[![Build Backend](https://github.com/bkrajendra/blood-donation/actions/workflows/build-backend.yml/badge.svg)](https://github.com/bkrajendra/blood-donation/actions/workflows/build-backend.yml)

# Blood Donation 🩸
Registration and Tracking blood donation drive workflow.

# Project structure
```shell
.
├── backend
│   ├── data
│   ├── Dockerfile
│   ├── nest-cli.json
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   └── tsconfig.json
├── docker-compose.yaml
├── frontend
│   ├── angular.json
│   ├── Dockerfile
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   ├── tsconfig.app.json
│   └── tsconfig.json
└── README.md
```

# Build
Build is handled by github actions and pushed to DockerHub

# Run locally from source code
update frontend/src/app/services/api.service.ts 
```ts
private baseUrl = 'http://localhost:3000';

```
Run
```shell
cd backend && npm run start:dev
cd frontend && npm run start

```
# Run with docker
```shell
docker compose up
```

