<?php
header("Content-Type: application/json");

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Extract and sanitize inputs
$firstName = trim($input["firstName"] ?? "");
$lastName = trim($input["lastName"] ?? "");
$login = trim($input["login"] ?? "");
$password = trim($input["password"] ?? "");

// Validate required fields
if (empty($firstName) || empty($lastName) || empty($login) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "All fields are required."]);
    exit();
}

// Hash the password (use md5 for compatibility, bcrypt for security)
$hashedPassword = md5($password); // or use password_hash($password, PASSWORD_DEFAULT)

// Connect to database
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => $conn->connect_error]);
    exit();
}

// Check for duplicate login
$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login = ?");
$stmt->bind_param("s", $login);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409); // Conflict
    echo json_encode(["error" => "Username already exists."]);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// Insert the new user
$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $firstName, $lastName, $login, $hashedPassword);

if ($stmt->execute()) {
    echo json_encode([
        "message" => "User registered successfully.",
        "id" => $stmt->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Registration failed."]);
}

$stmt->close();
$conn->close();
?>
