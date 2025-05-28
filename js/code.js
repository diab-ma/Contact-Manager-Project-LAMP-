const urlBase = 'majorregrets.com';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginUsername").value; // Corrected from loginName to loginUsername to match index.html
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password ); // md5 hashing is commented out, ensure consistency with backend if re-enabled
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html"; // Changed from color.html to contacts.html as per common app flow
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister() {
    const firstName = document.getElementById("registerFirstName").value;
    const lastName = document.getElementById("registerLastName").value;
    const login = document.getElementById("registerUsername").value; // 'login' is the key Register.php expects for username
    const email = document.getElementById("registerEmail").value; // Currently not used by Register.php or Users table
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;

    const registerResult = document.getElementById("registerResult");
    registerResult.innerHTML = ""; // Clear previous messages

    // Basic client-side validation
    if (!firstName || !lastName || !login || !password || !confirmPassword) {
        registerResult.innerHTML = "Please fill in all fields.";
        return;
    }

    if (password !== confirmPassword) {
        registerResult.innerHTML = "Passwords do not match.";
        return;
    }

    const payload = {
        firstName: firstName,
        lastName: lastName,
        login: login,
        password: password
        // email is not sent as Register.php doesn't handle it.
    };
    const jsonPayload = JSON.stringify(payload);

    const url = urlBase + '/Register.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) { // Check if request is complete
                if (this.status == 200) { // Check if request was successful
                    try {
                        const jsonObject = JSON.parse(xhr.responseText);
                        if (jsonObject.error && jsonObject.error !== "") {
                             // Display error from PHP script if any
                            registerResult.innerHTML = jsonObject.error;
                        } else if (jsonObject.message) {
                             // Display success message from PHP script
                            registerResult.innerHTML = jsonObject.message + (jsonObject.id ? " Your ID is " + jsonObject.id + "." : "");
                            // Optionally, redirect to login page or clear form
                            // document.getElementById("registerForm").reset();
                            // setTimeout(() => { window.location.href = "index.html"; }, 2000);
                        } else {
                            registerResult.innerHTML = "Registration successful, but no specific message received.";
                        }
                    } catch (e) {
                        registerResult.innerHTML = "Error parsing server response.";
                        console.error("Response parsing error:", xhr.responseText);
                    }
                } else {
                    // Handle HTTP errors (e.g., 400, 409, 500)
                    let errorMessage = "Registration request failed. Status: " + this.status;
                     try {
                        const errorObject = JSON.parse(xhr.responseText);
                        if (errorObject.error) {
                            errorMessage = errorObject.error; // Use error message from PHP if available
                        }
                    } catch (e) {
                        // Response might not be JSON, use default error message
                        console.error("Error parsing error response:", xhr.responseText);
                    }
                    registerResult.innerHTML = errorMessage;
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        registerResult.innerHTML = "An error occurred: " + err.message;
    }
}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString() + ";path=/"; // Added path=/
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	// This logic seems to be for pages that require login.
	// For index.html or register.html, this might redirect unnecessarily if a cookie exists.
	// We'll assume this is primarily for pages like contacts.html.
	const currentPage = window.location.pathname.split("/").pop();
	if (userId < 0 && currentPage !== "index.html" && currentPage !== "register.html" && currentPage !== "") {
		window.location.href = "index.html";
	} else if (userId > 0 && (currentPage === "index.html" || currentPage === "register.html" || currentPage === "")) {
        // If logged in and on login/register page, redirect to contacts
        // window.location.href = "contacts.html"; // This might be too aggressive, user might want to see the page.
    }
    
    // Update userName element if it exists (e.g., on contacts.html)
    const userNameElement = document.getElementById("userName");
    if (userNameElement && userId > 0) {
		userNameElement.innerHTML = "Brewing for: " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"; // More robust cookie clearing
    document.cookie = "lastName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "userId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	window.location.href = "index.html";
}

