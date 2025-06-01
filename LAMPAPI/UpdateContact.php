<?php
// Add CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Read incoming JSON request
$inData = getRequestInfo();

// Validate required fields
$contactId = $inData["id"] ?? null;
$userId = $inData["userId"] ?? null;
$firstName = $inData["firstName"] ?? "";
$lastName = $inData["lastName"] ?? "";
$phone = $inData["phone"] ?? "";
$email = $inData["email"] ?? "";

if (is_null($contactId) || is_null($userId)) {
    returnWithError("Contact ID and User ID are required.");
    exit();
}

// Connect to MySQL
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

// Prepare and call the stored procedure
$stmt = $conn->prepare("CALL UpdateContact(?, ?, ?, ?, ?, ?)");
$stmt->bind_param("iissss", $contactId, $userId, $firstName, $lastName, $phone, $email);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    returnWithSuccess("Contact updated successfully.");
} else {
    returnWithError("Contact not found or no changes made.");
}

$stmt->close();
$conn->close();

// Helper functions
function getRequestInfo()
{
    return json_decode(file_get_contents("php://input"), true);
}

function sendResultInfoAsJson($obj)
{
    header("Content-type: application/json");
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess($msg)
{
    $retValue = '{"error":""}';
    sendResultInfoAsJson($retValue);
}
?>
