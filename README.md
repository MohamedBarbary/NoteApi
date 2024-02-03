# NoteApi

Simple Backend is a Node.js server using Express and MongoDB (with Mongoose) that follows the MVC architecture. It provides user authentication features such as sign up, login, forgot password, reset password, and a note API with functionalities to add, delete, and update notes.


## Features

### 1. Sign Up
Users can create a new account by providing their email and password. The user information is stored securely in the MongoDB database.
**Email Verification:** After successful signup, users receive a verification email containing a unique token. Clicking the verification link verifies the user's email address.

### 2. Login
Registered users can log in to their accounts using their email and password. Upon successful login, a JWT (JSON Web Token) is generated for authentication.

### 3. Forgot Password & Reset Password
In case users forget their password, they can request a password reset. A unique reset token is sent to their email, allowing them to reset their password securely.
then Users can reset their password by providing the reset token received via email. The server verifies the token's validity before allowing users to update their password.

### 4. Note (CRUD)
After logging in, users can interact with the Note API, which includes the following functionalities:
- Add new notes
- Delete existing notes
- Update/edit notes

### 5. Advanced Error Handling
Controllers in this project utilize an advanced error handling approach using an `AppError` class. This allows for more structured and informative error messages, making it easier to handle and debug issues .

## How to Use


1. **Clone Repository**
   - Clone this repository to your local machine.

2. **Install Dependencies**
   - Run `npm install` to install the required dependencies.

3. **Environment Variables**
   - Create a `.env` file 

4. **Run the Server**
   - Start the server by running `npm start`.
     

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- ejs


