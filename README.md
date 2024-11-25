# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/wlladislaw/nodejs2024Q3-service.git
```

Open folder with project
Checkout to the branch

## Installing NPM modules

```
npm install
```

## Running application

add .env file by env.example

! If you have the error: Authorization is not implemented - delete users in database , for example by prisma :

```
npx prisma studio
```

```
 docker-compose up --build
```

and for run tests in docker check id for container app - docker ps

```
 docker exec -it < checked app container id> npm run test
```

for local start with postgres on machine:

change env var HOST

```
npm run start
```

And open http://localhost:4000/docs/ (or port in env file )

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/docs/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
