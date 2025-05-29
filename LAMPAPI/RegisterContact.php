<?php
	$inData = getRequestInfo();
	
	// Extract contact details from the input
	// Ensure these keys match what your Postman is sending (e.g., "userId", "firstName", etc.)
	$userId = $inData["userId"];
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$email = $inData["email"];
	$phone = $inData["phone"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    // SQL statement to insert into the Contacts table
    $stmt = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, Email, Phone) VALUES (?,?,?,?,?)");
    $stmt->bind_param("issss", $userId, $firstName, $lastName, $email, $phone);
    
    if ($stmt->execute())
    {
        returnWithError(""); // Indicates success with no error message
    }
    else
    {
        returnWithError( $stmt->error );
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err )
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}
?>