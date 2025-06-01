<?php
// Add CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$inData = json_decode(file_get_contents('php://input'), true);

$userId = $inData["userId"];
$limit = $inData["limit"];
$offset = $inData["offset"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

$stmt = $conn->prepare("CALL GetContactsLazy(?, ?, ?)");
$stmt->bind_param("iii", $userId, $limit, $offset);
$stmt->execute();

$result = $stmt->get_result();
$contacts = [];

while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

sendResultInfoAsJson(json_encode($contacts));

$stmt->close();
$conn->close();

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
?>
