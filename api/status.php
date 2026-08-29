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

require_once 'db.php';

// Record live visitor ping
trackLiveVisitor($conn);

$settings = getSystemSettings($conn);

echo json_encode([
    "status" => "success",
    "maintenance_mode" => (bool)($settings['maintenance_mode'] ?? false),
    "maintenance_message" => $settings['maintenance_message'] ?? '',
    "maintenance_eta" => $settings['maintenance_eta'] ?? '',
    "pause_submissions" => (bool)($settings['pause_submissions'] ?? false),
    "announcement_active" => (bool)($settings['announcement_active'] ?? false),
    "announcement_text" => $settings['announcement_text'] ?? '',
    "active_online_users" => getActiveVisitorsCount($conn),
    "timestamp" => time()
]);
