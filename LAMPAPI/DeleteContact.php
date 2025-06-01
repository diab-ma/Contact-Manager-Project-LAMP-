<?php
// Add CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$inData = getRequestInfo();
$contactId = $inData["id"] ?? null;
$userId = $inData["userId"] ?? null;

if (is_null($contactId) || is_null($userId)) {
    returnWithError("Contact ID and/or User ID required");
    exit();
}

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

// First: check if contact exists for this user
$checkStmt = $conn->prepare("SELECT ID FROM Contacts WHERE ID = ? AND UserID = ?");
$checkStmt->bind_param("ii", $contactId, $userId);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows === 0) {
    returnWithError("Contact with ID $contactId for user $userId not found.");
    $checkStmt->close();
    $conn->close();
    exit();
}
$checkStmt->close();

// Second: delete contact
$deleteStmt = $conn->prepare("CALL DeleteContact(?, ?)");
$deleteStmt->bind_param("ii", $userId, $contactId);
$deleteStmt->execute();

if ($deleteStmt->affected_rows > 0) {
    returnWithSuccess("Contact deleted.");
} else {
    returnWithError("Failed to delete contact.");
}

$deleteStmt->close();
$conn->close();

// Helper functions
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess($message)
{
    $retValue = '{"error":""}';
    sendResultInfoAsJson($retValue);
}
?>
