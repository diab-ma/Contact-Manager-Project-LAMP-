<?php
// Add CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$inData = getRequestInfo();
$login = trim($inData["login"]);
$password = trim($inData["password"]);

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login = ?");
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row["Password"])) {
        returnWithInfo($row["FirstName"], $row["LastName"], $row["ID"]);
    } else {
        returnWithError("User/Password combination incorrect");
    }
} else {
    returnWithError("User/Password combination incorrect");
}

$stmt->close();
$conn->close();

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
