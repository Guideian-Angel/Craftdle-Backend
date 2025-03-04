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

1. **Obtain the .env file** – Request it from an existing developer.
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Apply database migrations:**
   ```sh
   npx prisma db push
   ```
4. **Load seed data:**
   ```sh
   npm run seed
   ```
5. **Start in development mode:**
   ```sh
   npm run start:dev
   ```
6. **Start in production mode:**
   ```sh
   npm start
   ```

## Environment Variables
The application requires the following environment variables to be set in a `.env` file:

- `DATABASE_URL` – Connection string for MySQL database  
- `BACKENDURL` – Base URL of the backend server  
- `ENCRYPTION_KEY` – Key used for encryption  
- `GMAILADDRESS` – Email address for outgoing emails  
- `GMAILPASSWORD` – Password for Gmail integration  

A `.env` file should be obtained from an existing developer.