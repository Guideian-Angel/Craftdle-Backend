# Craftdle Backend

## Description
The Craftdle backend powers the game's core functionalities, handling user authentication, game state management, and real-time multiplayer interactions using WebSockets. It ensures secure data storage and communication between players and the server.

## Technologies
- **Nest.js** – Backend framework
- **Prisma** – ORM for database management
- **MySQL** – Relational database
- **Socket.io** – Real-time communication
- **bcrypt** – Password hashing

## Installation & Running

1. **Obtain the `.env` file**
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Generate Prisma client:**
   ```sh
   npm run prisma:generate
   ```
4. **Apply database migrations:**
   ```sh
   npx prisma db push
   ```
5. **Load seed data:**
   ```sh
   npx prisma db seed
   ```
   - During the seeding process, you will be prompted to create an admin user. Follow the instructions to provide the admin's username, email, and password. If you choose not to create an admin, the process will skip this step.

6. **Start the application:**
   - Development mode:
     ```sh
     npm run start:dev
     ```
   - Production mode:
     ```sh
     npm run start:prod
     ```

## Available Scripts

The following scripts are available in the `package.json`:

- `npm run prisma:generate` – Generate Prisma client
- `npm run prisma:push` – Apply database migrations
- `npm run seed` – Seed the database
- `npm run build` – Build the application
- `npm run format` – Format code using Prettier
- `npm run start` – Start the application
- `npm run start:dev` – Start the application in development mode
- `npm run start:debug` – Start the application in debug mode
- `npm run start:prod` – Start the application in production mode
- `npm run lint` – Run ESLint and fix issues
- `npm run test` – Run unit tests
- `npm run test:watch` – Run unit tests in watch mode
- `npm run test:cov` – Run tests with coverage
- `npm run test:debug` – Debug tests
- `npm run test:e2e` – Run end-to-end tests

## Access API Documentation
   The Swagger API documentation is available at: `<backend-url>/api`

   Replace `<backend-url>` with the actual backend URL (e.g., `http://localhost:3000/api` for local development).

## Environment Variables
The application requires the following environment variables to be set in a `.env` file:

- `DATABASE_URL` – Connection string for MySQL database
- `BACKENDURL` – Base URL of the backend server
- `ENCRYPTION_KEY` – Key used for encryption
- `GMAILADDRESS` – Email address for outgoing emails
- `GMAILPASSWORD` – App password for Gmail

#### Obtain Gmail Password
Follow the instructions at [Google Support](https://support.google.com/mail/answer/185833) to generate an app password for Gmail.

### Note on Password Reset Functionality
The password reset functionality has limitations when running on `localhost`:
- Images in the email cannot load because Gmail cannot access `localhost`.
- The functionality only works if the email is accessed on the same machine where the server is running.