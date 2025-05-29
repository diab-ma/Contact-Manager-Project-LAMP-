<?php
// Add CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$inData = json_decode(file_get_contents('php://input'), true);

$userId = $inData["userId"];
$id = $inData["id"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = $inData["phone"];
$email = $inData["email"];

if (is_null($userId) || is_null($id)) {
    returnWithError("User ID and/or Contact ID required.");
    exit();
}
if (!is_numeric($userId) || !is_numeric($id)) {
    returnWithError("User ID and/or Contact ID must be a number");
    exit();
}
if (is_null($firstName) && is_null($lastName) && is_null($phone) && is_null($email)) {
    returnWithError("No fields provided to update.");
    exit();
}

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
} else {
    // Fix: Use the correct stored procedure parameters order
    $stmt = $conn->prepare("CALL UpdateContact(?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $id, $firstName, $lastName, $phone, $email);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        returnWithError(""); // Success - empty error string
    } else {
        returnWithError("Update failed or no changes made");
    }

    $stmt->close();
    $conn->close();
}

function returnWithError($err) {
    echo json_encode(["error" => $err]);
    exit();
}
?>