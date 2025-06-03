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

## API Documentation
## API Documentation

The OpenAPI specification is available in [`api-specs/swagger.yaml`](api-specs/swagger.yaml). You can also view and test it on [SwaggerHub](https://app.swaggerhub.com/apis/contactmanagerapi/ContactManagerAPI/1.0.0#/).


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

## Frontend (User Interface)

The frontend of "The Contact Barista" provides an interactive and responsive user experience for managing personal contacts. It is built using standard web technologies and communicates with the backend LAMP API via asynchronous JavaScript (AJAX) calls.

### Key Features & Functionality:

* **User Authentication:**
    * Secure and user-friendly forms for **Login** (`index.html`) and **Registration** (`register.html`).
    * Client-side validation provides immediate feedback to the user.
* **Contact Management Dashboard (`contacts.html`):**
    * **Dynamic Contact Display:** Contacts are fetched and displayed dynamically.
    * **CRUD Operations:** Users can Create, Read, Update, and Delete contacts seamlessly using AJAX.
    * **Search Functionality:** A real-time search filters contacts by name, phone, or email
    * **Results Count:** Displays the number of contacts found or total contacts.
* **Responsive Design:**
    * Fully responsive layout that adapts to different screen sizes (desktop, tablets, and mobile phones) using CSS3 media queries.
* **User Experience (UX) Enhancements:**
    * **Modal Dialogs:** Used for creating new contacts, editing existing ones, and confirming deletions, providing a focused user workflow.
    * **Notifications:** Clear success and error messages are displayed to the user for various actions.
    * **Loading States & Empty States:** Visual cues like loading spinners and "no contacts found" messages improve the perceived performance and user understanding.
    * **Session Management:** User session is managed using cookies, and an auto-logout feature is implemented after a period of inactivity.

### Technologies Used:

* **HTML5:** For structuring the web pages.
* **CSS3:** For styling, layout, responsiveness, and the custom "Contact Barista" theme (`css/styles.css`).
* **JavaScript (Vanilla):** Core logic for user interactions, DOM manipulation, client-side validation, and API communication (`js/code.js`).
* **MD5.js:** Included in the project (`js/md5.js`). (Primary password hashing for authentication is securely handled server-side by the PHP API.)

### File Structure:

* `index.html`: The login page for existing users.
* `register.html`: The registration page for new users.
* `contacts.html`: The main dashboard page where users manage their contacts after logging in.
* `css/styles.css`: Contains all custom CSS rules, including theming, layout, and responsive design adjustments.
* `js/code.js`: The primary JavaScript file responsible for all client-side logic, including API interactions, event handling, DOM updates, and user experience enhancements.
* `js/md5.js`: A library for MD5 hashing.

### API Interaction:

The frontend uses `XMLHttpRequest` (AJAX) to asynchronously communicate with the backend PHP API endpoints. Data is exchanged in JSON format. All necessary API endpoints as defined in the [SwaggerHub documentation](https://app.swaggerhub.com/apis/contactmanagerapi/ContactManagerAPI/1.0.0#/) (e.g., `Login.php`, `Register.php`, `SearchContacts.php`, `RegisterContact.php`, `UpdateContact.php`, `DeleteContact.php`) are consumed to provide the full range of application features.


