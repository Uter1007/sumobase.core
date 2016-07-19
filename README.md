cleansumo
=====================

## Features

- **Gulp pipeline** for building/linting typescript, running tests & bumping/tagging package versions. Bonus: Use ES6 features in gulp build itself.
- **Typescript support**, including [tsconfig.json](tsconfig.json) (typescript 1.6+ way of [configuring build options](https://github.com/Microsoft/TypeScript/wiki/tsconfig.json)),
[tsd folder](./typings) w/ versioned types for the included dependencies.
- **Mocha** for testing, examples provided
- **Environment configuration** through `.env` file
- **Test coverage reporting**
- **PM2 integration** to run a server cluster, both as local installation or on a dockerized container

### Opinionated additions

On top of the bare express installation, the following has been added

- Error handling moved to a separate [errorHandler service](./src/services/errorHandler.ts) to unbloat main app file.
- Slightly opinionated [controllers](./src/controllers)/[routes](./src/routes)/[services](./src/services) folders
for better structuring bigger applications.
- set environment values through files using [.dotenv](https://www.npmjs.com/package/dotenv) package.

### Build system

Several gulp tasks are provided, which are described by running `gulp help`:

- typescript linting/compiling tasks (watch/watchAndServe/lint/tdd)
- server application + autorestart it when code changes (through [nodemon](https://www.npmjs.com/package/nodemon))
- run tests (mocha + supertest included as examples)

### Local

- Node must be installed on the system
- Run `npm install` from the root folder to install all required dev/build dependencies
- (Optionally) Install *Typescript definitions manager (tsd)* `npm install tsd -g` globally to update typescript definitions when desired
- Copy both `githooks/pre-commit` and `githooks/pre-push` to the folder ".git/hooks" of your local repository.
 - These hooks automatically validate the local build before a git commit or git push is done. Typescript compilation errors or failed tests will abort the git action. Linting errors won't abort the git action but will be printed out as warnings.

## Developing

- Use the `gulp` task during development to get hot code-reloading/test running when you modify your code
- Use the `gulp debug` task during development to get node-inspector and swagger-ui additionally

## URLs

- http://localhost:3000 - REST API
- http://localhost:8080 - Node Inspector
- http://localhost:3000/swagger - Swagger UI

### Create module

- Create folder within the src/modules folder
- Import routes of new module in app.ts:
    ```
    import * as healthCheckRoutes from './modules/healthcheck/routes/example';
    ```
- Register routes in app.ts: 
    ```
    app.use(healthCheckRoutes);
    ```

## Running production server:

To make use of all your server resources, it is recommended to run the server in cluster mode (via the [PM2](https://www.npmjs.com/package/pm2) package)

#### Running on hosts local installation:

Use the `gulp serveCluster` task. You can monitor the cluster and issue commands by running pm2 command (for this you might want to install pm2 globally, `npm install pm2 -g`)