// The addColor and searchColor functions are specific to a different functionality
// and are not directly related to the registration fix. I'll leave them as they are.
function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId}; // Note: userId is sent twice here.
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				// Assuming results are an array of strings
				if (jsonObject.results && Array.isArray(jsonObject.results)) {
				    colorList = jsonObject.results.join("<br />\r\n");
				}
				
				// This line seems to target a <p> tag, ensure it's the correct one.
				// If you have a specific element for results, use its ID.
				const searchResultDisplay = document.getElementById("actualColorListPlaceholder"); // Example ID
				if (searchResultDisplay) {
				    searchResultDisplay.innerHTML = colorList;
				} else {
				    // Fallback or default behavior if the specific placeholder isn't found
				    const paragraphs = document.getElementsByTagName("p");
                    if (paragraphs.length > 0) {
                       // This might overwrite an unintended paragraph if not careful
                       // paragraphs[0].innerHTML = colorList;
                       console.warn("Target paragraph for searchColor results not specifically identified. Results logged instead.");
                       console.log("Search results:", colorList);
                    }
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

// Functions for Contact Management (Dashboard - contacts.html)
// Ensure `urlBase` and `userId` are accessible.

function searchContacts() {
    const searchText = document.getElementById("searchText").value;
    const contactListDiv = document.getElementById("contactList");
    const searchStatus = document.getElementById("searchStatus");
    contactListDiv.innerHTML = ""; // Clear previous results
    searchStatus.innerHTML = "Searching...";

    const payload = {
        userId: userId,
        search: searchText
    };
    const jsonPayload = JSON.stringify(payload);
    const url = urlBase + '/SearchContacts.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    const jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error && jsonObject.error !== "No Records Found") { // Allow "No Records Found" to be handled as empty results
                        searchStatus.innerHTML = "Error: " + jsonObject.error;
                        contactListDiv.innerHTML = "";
                    } else if (jsonObject.results && jsonObject.results.length > 0) {
                        searchStatus.innerHTML = ""; // Clear searching message
                        jsonObject.results.forEach(contact => {
                            const card = `
                                <div class="contact-card">
                                    <h3>${contact.FirstName} ${contact.LastName} <span class="contact-id">(ID: ${contact.ID})</span></h3>
                                    <p><i class="fas fa-phone"></i> ${contact.Phone || 'N/A'}</p>
                                    <p><i class="fas fa-envelope"></i> ${contact.Email || 'N/A'}</p>
                                    <div class="contact-actions">
                                        <button class="btn btn-icon btn-edit" onclick="openEditContactModal(${contact.ID}, '${contact.FirstName}', '${contact.LastName}', '${contact.Phone || ''}', '${contact.Email || ''}')"><i class="fas fa-pencil-alt"></i> Edit</button>
                                        <button class="btn btn-icon btn-delete" onclick="confirmDeleteContact(${contact.ID}, '${contact.FirstName} ${contact.LastName}')"><i class="fas fa-trash-alt"></i> Delete</button>
                                    </div>
                                </div>`;
                            contactListDiv.innerHTML += card;
                        });
                    } else {
                        searchStatus.innerHTML = "No contacts found matching your search.";
                        contactListDiv.innerHTML = "";
                    }
                } else {
                    searchStatus.innerHTML = "Failed to search contacts. Status: " + this.status;
                     contactListDiv.innerHTML = "";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        searchStatus.innerHTML = "Search error: " + err.message;
        contactListDiv.innerHTML = "";
    }
}


function handleSaveContact() {
    const contactId = document.getElementById("contactId").value;
    const firstName = document.getElementById("contactFirstName").value;
    const lastName = document.getElementById("contactLastName").value;
    const phone = document.getElementById("contactPhone").value;
    const email = document.getElementById("contactEmail").value;
    const modalFormMessage = document.getElementById("modalFormMessage");

    modalFormMessage.innerHTML = "";

    if (!firstName || !lastName) {
        modalFormMessage.innerHTML = "First name and last name are required.";
        modalFormMessage.className = "form-message error";
        return;
    }

    const payload = {
        userId: userId, // Assumes userId is globally available and set after login
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email
    };

    let url;
    if (contactId) { // If contactId exists, it's an update
        payload.id = contactId; // Or whatever Update API expects for the contact's ID
        url = urlBase + '/UpdateContact.' + extension; // Assuming UpdateContact.php
    } else { // Otherwise, it's a new contact
        url = urlBase + '/RegisterContact.' + extension; // Existing RegisterContact.php
    }
    
    const jsonPayload = JSON.stringify(payload);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                modalFormMessage.className = "form-message"; // Reset class
                if (this.status == 200) {
                    const jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error && jsonObject.error !== "") {
                        modalFormMessage.innerHTML = "Error: " + jsonObject.error;
                        modalFormMessage.className = "form-message error";
                    } else {
                        modalFormMessage.innerHTML = contactId ? "Contact updated successfully!" : "Contact added successfully!";
                        modalFormMessage.className = "form-message success";
                        closeContactModal();
                        searchContacts(); // Refresh the contact list
                    }
                } else {
                    modalFormMessage.innerHTML = "Request failed. Status: " + this.status;
                    modalFormMessage.className = "form-message error";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        modalFormMessage.innerHTML = "An error occurred: " + err.message;
        modalFormMessage.className = "form-message error";
    }
}

