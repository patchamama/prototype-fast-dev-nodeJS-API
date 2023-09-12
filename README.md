# Prototype of nodeJS API (backend) to a fast develop

_DRY (don't repeat yourself)_

Aiming to provide a project structure in nodeJS following good practices to achieve a fast development of an API to achieve its deploy.

# Objective

Inspired by the agile philosophy for rapid development and production, the following project wants to take a small step with several programmed functionalities to provide an API from a very basic model that can be modified and scaled quickly and that includes authentication with tokens, testing and requests (REST). These functionalities can save hours and money in the process of integrating libraries and their validation.

# App structure

<pre>
app.js*
index.js
README.md
controllers
  login.js
  prototypes.js*
  users.js
models
  prototype.js
  users.js
requests
tests
utils
  config.js
  logger.js
  middleware.js  
</pre>

_\* Two files to be modified as base to adapt them to new needs._

# Features

## Models

This directory contains the database models used in our Node.js application. Models represent the structure and relationships of data in the database and are used in conjunction with the database management system (e.g., MongoDB or Mongoose) to perform CRUD (Create, Read, Update, Delete) operations on the data.

### Directory Structure

- `user.js`: This file defines the user model, which stores information about users in our application, such as usernames, hashed passwords, and other user-related information.

- `prototype.js`: Here, the prototype model is defined, representing prototype entries in our application. Each prototype entry has properties such as title and can be added other fields as author, URL.

### Usage

These models are used in other parts of the application, such as controllers and routes, to interact with the database. For example, when creating a new user or retrieving a list of blog entries, the corresponding models are used to perform queries and updates in the database.

Ensure that the models are properly configured, and the relationships between them are defined according to the needs of your application.

## Controllers

The "controllers" directory contains the controller functions responsible for handling requests, processing data, and managing the interaction with the database in our Node.js application. Controllers act as intermediaries between the routes and the models, implementing the application's logic and business rules.

### Directory Structure

- `userController.js`: This file contains controller functions related to user management, such as user registration, login, profile updates, and user-specific actions.

- `prototypeController.js`: Here, you'll find controller functions for managing prototype posts, including creating, reading, updating, and deleting prototype entries.

- `loginController.js`: This file houses controller functions responsible for user authentication and login processes. It handles user login requests, verifies user credentials, and issues authentication tokens when users successfully log in.

These controllers collectively manage different aspects of our application, ensuring that user-related actions, blog post operations, and authentication processes are handled efficiently and in accordance with our business logic.

If you'd like to contribute or make enhancements to any of these controllers, please ensure that your changes align with the application's business logic and follow best practices for structuring controller functions.

### Usage

Controllers play a crucial role in processing incoming HTTP requests, validating data, and invoking the appropriate model methods to interact with the database. They are designed to keep the route handlers clean and focused on routing, while business logic and data operations are encapsulated within the controllers.

For example, when a user submits a registration form, the user controller handles the validation of user data, hashes the password, and saves the user information to the database using the user model.

## Requests

The "requests" directory contains files that define different HTTP request configurations. These files contain different types of requests, such as GET, POST, PUT, or DELETE.

## Tests

The "tests" directory contains test suites and test cases used to verify the functionality and correctness of our Node.js application. Testing is a critical part of software development, and this directory is dedicated to organizing and running automated tests to ensure that our code behaves as expected.

### Directory Structure

- `user.test.js`: This file contains unit and integration tests for user-related functionality, such as user registration, login, profile updates, and user-specific actions.

- `prototype.test.js`: Here, you'll find test cases for the prototype-related functionality, covering scenarios like creating, reading, updating, and deleting prototype entries.

- `login.test.js`: This file includes tests for user authentication and login processes. It verifies that user login requests, credentials, and authentication tokens work correctly.

_Additional test files: Depending on the complexity of the application and the number of components, you may find additional test files for other parts of the codebase._

### Usage

Tests are essential for maintaining code quality and ensuring that new changes do not introduce regressions or break existing functionality. We use testing frameworks like Jest to automate the testing process and provide clear pass/fail results.

To run the tests, you can use the following command:

```
npm test
```

_This command will execute the test suites defined in the "tests" directory and provide detailed test reports, including any failing test cases._

The tests use the `supertest` library to simulate HTTP requests to the login controller and Jest for assertions, and also are execute in a test database to ensure that the tests run in an isolated enviroment.

## Utils

# Bugs

# Technologies Used

## Languages

- [Javascript](https://en.wikipedia.org/wiki/JavaScript)

## Libraries and Frameworks

- [Node.js](https://nodejs.org/) is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript code on the server side and is commonly used for building scalable network applications.
- [Express.js](https://expressjs.com/) is a fast, unopinionated, and minimalist web framework for Node.js. It simplifies the process of building robust and scalable web applications and APIs.
- [Nodemon](https://nodemon.io/) is a utility that monitors for changes in your Node.js applications and automatically restarts the server when changes are detected. It's commonly used during development to streamline the development process.
- [CORS](https://expressjs.com/en/resources/middleware/cors.html) (Cross-Origin Resource Sharing) is a Node.js middleware that enables secure cross-origin communication in web applications. It allows you to define which domains are allowed to access your server resources.
- [Mongoose](https://mongoosejs.com/) is an Object Data Modeling (ODM) library for MongoDB and Node.js. It simplifies the interaction with MongoDB databases by providing a schema-based solution for data modeling.
- [dotenv](https://github.com/motdotla/dotenv) is a zero-dependency module that loads environment variables from a .env file into the process.env object. It's commonly used to manage configuration settings in Node.js applications.
- [ESLint](https://eslint.org/) is a popular linting tool for JavaScript that helps developers find and fix problems in their code. It enforces coding standards and best practices to ensure code quality.
- [Jest](https://jestjs.io/) is a JavaScript testing framework that makes it easy to write unit and integration tests for your code. It provides a simple and powerful API for testing JavaScript applications.
- [cross-env](https://github.com/kentcdodds/cross-env) is a command-line tool that allows you to set environment variables in a cross-platform way. It's often used in npm scripts to ensure consistent behavior across different operating systems.
- [Supertest](https://github.com/visionmedia/supertest) is a library for testing HTTP assertions in Node.js applications. It allows you to make HTTP requests and assert the responses to ensure that your API endpoints work as expected.
- [express-async-errors](https://www.npmjs.com/package/express-async-errors) is a middleware for Express.js that simplifies error handling in asynchronous routes. It allows you to throw errors in asynchronous code, and it will automatically handle them and send an appropriate response.
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) is a library for hashing passwords securely in Node.js. It uses the bcrypt hashing algorithm to store and verify password hashes, making it a common choice for user authentication.
- [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator) is a plugin for Mongoose that provides additional validation for unique fields in MongoDB documents. It ensures that fields marked as unique are not duplicated in the database.
- [jsonwebtoken](https://jwt.io/) JSON Web Tokens (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. In Node.js, the jsonwebtoken library is commonly used to create and verify JWTs for user authentication and authorization.

_The version used in every library can be seen [here](package.json) in the package.json file._

## Other Tools

- [GitHub](https://github.com/) - Used to host and deploy the website as well as manage the project.
- [render](https://render.com/) - Used to deploy the website
- [MongoDB](https://www.mongodb.com/) - An open-source database based in document

# Development

This site was made using [Visual Studio Code](https://code.visualstudio.com/) & [GitHub](). The site was further developed using [NodeJS](https://nodejs.org/).

## GitHub

### Fork a repository

A fork is a copy of a repository. Forking a repository allows you to freely experiment with changes without affecting the original project. The steps are as follows:

1. On GitHub.com navigate to the repository page.
2. In the top-right corner of the page, click **Fork**.

![GitHub Fork](docs/deploy/deploy-github-fork.png)

You can fork a repository to create a copy of the repository and make changes without affecting the upstream repository.

### Clone the repository

In GitHub, you have the option to create a local copy (clone) of your repository on your device's hard drive. The steps are as follows:

1. On GitHub.com navigate to the repository page.
2. Locate the _Code_ tab and click on it.
3. In the expanded window, click the two squares icon to copy the HTTPS link of the repository.

![GitHub Clone](docs/deploy/deploy-github-clone.png)

_If you use a online dev IDE integrated in github as gitpod or codeanywhere, you can click on it and open the IDE to do changes_

4. On your computer, open **Terminal**.
5. Navigate to the directory of choice (`cd <path-of-dev>`).
6. Type `git clone https://github.com/patchamama/`
7. Press **Enter** and the local clone of the repository will be created in the selected directory.

## Local computer

_(if you prefere a online IDE as gitpod or codeanywhere you can open it and open the terminal included)_

### Open the IDE of your preference in the terminal

If you prefere `Visual Studio Code` (vscode):

```
code .
```

### Install the dependencies

_In this project `npm` has been used as package manager, but you are free to use another package manager such as `pnpm` because of its popularity and speed._

```
npm install
npm start
```

### Create .env configuration file

```
MONGODB_URI='mongodb+srv://username:password@url.mongodb.net/prototype?retryWrites=true&w=majority'

TEST_MONGODB_URI='mongodb+srv://username:password@url.mongodb.net/test-prototype?retryWrites=true&w=majority'

SECRET='your-secret-key-for-testing-purposes-only'

PORT=3003
```

_You are free to register at [mongoDB Atlas](https://www.mongodb.com/atlas/database) and paste the login URL provided after creating the username and password._

### Execute in Dev:

```
npm run dev
```

### Open the browser on the port 3003

- Users: [http://locahost:3003/api/users](http://locahost:3003/api/users)
- Prototype: [http://locahost:3003/api/prototypes](http://locahost:3003/api/prototypes)

## Adding users

_You must install in vscode or another similar IDE the plugin: `REST Client` to be able to carry out these steps._
_Modify `requests\add_new_user.rest` to add the users you want. For instance (to add username `root` and `password` test):_

<pre>
POST http://localhost:3003/api/users
Content-Type: application/json

{
  "username": "root",
  "name": "Superuser",
  "password": "test",
  "email": "myemail@email.com"
}
</pre>

_Above POST there should be a `send request` option that would allow you to execute the add action._

## Customise the prototype model

_Modify the prototype to change the example field `title` and/or add new fields. To do this, the [models/prototype.js](models/prototype.js) file must be modified._

## Customise the prototype controller

_Manage the behaviour of data insertions (post) and updates (put) in the api. . To do this, the [controllers/prototypes.js](controllers/prototypes.js) file must be modified._

## Modify routing

_To change the default path [http://localhost:3003/prototypes](http://localhost:3003/prototypes) to a desired path, you would have to change the [apps.js](apps.js) file and change `prototypes` to the new desired path, e.g. if you want to change to `blogs`, it would look like this:_

`app.use('/api/prototypes', prototypesRouter)`

change to:

`app.use('/api/blogs', prototypesRouter)`

## Customise also file names

_If you do not want to use the word `prototypes` in the name of files (model, controllers) and references, you must manually rename the files and change the references to them, such as:_

`const Prototype = require('../models/prototype')`

I would recommend (if you want to change to `blog` for example):

1. Change the file names to a single new desired name, e.g. blog.
2. Open all files and replace (it is casesensitive):

- `Prototype` to `Blog`
- `prototype` to `blog`

## Perform CRUD operations on the new prototype

# Testing

```
npm test
```

# Deploy

# Contribution

If you wish to contribute or make changes to existing models or controllers, ensure you follow best data modeling practices and conduct thorough testing to ensure changes do not adversely affect other parts of the application.

# Credits

- The idea came to me while I was doing the [exercises](https://github.com/patchamama/fullstackopen-part4-bloglist) of the fourth module: `Testing Express servers, user administration` of the Full Stack open cours: Deep Dive Into Modern Web Development - https://fullstackopen.com/en/
