<?php
// api/contact.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Only POST method is allowed"]);
    exit;
}

require_once 'db.php';

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON payload"]);
    exit;
}

if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Name, Email, and Message are required"]);
    exit;
}

$name = trim($data['name']);
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$phone = isset($data['phone']) ? trim($data['phone']) : (isset($data['company']) ? trim($data['company']) : null);
$service = isset($data['service']) ? (is_array($data['service']) ? implode(', ', $data['service']) : trim($data['service'])) : null;
$message = trim($data['message']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Please provide a valid email address"]);
    exit;
}

try {
    $sql = "INSERT INTO contact_submissions (name, email, phone, service, message) 
            VALUES (:name, :email, :phone, :service, :message)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':service' => $service,
        ':message' => $message
    ]);

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Thank you! Your message has been submitted successfully."
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database insert error: " . $e->getMessage()
    ]);
}
