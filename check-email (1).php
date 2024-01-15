<?php
// Securely store database credentials (ideally in a separate configuration file)
$servername = "localhost";
$username = "id21788806_snakeop";
$password = "Debjit@1998"; // Replace with your actual password
$dbname = "Auth";

// Get email input securely
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['email'])) {
    $inputedemail = mysqli_real_escape_string($conn, $_POST['email']); // Sanitize input
} else {
    http_response_code(400); // Indicate bad request
    die("Invalid request method or missing email parameter.");
}

// Create connection with error handling
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500); // Set appropriate error status code
    die("Database connection failed: " . $conn->connect_error);
}

// Prepare the SQL statement with a placeholder for security
$stmt = $conn->prepare("SELECT * FROM `Auth` WHERE `Email` LIKE ?");
$stmt->bind_param("s", $inputedemail); // Bind the sanitized email

// Execute the query
$stmt->execute();

// Check for existence of records
$result = $stmt->get_result();
$exists = $result->num_rows > 0;

// Close the statement and connection
$stmt->close();
$conn->close();

// Send JSON response indicating email existence
echo json_encode(array("exists" => $exists));
?>
