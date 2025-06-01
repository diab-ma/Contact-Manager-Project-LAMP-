<?php
// Add CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$inData = getRequestInfo();

$firstName = trim($inData["firstName"]);
$lastName = trim($inData["lastName"]);
$login = trim($inData["login"]);
$password = trim($inData["password"]);

if ($firstName == "" || $lastName == "" || $login == "" || $password == "") {
    returnWithError("All fields are required");
    exit();
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

// Check if login already exists
$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
$stmt->bind_param("s", $login);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    returnWithError("Username already taken");
    exit();
}
$stmt->close();

// Insert new user
$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $firstName, $lastName, $login, $hashedPassword);
if (!$stmt->execute()) {
    returnWithError("Failed to register user");
    exit();
}

$id = $stmt->insert_id;
$stmt->close();
$conn->close();

returnWithInfo($firstName, $lastName, $id);

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    $retValue = json_encode(["id" => 0, "firstName" => "", "lastName" => "", "error" => $err]);
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($firstName, $lastName, $id) {
    $retValue = json_encode(["id" => $id, "firstName" => $firstName, "lastName" => $lastName, "error" => ""]);
    sendResultInfoAsJson($retValue);
}
?>
