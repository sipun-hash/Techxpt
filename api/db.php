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

// -------------------------------------------------------------
// Database-Backed System Settings Manager (No File Permission Issues)
// -------------------------------------------------------------
function getSystemSettings($conn) {
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS system_settings (
            setting_key VARCHAR(100) PRIMARY KEY,
            setting_value TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");

        $stmt = $conn->query("SELECT setting_key, setting_value FROM system_settings");
        $rows = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

        return [
            "maintenance_mode" => !empty($rows['maintenance_mode']) && $rows['maintenance_mode'] === '1',
            "maintenance_message" => $rows['maintenance_message'] ?? "TECHXPT is currently undergoing scheduled maintenance. We will be back online shortly.",
            "maintenance_eta" => $rows['maintenance_eta'] ?? "1 Hour",
            "pause_submissions" => !empty($rows['pause_submissions']) && $rows['pause_submissions'] === '1',
            "announcement_active" => !empty($rows['announcement_active']) && $rows['announcement_active'] === '1',
            "announcement_text" => $rows['announcement_text'] ?? "",
            "last_updated" => $rows['last_updated'] ?? date('Y-m-d H:i:s')
        ];
    } catch (Exception $e) {
        return [
            "maintenance_mode" => false,
            "maintenance_message" => "TECHXPT is currently undergoing scheduled maintenance.",
            "maintenance_eta" => "1 Hour",
            "pause_submissions" => false,
            "announcement_active" => false,
            "announcement_text" => "",
            "last_updated" => date('Y-m-d H:i:s')
        ];
    }
}

function saveSystemSettings($conn, $settings) {
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS system_settings (
            setting_key VARCHAR(100) PRIMARY KEY,
            setting_value TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");

        $stmt = $conn->prepare("INSERT INTO system_settings (setting_key, setting_value) 
            VALUES (:k, :v) 
            ON DUPLICATE KEY UPDATE setting_value = :v2");

        $map = [
            'maintenance_mode' => !empty($settings['maintenance_mode']) ? '1' : '0',
            'maintenance_message' => $settings['maintenance_message'] ?? '',
            'maintenance_eta' => $settings['maintenance_eta'] ?? '',
            'pause_submissions' => !empty($settings['pause_submissions']) ? '1' : '0',
            'announcement_active' => !empty($settings['announcement_active']) ? '1' : '0',
            'announcement_text' => $settings['announcement_text'] ?? '',
            'last_updated' => date('Y-m-d H:i:s')
        ];

        foreach ($map as $k => $v) {
            $stmt->execute([':k' => $k, ':v' => $v, ':v2' => $v]);
        }
        return true;
    } catch (Exception $e) {
        return false;
    }
}
