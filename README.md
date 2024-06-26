# Node.js Express TypeScript Starter Kit

A starter kit for building REST APIs using Node.js, Express.js, and TypeScript.

## Table of Contents

-   [Introduction](#introduction)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Scripts](#scripts)
-   [Project Structure](#project-structure)
-   [Configuration](#configuration)
-   [Environment Variables](#environment-variables)
-   [Contributing](#contributing)
-   [License](#license)

## Introduction

This is a starter kit for building REST APIs using Node.js, Express.js, and TypeScript. It includes several essential tools and libraries to help you quickly set up and develop your API.

## Prerequisites

-   Node.js ^18.18.1
-   npm ^9.8.1

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/mapleDevJS/nodejs-expressjs-ts-starter-kit.git
    ```

2. Navigate to the project directory:

    ```bash
    cd nodejs-expressjs-ts-starter-kit
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Usage

### Starting the Development Server

To start the development server with hot-reloading:

```bash
npm run start:dev
```

### Building the Project

To build the project:

```bash
npm run build
```

### Cleaning the Build Directory

To clean the `dist` directory:

```bash
npm run clean
```

### Running the Production Server

After building the project, you can start the production server:

```bash
npm run start
```

### Running the Mock Server

To start the mock server using `json-server`:

```bash
npm run mock:server
```

## Scripts

-   `start`: Builds the project and starts the production server.
-   `start:dev`: Starts the development server with hot-reloading.
-   `build`: Cleans the `dist` directory and compiles TypeScript to JavaScript.
-   `clean`: Removes the `dist` directory.
-   `compile`: Compiles TypeScript files using `tsc`.
-   `lint`: Lints the `src` directory using ESLint.
-   `lint:fix`: Automatically fixes linting issues in the `src` directory.
-   `format`: Checks code formatting using Prettier.
-   `format:fix`: Fixes code formatting issues using Prettier.
-   `ts`: Runs `ts-node`.
-   `cli`: Runs the CLI application.
-   `mock:server`: Starts a mock server using `json-server`.

## Project Structure

```plaintext
nodejs-expressjs-ts-starter-kit/
├── dist/                     # Compiled JavaScript files
├── src/                      # TypeScript source files
│   ├── controllers/          # Controllers
│   ├── models/               # Models
│   ├── routes/               # Express routes
│   ├── services/             # Services
│   ├── utils/                # Utility functions
│   └── main.ts               # Entry point of the application
├── mocks/                    # Mock data for JSON server
│   └── mock-server-data.json # Mock server data
├── .eslintrc.js              # ESLint configuration
├── .prettierrc               # Prettier configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # NPM configuration and scripts
└── README.md                 # Project documentation
```

## Configuration

-   **ESLint**: `.eslintrc.js`
-   **Prettier**: `.prettierrc`
-   **TypeScript**: `tsconfig.json`
-   **NPM**: `package.json`

## Environment Variables

To set up environment variables, create a `.env` file in the root of your project and add the required variables. For example:

```plaintext
DB_CONNECTION_STRING=your_database_connection_string
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs, enhancements, or features.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
