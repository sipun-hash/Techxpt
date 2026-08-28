<?php
// api/internship.php

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

if (empty($data['name']) || empty($data['email']) || empty($data['phone'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Name, Email, and Phone number are required"]);
    exit;
}

$name = trim($data['name']);
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$phone = trim($data['phone']);
$domain = isset($data['track']) ? trim($data['track']) : (isset($data['domain']) ? trim($data['domain']) : 'General');
$education = isset($data['college']) ? trim($data['college']) : (isset($data['education']) ? trim($data['education']) : null);
$experience = isset($data['duration']) ? trim($data['duration']) : (isset($data['experience']) ? trim($data['experience']) : null);
$linkedin = isset($data['linkedin']) ? trim($data['linkedin']) : null;
$github = isset($data['github']) ? trim($data['github']) : null;
$notes = isset($data['notes']) ? trim($data['notes']) : (isset($data['message']) ? trim($data['message']) : null);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Please provide a valid email address"]);
    exit;
}

try {
    $sql = "INSERT INTO internship_applications (name, email, phone, domain, education, experience, linkedin, github, notes) 
            VALUES (:name, :email, :phone, :domain, :education, :experience, :linkedin, :github, :notes)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':domain' => $domain,
        ':education' => $education,
        ':experience' => $experience,
        ':linkedin' => $linkedin,
        ':github' => $github,
        ':notes' => $notes
    ]);

    http_response_code(200);
    echo json_encode([
        "status" => "success",
        "message" => "Your internship application has been submitted successfully!"
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database insert error: " . $e->getMessage()
    ]);
}
