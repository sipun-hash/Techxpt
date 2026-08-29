<?php
// api/db.php
// Safe for Git: Credentials are loaded from Environment Variables or local config.php

// 1. Check if private local config.php exists
if (file_exists(__DIR__ . '/config.php')) {
    include_once __DIR__ . '/config.php';
}

function getEnvValue($key, $default = '') {
    if (isset($_ENV[$key]) && $_ENV[$key] !== '') return $_ENV[$key];
    if (isset($_SERVER[$key]) && $_SERVER[$key] !== '') return $_SERVER[$key];
    $val = getenv($key);
    if ($val !== false && $val !== '') return $val;
    
    // Check Docker / Linux container PID 1 environment if available
    static $procEnv = null;
    if ($procEnv === null && @file_exists('/proc/1/environ')) {
        $procEnv = [];
        $raw = @file_get_contents('/proc/1/environ');
        if ($raw) {
            $lines = explode("\0", $raw);
            foreach ($lines as $line) {
                if (strpos($line, '=') !== false) {
                    list($k, $v) = explode('=', $line, 2);
                    $procEnv[$k] = $v;
                }
            }
        }
    }
    if (is_array($procEnv) && isset($procEnv[$key]) && $procEnv[$key] !== '') {
        return $procEnv[$key];
    }
    return $default;
}

// 2. Load from environment variables if set (e.g. on Render / Cloud hosting)
$host = getEnvValue('DB_HOST', isset($host) ? $host : 'localhost');
$port = getEnvValue('DB_PORT', isset($port) ? $port : '3306');
$dbname = getEnvValue('DB_NAME', isset($dbname) ? $dbname : 'defaultdb');
$username = getEnvValue('DB_USER', isset($username) ? $username : 'avnadmin');
$password = getEnvValue('DB_PASSWORD', isset($password) ? $password : '');

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
            "admin_google_emails" => $rows['admin_google_emails'] ?? getEnvValue('ADMIN_GOOGLE_EMAILS', ''),
            "admin_user" => $rows['admin_user'] ?? getEnvValue('ADMIN_USER', 'admin'),
            "admin_pass" => $rows['admin_pass'] ?? getEnvValue('ADMIN_PASS', 'TechXpt@2026Secure'),
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
            "admin_google_emails" => getEnvValue('ADMIN_GOOGLE_EMAILS', ''),
            "admin_user" => getEnvValue('ADMIN_USER', 'admin'),
            "admin_pass" => getEnvValue('ADMIN_PASS', 'TechXpt@2026Secure'),
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
            'admin_google_emails' => $settings['admin_google_emails'] ?? '',
            'admin_user' => $settings['admin_user'] ?? '',
            'admin_pass' => $settings['admin_pass'] ?? '',
            'last_updated' => date('Y-m-d H:i:s')
        ];

        foreach ($map as $key => $val) {
            $stmt->execute([':k' => $key, ':v' => $val, ':v2' => $val]);
        }
        return true;
    } catch (Exception $e) {
        return false;
    }
}

// -------------------------------------------------------------
// Real-Time Live Website Visitor Tracker
// -------------------------------------------------------------
function trackLiveVisitor($conn) {
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS active_visitors (
            visitor_id VARCHAR(64) PRIMARY KEY,
            ip_address VARCHAR(45),
            user_agent VARCHAR(255),
            last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");

        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 250);
        $visitor_id = hash('sha256', $ip . '_' . $ua);

        $stmt = $conn->prepare("INSERT INTO active_visitors (visitor_id, ip_address, user_agent, last_seen) 
            VALUES (:id, :ip, :ua, NOW()) 
            ON DUPLICATE KEY UPDATE last_seen = NOW()");
        $stmt->execute([
            ':id' => $visitor_id,
            ':ip' => substr($ip, 0, 45),
            ':ua' => $ua
        ]);

        // Cleanup stale visitors (older than 60 seconds) with 10% probability
        if (rand(1, 10) === 1) {
            $conn->exec("DELETE FROM active_visitors WHERE last_seen < NOW() - INTERVAL 90 SECOND");
        }
    } catch (Exception $e) {}
}

function getActiveVisitorsCount($conn) {
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS active_visitors (
            visitor_id VARCHAR(64) PRIMARY KEY,
            ip_address VARCHAR(45),
            user_agent VARCHAR(255),
            last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");
        $stmt = $conn->query("SELECT COUNT(*) FROM active_visitors WHERE last_seen >= NOW() - INTERVAL 60 SECOND");
        return max(1, (int)$stmt->fetchColumn()); // At least current viewer/session
    } catch (Exception $e) {
        return 1;
    }
}
