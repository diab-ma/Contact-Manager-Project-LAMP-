const urlBase = 'https://majorregrets.com/LAMPAPI/';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginUsername").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + 'Login.' + extension;

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
	
				window.location.href = "contacts.html";
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
    const login = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;

    const registerResult = document.getElementById("registerResult");
    registerResult.innerHTML = "";

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
    };
    const jsonPayload = JSON.stringify(payload);

    const url = urlBase + 'Register.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    try {
                        const jsonObject = JSON.parse(xhr.responseText);
                        if (jsonObject.error && jsonObject.error !== "") {
                            registerResult.innerHTML = jsonObject.error;
                        } else if (jsonObject.message) {
                            registerResult.innerHTML = jsonObject.message + (jsonObject.id ? " Your ID is " + jsonObject.id + "." : "");
                            // Optionally redirect to login page after successful registration
                            setTimeout(() => { window.location.href = "index.html"; }, 2000);
                        } else {
                            registerResult.innerHTML = "Registration successful, but no specific message received.";
                        }
                    } catch (e) {
                        registerResult.innerHTML = "Error parsing server response.";
                        console.error("Response parsing error:", xhr.responseText);
                    }
                } else {
                    let errorMessage = "Registration request failed. Status: " + this.status;
                     try {
                        const errorObject = JSON.parse(xhr.responseText);
                        if (errorObject.error) {
                            errorMessage = errorObject.error;
                        }
                    } catch (e) {
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
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString() + ";path=/";
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
	
	const currentPage = window.location.pathname.split("/").pop();
	if (userId < 0 && currentPage !== "index.html" && currentPage !== "register.html" && currentPage !== "") {
		window.location.href = "index.html";
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
	document.cookie = "firstName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "lastName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "userId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	window.location.href = "index.html";
}

// Functions for Contact Management (Dashboard - contacts.html)
function searchContacts() {
    const searchText = document.getElementById("searchText").value;
    const contactListDiv = document.getElementById("contactList");
    const searchStatus = document.getElementById("searchStatus");
    contactListDiv.innerHTML = "";
    searchStatus.innerHTML = "Searching...";

    const payload = {
        userId: userId,
        search: searchText
    };
    const jsonPayload = JSON.stringify(payload);
    const url = urlBase + 'SearchContacts.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    const jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error && jsonObject.error !== "No Records Found") {
                        searchStatus.innerHTML = "Error: " + jsonObject.error;
                        contactListDiv.innerHTML = "";
                    } else if (jsonObject.results && jsonObject.results.length > 0) {
                        searchStatus.innerHTML = "";
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
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email
    };

    let url;
    if (contactId) {
        payload.id = contactId;
        url = urlBase + 'UpdateContact.' + extension;
    } else {
        url = urlBase + 'RegisterContact.' + extension;
    }
    
    const jsonPayload = JSON.stringify(payload);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                modalFormMessage.className = "form-message";
                if (this.status == 200) {
                    const jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error && jsonObject.error !== "") {
                        modalFormMessage.innerHTML = "Error: " + jsonObject.error;
                        modalFormMessage.className = "form-message error";
                    } else {
                        modalFormMessage.innerHTML = contactId ? "Contact updated successfully!" : "Contact added successfully!";
                        modalFormMessage.className = "form-message success";
                        closeContactModal();
                        searchContacts();
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
    document.getElementById("contactId").value = "";
    document.getElementById("modalFormMessage").innerHTML = "";
    document.getElementById("modalFormMessage").className = "form-message";
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
    const newConfirmDeleteButton = confirmDeleteButton.cloneNode(true);
    confirmDeleteButton.parentNode.replaceChild(newConfirmDeleteButton, confirmDeleteButton);
    
    newConfirmDeleteButton.onclick = function() { 
        deleteContact(contactId); 
    };
    
    document.getElementById("deleteConfirmModal").style.display = "flex";
}


function deleteContact(contactId) {
    const contactOpStatus = document.getElementById("contactOpStatus");
    contactOpStatus.innerHTML = "";

    const payload = {
        id: contactId,
        userId: userId
    };
    const jsonPayload = JSON.stringify(payload);
    const url = urlBase + 'DeleteContact.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
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
                        searchContacts();
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