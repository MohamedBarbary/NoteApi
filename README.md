# Note API

A Node.js server using Express and MongoDB (with Mongoose) that follows the MVC (Model-View-Controller) architecture. It provides user authentication features such as sign up, login, forgot password, reset password, and a note API with functionalities to add, delete, and update notes.

## Features

1. **Sign Up**: Users can create a new account by providing their email and password. The user information is stored securely in the MongoDB database.
   
2. **Login**: Registered users can log in to their accounts using their email and password. Upon successful login, a JWT (JSON Web Token) is generated for authentication.
   
3. **Forgot Password**: In case users forget their password, they can request a password reset. A unique reset token is sent to their email, allowing them to reset their password securely.
   
4. **Reset Password**: Users can reset their password by providing the reset token received via email. The server verifies the token's validity before allowing users to update their password.
   
5. **Note API**: After logging in, users can interact with the Note API, which includes functionalities to add, delete, and update notes.

## MVC Architecture

The project follows the MVC architecture to organize code into three main components:

1. **Models**: Models represent the data structure and business logic of the application. User and Note models handle the database schema and interactions.
   
2. **Views**: Views are responsible for rendering the data and presenting it to the user. In this backend, views may include responses sent to the client.
   
3. **Controllers and Advanced Error Handling**: Controllers in this project utilize an advanced error handling approach using an `AppError` class. This allows for more structured and informative error messages, making it easier to handle and debug issues.

## How to Use

Follow these steps to set up and use the Simple Backend:

1. **Clone Repository**: Clone this repository to your local machine.
   
2. **Install Dependencies**: Run `npm install` to install the required dependencies.
   
3. # Environment Variables
         Mongo_Atlas=
         JWT_SECRET=
         JWT_EXPIRES_IN=
         JWT_COOKIE_EXPIRES_IN=
         App_Password=
         Sender=
         USER_VERIFICATION_TOKEN_SECRET=
         PORT=
         NODE_ENV=



4. **Run the Server**: Start the server by running `npm start`.

5. **API Endpoints**: Explore the following API endpoints:
- Sign Up: `POST /api/users/signup`
- Login: `POST /api/users/login`
- Forgot Password: `POST /api/users/forgot-password`
- Reset Password: `POST /api/users/reset-password`
- Note API:
  - Add Note: `POST /api/notes`
  - Delete Note: `DELETE /api/notes/:id`
  - Update Note: `PUT /api/notes/:id`

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
  
## Frontend: [Link to Frontend Repository](https://github.com/MohamedBarbary/NoteApi)


