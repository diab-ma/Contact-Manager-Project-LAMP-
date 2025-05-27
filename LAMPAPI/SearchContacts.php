<?php

	$inData = getRequestInfo();
	
	$searchResults = []; // Use an array to store contact objects
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Prepare the search term for SQL LIKE queries
		$searchTerm = "%" . $inData["search"] . "%";
		$userId = $inData["userId"];

		// SQL to search across multiple fields in the Contacts table
		// Returns all relevant fields for each contact
		$stmt = $conn->prepare("SELECT ID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID = ? AND (FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR Phone LIKE ?)");
		// 'issss' for Integer (UserID) and four String (searchTerm) parameters
		$stmt->bind_param("issss", $userId, $searchTerm, $searchTerm, $searchTerm, $searchTerm);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			// Add each contact as an associative array to the searchResults array
			$searchResults[] = [
				"ID" => $row['ID'],
				"FirstName" => $row['FirstName'],
				"LastName" => $row['LastName'],
				"Phone" => $row['Phone'],
				"Email" => $row['Email']
			];
			$searchCount++;
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
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
		// Using the error structure from your original SearchContacts.php
		// You might want to make this {"results":[], "error":"..."} for consistency with returnWithInfo
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}'; 
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		// Encode the array of contact objects directly to JSON
		$retValue = '{"results":' . json_encode($searchResults) . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>