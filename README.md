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