function openAddContactModal() {
    document.getElementById("modalTitle").innerText = "Add New Blend";
    document.getElementById("contactForm").reset();
    document.getElementById("contactId").value = ""; // Ensure contactId is empty for new contacts
    document.getElementById("modalFormMessage").innerHTML = "";
    document.getElementById("modalFormMessage").className = "form-message"; // Reset class
    document.getElementById("contactModal").style.display = "flex";
}

function openEditContactModal(id, firstName, lastName, phone, email) {
    document.getElementById("modalTitle").innerText = "Edit This Blend";
    document.getElementById("contactId").value = id;
    document.getElementById("contactFirstName").value = firstName;
    document.getElementById("contactLastName").value = lastName;
    document.getElementById("contactPhone").value = phone;
    document.getElementById("contactEmail").value = email;
    document.getElementById("modalFormMessage").innerHTML = "";
    document.getElementById("modalFormMessage").className = "form-message";
    document.getElementById("contactModal").style.display = "flex";
}

function closeContactModal() {
    document.getElementById("contactModal").style.display = "none";
}

function confirmDeleteContact(contactId, contactName) {
    const deleteConfirmMessage = document.getElementById("deleteConfirmMessage");
    deleteConfirmMessage.innerHTML = `Are you sure you want to archive the blend for "<strong>${contactName}</strong>"? This action cannot be undone.`;
    
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    // Clone and replace the button to remove old event listeners
    const newConfirmDeleteButton = confirmDeleteButton.cloneNode(true);
    confirmDeleteButton.parentNode.replaceChild(newConfirmDeleteButton, confirmDeleteButton);
    
    newConfirmDeleteButton.onclick = function() { 
        deleteContact(contactId); 
    };
    
    document.getElementById("deleteConfirmModal").style.display = "flex";
}


function deleteContact(contactId) {
    const contactOpStatus = document.getElementById("contactOpStatus"); // For general status messages on the dashboard
    contactOpStatus.innerHTML = "";

    const payload = {
        id: contactId, // Assuming Delete API expects the contact's ID
        userId: userId  // Include userId if API requires it for deletion validation
    };
    const jsonPayload = JSON.stringify(payload);
    const url = urlBase + '/DeleteContact.' + extension; // Assuming DeleteContact.php

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true); // Or "DELETE" if API is set up for that verb
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                 contactOpStatus.className = "form-message";
                if (this.status == 200) {
                    const jsonObject = JSON.parse(xhr.responseText);
                     if (jsonObject.error && jsonObject.error !== "") {
                        contactOpStatus.innerHTML = "Error deleting contact: " + jsonObject.error;
                        contactOpStatus.className = "form-message error";
                    } else {
                        contactOpStatus.innerHTML = "Contact archived successfully!";
                        contactOpStatus.className = "form-message success";
                        searchContacts(); // Refresh contact list
                    }
                } else {
                    contactOpStatus.innerHTML = "Failed to delete contact. Status: " + this.status;
                    contactOpStatus.className = "form-message error";
                }
                closeDeleteConfirmModal();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        contactOpStatus.innerHTML = "Delete error: " + err.message;
        contactOpStatus.className = "form-message error";
        closeDeleteConfirmModal();
    }
}

function closeDeleteConfirmModal() {
    document.getElementById("deleteConfirmModal").style.display = "none";
}