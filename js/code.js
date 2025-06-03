const urlBase = 'https://majorregrets.com/LAMPAPI/';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let searchTimer = null;
let inactivityTimer = null;

// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up activity tracking for auto-logout
    if (window.location.pathname.includes('contacts.html')) {
        document.addEventListener('click', resetInactivityTimer);
        document.addEventListener('keypress', resetInactivityTimer);
        document.addEventListener('mousemove', resetInactivityTimer);
        resetInactivityTimer();
    }
});

// Validation Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email === "" || re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\(\)\+]*$/;
    return phone === "" || re.test(phone);
}

function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const inputElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
        if (inputElement) {
            inputElement.classList.add('error');
            inputElement.classList.remove('success');
        }
    }
}

function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    const inputElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = '';
        if (inputElement) {
            inputElement.classList.remove('error');
        }
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin fa-3x"></i>
                <p>Loading...</p>
            </div>
        `;
    }
}

function setButtonLoading(buttonId, loading, originalText = '') {
    const button = document.getElementById(buttonId);
    if (button) {
        button.disabled = loading;
        if (loading) {
            button.classList.add('loading');
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        } else {
            button.classList.remove('loading');
            button.innerHTML = originalText;
        }
    }
}

// Inactivity timer for auto-logout
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        showNotification('Session expired due to inactivity', 'error');
        setTimeout(doLogout, 1000);
    }, 20 * 60 * 1000); // 20 minutes
}

// API Error Handler
function handleAPIError(xhr, action) {
    const status = xhr.status;
    let message = "";
    
    try {
        const response = JSON.parse(xhr.responseText);
        if (response.error) {
            return response.error;
        }
    } catch (e) {
        // Continue with status-based error handling
    }
    
    switch(status) {
        case 404:
            message = "Service not found. Please try again later.";
            break;
        case 500:
            message = "Server error. Please contact support.";
            break;
        case 401:
            message = "Session expired. Please log in again.";
            setTimeout(() => window.location.href = "index.html", 1500);
            break;
        case 0:
            message = "Network error. Please check your connection.";
            break;
        default:
            message = `Error ${action}. Please try again.`;
    }
    return message;
}

// Login Function
function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";
    
    // Clear previous errors
    clearError('loginUsername');
    clearError('loginPassword');
    
    let login = document.getElementById("loginUsername").value.trim();
    let password = document.getElementById("loginPassword").value.trim();
    
    // Validation
    if (!login) {
        showError('loginUsername', 'Username is required');
        return;
    }
    if (!password) {
        showError('loginPassword', 'Password is required');
        return;
    }
    
    document.getElementById("loginResult").innerHTML = "";
    setButtonLoading('loginButton', true, '<i class="fas fa-sign-in-alt"></i> Sign In & Stir');

    let tmp = {login:login, password:password};
    let jsonPayload = JSON.stringify(tmp);
    
    let url = urlBase + 'Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                setButtonLoading('loginButton', false, '<i class="fas fa-sign-in-alt"></i> Sign In & Stir');
                
                if (this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    userId = jsonObject.id;
            
                    if (userId < 1) {
                        document.getElementById("loginResult").innerHTML = "Invalid username or password";
                        document.getElementById("loginResult").className = "form-message error";
                        return;
                    }
            
                    firstName = jsonObject.firstName;
                    lastName = jsonObject.lastName;

                    saveCookie();
                    window.location.href = "contacts.html";
                } else {
                    const error = handleAPIError(xhr, "logging in");
                    document.getElementById("loginResult").innerHTML = error;
                    document.getElementById("loginResult").className = "form-message error";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch(err) {
        setButtonLoading('loginButton', false, '<i class="fas fa-sign-in-alt"></i> Sign In & Stir');
        document.getElementById("loginResult").innerHTML = err.message;
        document.getElementById("loginResult").className = "form-message error";
    }
}

// Registration Function
function doRegister() {
    // Clear all previous errors
    ['registerFirstName', 'registerLastName', 'registerUsername', 'registerPassword', 'registerConfirmPassword']
        .forEach(field => clearError(field));
    
    const firstName = document.getElementById("registerFirstName").value.trim();
    const lastName = document.getElementById("registerLastName").value.trim();
    const login = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value.trim();
    const confirmPassword = document.getElementById("registerConfirmPassword").value.trim();

    const registerResult = document.getElementById("registerResult");
    registerResult.innerHTML = "";
    registerResult.className = "form-message";

    // Validation
    let hasError = false;
    
    if (!firstName) {
        showError('registerFirstName', 'First name is required');
        hasError = true;
    }
    if (!lastName) {
        showError('registerLastName', 'Last name is required');
        hasError = true;
    }
    if (!login) {
        showError('registerUsername', 'Username is required');
        hasError = true;
    } else if (login.length < 3) {
        showError('registerUsername', 'Username must be at least 3 characters');
        hasError = true;
    }
    if (!password) {
        showError('registerPassword', 'Password is required');
        hasError = true;
    } else if (password.length < 6) {
        showError('registerPassword', 'Password must be at least 6 characters');
        hasError = true;
    }
    if (password !== confirmPassword) {
        showError('registerConfirmPassword', 'Passwords do not match');
        hasError = true;
    }
    
    if (hasError) return;

    setButtonLoading('registerButton', true, '<i class="fas fa-user-plus"></i> Create My Account');

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
                setButtonLoading('registerButton', false, '<i class="fas fa-user-plus"></i> Create My Account');
                
                if (this.status == 200) {
                    try {
                        const jsonObject = JSON.parse(xhr.responseText);
                        if (jsonObject.error && jsonObject.error !== "") {
                            registerResult.innerHTML = jsonObject.error;
                            registerResult.className = "form-message error";
                        } else {
                            registerResult.innerHTML = "Registration successful! Redirecting to login...";
                            registerResult.className = "form-message success";
                            setTimeout(() => { window.location.href = "index.html"; }, 2000);
                        }
                    } catch (e) {
                        registerResult.innerHTML = "Error parsing server response.";
                        registerResult.className = "form-message error";
                    }
                } else {
                    const error = handleAPIError(xhr, "registering");
                    registerResult.innerHTML = error;
                    registerResult.className = "form-message error";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        setButtonLoading('registerButton', false, '<i class="fas fa-user-plus"></i> Create My Account');
        registerResult.innerHTML = "An error occurred: " + err.message;
        registerResult.className = "form-message error";
    }
}

// Cookie Management
function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));    
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString() + ";path=/";
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for(var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }
    
    const currentPage = window.location.pathname.split("/").pop();
    if (userId < 0 && currentPage !== "index.html" && currentPage !== "register.html" && currentPage !== "") {
        window.location.href = "index.html";
    }
    
    const userNameElement = document.getElementById("userName");
    if (userNameElement && userId > 0) {
        userNameElement.innerHTML = "Brewing for: " + firstName + " " + lastName;
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "lastName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "userId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "index.html";
}

// Contact Management Functions
function debounceSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(searchContacts, 300);
}

function clearSearch() {
    document.getElementById("searchText").value = "";
    searchContacts();
}

function searchContacts() {
    const searchText = document.getElementById("searchText").value.trim();
    const contactListDiv = document.getElementById("contactList");
    const searchStatus = document.getElementById("searchStatus");
    const emptyState = document.getElementById("emptyState");
    const resultsCount = document.getElementById("resultsCount");
    
    searchStatus.innerHTML = "";
    resultsCount.innerHTML = "";
    emptyState.style.display = "none";
    showLoading('contactList');

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
                        searchStatus.className = "form-message error";
                        contactListDiv.innerHTML = "";
                        emptyState.style.display = "block";
                    } else if (jsonObject.results && jsonObject.results.length > 0) {
                        // Show results count
                        const resultText = searchText ? 
                            `Found ${jsonObject.results.length} contact${jsonObject.results.length !== 1 ? 's' : ''} matching "${searchText}"` :
                            `Showing all ${jsonObject.results.length} contact${jsonObject.results.length !== 1 ? 's' : ''}`;
                        resultsCount.innerHTML = resultText;
                        
                        contactListDiv.innerHTML = "";
                        jsonObject.results.forEach(contact => {
                            const phoneDisplay = contact.Phone || 'No phone';
                            const emailDisplay = contact.Email || 'No email';
                            
                            const card = `
                                <div class="contact-card">
                                    <h3>${escapeHtml(contact.FirstName)} ${escapeHtml(contact.LastName)} <span class="contact-id">(ID: ${contact.ID})</span></h3>
                                    <p><i class="fas fa-phone"></i> ${escapeHtml(phoneDisplay)}</p>
                                    <p><i class="fas fa-envelope"></i> ${escapeHtml(emailDisplay)}</p>
                                    <div class="contact-actions">
                                        <button class="btn btn-icon btn-edit" onclick="openEditContactModal(${contact.ID}, '${escapeHtml(contact.FirstName)}', '${escapeHtml(contact.LastName)}', '${escapeHtml(contact.Phone || '')}', '${escapeHtml(contact.Email || '')}')">
                                            <i class="fas fa-pencil-alt"></i> Edit
                                        </button>
                                        <button class="btn btn-icon btn-delete" onclick="confirmDeleteContact(${contact.ID}, '${escapeHtml(contact.FirstName + ' ' + contact.LastName)}')">
                                            <i class="fas fa-trash-alt"></i> Delete
                                        </button>
                                    </div>
                                </div>`;
                            contactListDiv.innerHTML += card;
                        });
                    } else {
                        contactListDiv.innerHTML = "";
                        if (searchText) {
                            resultsCount.innerHTML = `No contacts found matching "${searchText}"`;
                            emptyState.style.display = "block";
                            emptyState.innerHTML = `
                                <i class="fas fa-search fa-4x"></i>
                                <h3>No matching contacts</h3>
                                <p>Try adjusting your search or add a new contact</p>
                            `;
                        } else {
                            emptyState.style.display = "block";
                        }
                    }
                } else {
                    const error = handleAPIError(xhr, "searching contacts");
                    searchStatus.innerHTML = error;
                    searchStatus.className = "form-message error";
                    contactListDiv.innerHTML = "";
                    emptyState.style.display = "block";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        searchStatus.innerHTML = "Search error: " + err.message;
        searchStatus.className = "form-message error";
        contactListDiv.innerHTML = "";
        emptyState.style.display = "block";
    }
}

function handleSaveContact() {
    // Clear previous errors
    ['firstName', 'lastName', 'phone', 'email'].forEach(field => clearError('contact' + field.charAt(0).toUpperCase() + field.slice(1)));
    
    const contactId = document.getElementById("contactId").value;
    const firstName = document.getElementById("contactFirstName").value.trim();
    const lastName = document.getElementById("contactLastName").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const modalFormMessage = document.getElementById("modalFormMessage");

    modalFormMessage.innerHTML = "";
    modalFormMessage.className = "form-message";

    // Validation
    let hasError = false;
    
    if (!firstName) {
        showError('contactFirstName', 'First name is required');
        hasError = true;
    }
    if (!lastName) {
        showError('contactLastName', 'Last name is required');
        hasError = true;
    }
    if (phone && !validatePhone(phone)) {
        showError('contactPhone', 'Please enter a valid phone number');
        hasError = true;
    }
    if (email && !validateEmail(email)) {
        showError('contactEmail', 'Please enter a valid email address');
        hasError = true;
    }
    
    if (hasError) return;

    const originalButtonText = contactId ? '<i class="fas fa-save"></i> Save Blend' : '<i class="fas fa-save"></i> Save Blend';
    setButtonLoading('saveContactButton', true, originalButtonText);

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
                setButtonLoading('saveContactButton', false, originalButtonText);
                
                if (this.status == 200) {
                    const jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error && jsonObject.error !== "") {
                        modalFormMessage.innerHTML = "Error: " + jsonObject.error;
                        modalFormMessage.className = "form-message error";
                    } else {
                        const successMessage = contactId ? "Contact updated successfully!" : "Contact added successfully!";
                        showNotification(successMessage, 'success');
                        closeContactModal();
                        searchContacts();
                    }
                } else {
                    const error = handleAPIError(xhr, contactId ? "updating contact" : "adding contact");
                    modalFormMessage.innerHTML = error;
                    modalFormMessage.className = "form-message error";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        setButtonLoading('saveContactButton', false, originalButtonText);
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
    
    // Clear any previous errors
    ['contactFirstName', 'contactLastName', 'contactPhone', 'contactEmail'].forEach(field => clearError(field));
    
    const modal = document.getElementById("contactModal");
    modal.style.display = "flex";
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById("contactFirstName").focus();
    }, 100);
}

function openEditContactModal(id, firstName, lastName, phone, email) {
    document.getElementById("modalTitle").innerText = "Edit This Blend";
    document.getElementById("contactId").value = id;
    document.getElementById("contactFirstName").value = unescapeHtml(firstName);
    document.getElementById("contactLastName").value = unescapeHtml(lastName);
    document.getElementById("contactPhone").value = unescapeHtml(phone);
    document.getElementById("contactEmail").value = unescapeHtml(email);
    document.getElementById("modalFormMessage").innerHTML = "";
    document.getElementById("modalFormMessage").className = "form-message";
    
    // Clear any previous errors
    ['contactFirstName', 'contactLastName', 'contactPhone', 'contactEmail'].forEach(field => clearError(field));
    
    const modal = document.getElementById("contactModal");
    modal.style.display = "flex";
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById("contactFirstName").focus();
    }, 100);
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
    contactOpStatus.className = "form-message";

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
                if (this.status == 200) {
                    const jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error && jsonObject.error !== "") {
                        showNotification("Error deleting contact: " + jsonObject.error, 'error');
                    } else {
                        showNotification("Contact archived successfully!", 'success');
                        searchContacts();
                    }
                } else {
                    const error = handleAPIError(xhr, "deleting contact");
                    showNotification(error, 'error');
                }
                closeDeleteConfirmModal();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        showNotification("Delete error: " + err.message, 'error');
        closeDeleteConfirmModal();
    }
}

function closeDeleteConfirmModal() {
    document.getElementById("deleteConfirmModal").style.display = "none";
}

// Utility functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function unescapeHtml(text) {
    const map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
    };
    return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, m => map[m]);
}

// Modal close on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        if (event.target.id === 'contactModal') {
            closeContactModal();
        } else if (event.target.id === 'deleteConfirmModal') {
            closeDeleteConfirmModal();
        }
    }
}

// Close modals with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeContactModal();
        closeDeleteConfirmModal();
    }
});