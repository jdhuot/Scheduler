INTERVIEW SCHEDULER
=========

## App Overview

Built with ReactJS, as a bootcamp project with fictional data to explore and practice React fundementals in a real world application. This interview schedular allows users to load the app and book, edit, or cancel interviews in the easy to use interface. The app handles database updates through axios requests to pull from and update to a PostgreSQL database on a separate api server. The Interview Scheduler app runs a websocket connection to allow real-time booking or cancelling updates to be viewed across multiple browser clients without any browser refreshes to be made.

The app is well tested through unit tests, integration tests, and full end to end tests utilizing various testing libraries and frameworks such as Storybook, Jest, Cypress, Mocha, and Chai.

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Running Cypress End to End Tests

```sh
npm run cypress
```


## Screenshots

### Interview Scheduler
!["Interview Scheduler"](https://github.com/jdhuot/Scheduler/blob/master/docs/Screen%20Shot%202020-08-13%20at%201.52.21%20PM.png?raw=true)

### Create, Edit, or Remove an Interview
!["Create, Edit, or Remove an Interview"](https://github.com/jdhuot/Scheduler/blob/master/docs/Screen%20Shot%202020-08-13%20at%201.52.37%20PM.png?raw=true)