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
		// Column names (UserID, FirstName, etc.) should match your database table schema
		$stmt = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, Email, Phone) VALUES (?,?,?,?,?)");
		// 'issss' means Integer, String, String, String, String for the parameter types
		$stmt->bind_param("issss", $userId, $firstName, $lastName, $email, $phone);
		
		if ($stmt->execute())
		{
			// Optional: Could return the ID of the new contact if needed
			// $newId = $conn->insert_id;
			// returnWithInfo($newId, "Contact registered successfully."); 
			returnWithError(""); // Indicates success with no error message as per original file structure
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
		// Consistent with the provided RegisterContact.php error structure
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	// Optional: If you want to return more info on success for AddContact
	/*
	function returnWithInfo( $id, $message )
	{
		$retValue = '{"id":' . $id . ',"message":"' . $message . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	*/
?>