<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$inData = getRequestInfo();

$searchResults = [];
$searchCount = 0;

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $searchTerm = "%" . $inData["search"] . "%";
    $userId = $inData["userId"];
    $limit = isset($inData["limit"]) ? (int)$inData["limit"] : 10;
    $offset = isset($inData["offset"]) ? (int)$inData["offset"] : 0;

    $stmt = $conn->prepare(
        "SELECT ID, FirstName, LastName, Phone, Email 
         FROM Contacts 
         WHERE UserID = ? AND 
         (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR Phone LIKE ?) 
         LIMIT ? OFFSET ?"
    );

    $stmt->bind_param("issssii", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $limit, $offset);
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $searchResults[] = [
            "ID" => $row['ID'],
            "FirstName" => $row['FirstName'],
            "LastName" => $row['LastName'],
            "Phone" => $row['Phone'],
            "Email" => $row['Email']
        ];
        $searchCount++;
    }

    if ($searchCount == 0) {
        returnWithError("No Records Found");
    } else {
        returnWithInfo($searchResults);
    }

    $stmt->close();
    $conn->close();
}

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
    $retValue = '{"results":[],"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
    $retValue = '{"results":' . json_encode($searchResults) . ',"error":""}';
    sendResultInfoAsJson($retValue);
}
