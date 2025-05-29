<?php
// Add CORS headers
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");


    $inData = getRequestInfo();

    $contactId = $inData["id"];
    $userId = $inData["userId"];

    if (is_null($contactId) || is_null($userId)) {
        returnWithError("Contact ID and/or User ID requiredt");
        exit();
    }

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
        exit();
    }

    $stmt = $conn->prepare("CALL DeleteContact(?,?)");
    $stmt->bind_param("ii", $userId, $contactId);

    $stmt->execute();
        if ($stmt->affected_rows > 0) {
            returnWithSuccess("Contact deleted ");
        } else {
            returnWithError("Contact not found");
        }

    $stmt->close();
    $conn->close();

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
        // JS expects an empty error string for success
        $retValue = '{"error":""}';
        sendResultInfoAsJson($retValue);
    }
?>

