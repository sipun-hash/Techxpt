<?php
// api/db.php
// Safe for Git: Credentials are loaded from Environment Variables or local config.php

// 1. Check if private local config.php exists
if (file_exists(__DIR__ . '/config.php')) {
    include_once __DIR__ . '/config.php';
}

// 2. Load from environment variables if set (e.g. on Render / Cloud hosting)
$host = getenv('DB_HOST') ?: (isset($host) ? $host : 'localhost');
$port = getenv('DB_PORT') ?: (isset($port) ? $port : '3306');
$dbname = getenv('DB_NAME') ?: (isset($dbname) ? $dbname : 'defaultdb');
$username = getenv('DB_USER') ?: (isset($username) ? $username : 'avnadmin');
$password = getenv('DB_PASSWORD') ?: (isset($password) ? $password : '');

try {
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ];

    if (file_exists(__DIR__ . '/ca.pem')) {
        $options[PDO::MYSQL_ATTR_SSL_CA] = __DIR__ . '/ca.pem';
        $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
    }

    $conn = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password, $options);
} catch (PDOException $e) {
    http_response_code(500);
    header("Content-Type: application/json");
    echo json_encode([
        "status" => "error",
        "message" => "Database connection failed: " . $e->getMessage()
    ]);
    exit;
}
