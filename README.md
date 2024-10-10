# API Documentation: User and Meal Management

## Overview

This API allows the creation and management of users, along with meal tracking to help monitor their diet. Users can register meals, update or delete them, and retrieve dietary metrics to keep track of their progress. This API is built with NodeJS using the Fastify framework, and includes validation, testing, and a database for persistent storage.

## Features

- **User Management**: Create and list users.
- **Meal Management**: Register, update, delete, and list meals for each user.
- **Dietary Metrics**: Get detailed metrics on the meals consumed to assist in diet control.

## API Endpoints

### Users

#### Create User
- **Path**: `/users`
- **Method**: `POST`
- **Description**: Creates a new user.
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string"
  }
  ```
- **Response**: Returns the newly created user object.

#### List Users
- **Path**: `/users`
- **Method**: `GET`
- **Description**: Retrieves a list of all registered users.
- **Response**: Returns an array of user objects.

### Meals

#### Create Meal
- **Path**: `/meals`
- **Method**: `POST`
- **Description**: Registers a meal for a user.
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "date": "YYYY-MM-DD",
    "time": "00:00:00",
    "on_diet": "boolean"
  }
  ```
- **Response**: Returns the created meal object.

#### List Meals
- **Path**: `/meals`
- **Method**: `GET`
- **Description**: Retrieves all meals registered in the system.
- **Response**: Returns an array of meal objects.

#### Update Meal
- **Path**: `/meals/:id`
- **Method**: `PUT`
- **Description**: Updates the details of a meal.
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "date": "YYYY-MM-DD",
    "time": "00:00:00",
    "on_diet": "boolean"
  }
  ```
- **Response**: Returns the updated meal object.

#### Delete Meal
- **Path**: `/meals/:id`
- **Method**: `DELETE`
- **Description**: Deletes a meal from the database.
- **Response**: Returns a success message or error if the meal does not exist.

### Metrics

#### Get Meal Metrics
- **Path**: `/meals/metrics`
- **Method**: `GET`
- **Description**: Retrieves dietary metrics for meals (e.g., total calories, average calorie intake per day, etc.).
- **Response**: Returns an object with various metrics based on the registered meals.

## Technologies Used

- **NodeJS**: JavaScript runtime used for building the backend API.
- **Fastify**: Web framework for handling HTTP requests and routing.
- **TypeScript**: Typed superset of JavaScript used for maintaining type safety.
- **Vitest**: Testing framework for unit and integration testing.
- **Supertest**: Library for testing HTTP endpoints.
- **Knex**: SQL query builder for managing database interactions.
- **SQLite**: Lightweight database used for data storage.
- **Zod**: Schema validation library for validating request inputs.
- **Tsup**: TypeScript bundler used to compile the application.

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone <repo_url>
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Database setup**: 
   This API uses SQLite as the database. Migrations are managed through Knex.

4. **Run Migrations**:
   ```bash
   yarn knex migrate:latest
   ```

5. **Run the API**:
   ```bash
   yarn dev
   ```

6. **Testing**:
   To run tests:
   ```bash
   yarn test
   ```

## Validations

- **User Input Validation**: All input data is validated using the Zod library, ensuring the correctness of data before processing.
  
## Building the Project

To build the project for production, use:
```bash
yarn build
```
Tsup will bundle and compile the TypeScript code into JavaScript for deployment.

---

This API provides a simple and efficient way to manage users and track their dietary habits through meal logging and metrics collection.