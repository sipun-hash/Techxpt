<?php
// api/status.php
// Public / Frontend System Status & Emergency Check API

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$settings_file = __DIR__ . '/system_settings.json';

if (file_exists($settings_file)) {
    $settings = json_decode(file_get_contents($settings_file), true);
} else {
    $settings = [
        "maintenance_mode" => false,
        "maintenance_message" => "TECHXPT is undergoing system maintenance.",
        "maintenance_eta" => "1 Hour",
        "pause_submissions" => false,
        "announcement_active" => false,
        "announcement_text" => ""
    ];
}

echo json_encode([
    "status" => "success",
    "maintenance_mode" => (bool)($settings['maintenance_mode'] ?? false),
    "maintenance_message" => $settings['maintenance_message'] ?? '',
    "maintenance_eta" => $settings['maintenance_eta'] ?? '',
    "pause_submissions" => (bool)($settings['pause_submissions'] ?? false),
    "announcement_active" => (bool)($settings['announcement_active'] ?? false),
    "announcement_text" => $settings['announcement_text'] ?? '',
    "timestamp" => time()
]);
