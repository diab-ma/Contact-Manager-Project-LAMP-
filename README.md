# Contact-Manager-Project-LAMP

# Database Structure

## Overview
This LAMP stack application uses a simple relational database with two main entities: **Users** and **Contacts**, connected through a one-to-many relationship.

## Database Schema

### User Table
The User entity stores authentication and basic user information:
- **ID**: Primary key (unique identifier)
- **UserID**: Secondary identifier 
- **Password**: User authentication credential
- **Login**: Username/login identifier
- **FirstName**: User's first name
- **LastName**: User's last name

### Contacts Table
The Contacts entity stores contact information for each user:
- **ID**: Primary key (unique identifier)
- **FirstName**: Contact's first name
- **LastName**: Contact's last name
- **Email**: Contact's email address
- **Phone**: Contact's phone number

## Relationships
- **One-to-Many**: Each User can have multiple Contacts

## Functionality
This database structure supports a contact management system where:
1. Users can register and authenticate with login credentials
2. Each authenticated user can store and manage their personal contacts
3. Contact information includes standard communication details (name, email, phone)
4. Data isolation ensures users can only access their own contact lists


# API Structure

## Overview
Contact Manager is a secure, responsive LAMP stack web application that allows users to manage personal contacts through a modern interface backed by a RESTful API. Users can register, log in, and perform full CRUD operations (Create, Read, Update, Delete) on their contact list. Each user's data is securely isolated and managed using a MySQL relational database with stored procedures.

The backend API is built using PHP and communicates via JSON, while the frontend uses AJAX for real-time interactions. Pagination is supported to ensure performance with large datasets. API endpoints are documented using SwaggerHub, and best practices for authentication, error handling, and input validation are followed. This project showcases professional full-stack development aligned with modern software engineering standards.



## API Endpoints Example
Login – Login.php
Method: POST or SwaggerHub

## Description: 
Authenticates a user by login and password.

## Request Body:


{
  "login": "ROGER1",
  "password": "ROGER"
}
## Response:

{
  "id": 43,
  "firstName": "ROGER1",
  "lastName": "BOGGER",
  "error": ""
}

Register User – RegisterUser.php
Method: POST or Swaggerhub

## Description: 
Registers a new user in the system.

## Request Body:
{
  "firstName": "ROGER43",
  "lastName": "BOGGER",
  "login": "ROGER12",
  "password": "BOGGER2"
}

## Response:
{
  "id": 53,
  "firstName": "ROGER43",
  "lastName": "BOGGER",
  "error": ""
}

# Notes
All responses use Content-Type: application/json

All endpoints are designed for AJAX calls

CORS headers are enabled for cross-origin requests

SwaggerHub documentation is available for API testing and demonstration

