
<?php

header("Content-Type: application/json");
$inData = json_decode(file_get_contents('php://input'), true);

$userId = $inData["userId"];
$id = $inData["id"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = $inData["phone"];
$email = $inData["email"];

if (is_null($userId) || is_null($id)) {
    returnWithError("User ID and/or Contact ID required.");
}
if (!is_numeric($loggedInUserId) || !is_numeric($contactIdToUpdate)) {
    returnWithError("User ID and/or Contact ID must be a number");
}
if (is_null($firstName) && is_null($lastName) && is_null($phone) && is_null($email)) {
    returnWithError("No fields provided to update.");
}

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("CALL UpdateContact(?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iissss", $userId, $id, $firstName, $lastName, $phone, $email);
    $stmt->execute();

    echo json_encode(["error" => "UpdateSucceful"]);

    $stmt->close();
    $conn->close();
}

function returnWithError($err) {
    echo json_encode(["error" => $err]);
    exit();
}
?>
