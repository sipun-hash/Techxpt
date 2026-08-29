<?php
// api/admin.php
// Enterprise-Grade Admin Dashboard & Emergency Command Center - TECHXPT
// 100% Mobile & Desktop Responsive
// Strict 3-Color Palette: Premium Red (#FF2424), Premium Black (#0A0A0A), Premium White (#FFFFFF)
// Zero Border-Radius (0px Sharp Architectural Styling)

// -------------------------------------------------------------
// 1. Error Handling & Security Headers
// -------------------------------------------------------------
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
ini_set('display_errors', '0');

header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");

// -------------------------------------------------------------
// 2. Session Management & CSRF Setup
// -------------------------------------------------------------
$is_https = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') 
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'secure' => $is_https,
    'httponly' => true,
    'samesite' => 'Strict'
]);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY']) > 3600) {
    session_unset();
    session_destroy();
    session_start();
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$_SESSION['LAST_ACTIVITY'] = time();

// -------------------------------------------------------------
// 3. Database Connection & System Settings
// -------------------------------------------------------------
require_once 'db.php';

$ADMIN_USER = getenv('ADMIN_USER') ?: 'admin';
$ADMIN_PASS = getenv('ADMIN_PASS') ?: 'TechXpt@2026Secure';

$sys = getSystemSettings($conn);

// Rate Limiting
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['lockout_time'] = 0;
}
$is_locked_out = (time() < $_SESSION['lockout_time']);

// Logout Handler
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_unset();
    session_destroy();
    header("Location: admin.php");
    exit;
}

// Login Handler
$login_error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    if ($is_locked_out) {
        $remaining = ceil(($_SESSION['lockout_time'] - time()) / 60);
        $login_error = "Too many attempts. Locked for $remaining minute(s).";
    } else {
        if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
            $login_error = "Security token mismatch. Please reload and try again.";
        } else {
            $input_user = trim($_POST['username'] ?? '');
            $input_pass = trim($_POST['password'] ?? '');

            if (hash_equals($ADMIN_USER, $input_user) && hash_equals($ADMIN_PASS, $input_pass)) {
                session_regenerate_id(true);
                $_SESSION['authenticated'] = true;
                $_SESSION['admin_user'] = $input_user;
                $_SESSION['login_attempts'] = 0;
                $_SESSION['lockout_time'] = 0;
                header("Location: admin.php");
                exit;
            } else {
                $_SESSION['login_attempts']++;
                if ($_SESSION['login_attempts'] >= 5) {
                    $_SESSION['lockout_time'] = time() + 900;
                    $login_error = "Account locked for 15 minutes due to multiple failed attempts.";
                } else {
                    $left = 5 - $_SESSION['login_attempts'];
                    $login_error = "Invalid credentials. ($left attempts left)";
                }
            }
        }
    }
}

$is_logged_in = !empty($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;

// -------------------------------------------------------------
// 4. Authenticated Actions (Export, Delete, Emergency Controls)
// -------------------------------------------------------------
$notification = '';
if ($is_logged_in) {
    
    // Save Emergency Settings
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_emergency') {
        if (isset($_POST['csrf_token']) && hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
            $sys['maintenance_mode'] = isset($_POST['maintenance_mode']);
            $sys['maintenance_message'] = trim($_POST['maintenance_message'] ?? 'TECHXPT is undergoing scheduled maintenance.');
            $sys['maintenance_eta'] = trim($_POST['maintenance_eta'] ?? '1 Hour');
            $sys['pause_submissions'] = isset($_POST['pause_submissions']);
            $sys['announcement_active'] = isset($_POST['announcement_active']);
            $sys['announcement_text'] = trim($_POST['announcement_text'] ?? '');
            $sys['last_updated'] = date('Y-m-d H:i:s');

            saveSystemSettings($conn, $sys);
            $notification = "Emergency settings successfully updated and saved to cloud database!";
        }
    }

    // Emergency Reset Lockouts
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'reset_security') {
        if (isset($_POST['csrf_token']) && hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
            $_SESSION['login_attempts'] = 0;
            $_SESSION['lockout_time'] = 0;
            $notification = "Security rate-limiter and lockout counters have been reset!";
        }
    }

    // Full JSON System Backup
    if (isset($_GET['export']) && $_GET['export'] === 'full_backup') {
        $contacts_data = $conn->query("SELECT * FROM contact_submissions")->fetchAll(PDO::FETCH_ASSOC);
        $internships_data = $conn->query("SELECT * FROM internship_applications")->fetchAll(PDO::FETCH_ASSOC);
        
        $backup = [
            "system" => "TECHXPT",
            "backup_date" => date('Y-m-d H:i:s'),
            "settings" => $sys,
            "contact_submissions" => $contacts_data,
            "internship_applications" => $internships_data
        ];

        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename=techxpt_full_backup_' . date('Y-m-d_His') . '.json');
        echo json_encode($backup, JSON_PRETTY_PRINT);
        exit;
    }

    // CSV Export
    if (isset($_GET['export']) && in_array($_GET['export'], ['contacts', 'internships'])) {
        $export_type = $_GET['export'];
        $filename = "techxpt_" . $export_type . "_" . date('Y-m-d') . ".csv";

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=' . $filename);
        $output = fopen('php://output', 'w');

        if ($export_type === 'contacts') {
            fputcsv($output, ['ID', 'Name', 'Email', 'Phone / Company', 'Services', 'Message', 'Date Submitted']);
            $stmt = $conn->query("SELECT id, name, email, phone, service, message, created_at FROM contact_submissions ORDER BY created_at DESC");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                fputcsv($output, $row);
            }
        } else {
            fputcsv($output, ['ID', 'Name', 'Email', 'Phone', 'Track', 'College', 'Duration', 'LinkedIn', 'GitHub', 'Notes', 'Date Submitted']);
            $stmt = $conn->query("SELECT id, name, email, phone, domain, education, experience, linkedin, github, notes, created_at FROM internship_applications ORDER BY created_at DESC");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                fputcsv($output, $row);
            }
        }
        fclose($output);
        exit;
    }

    // Delete Record
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
        if (isset($_POST['csrf_token']) && hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
            $table = $_POST['table'] === 'internships' ? 'internship_applications' : 'contact_submissions';
            $delete_id = filter_var($_POST['id'], FILTER_VALIDATE_INT);
            if ($delete_id) {
                $del = $conn->prepare("DELETE FROM $table WHERE id = :id");
                $del->execute([':id' => $delete_id]);
            }
        }
        header("Location: admin.php?tab=" . urlencode($_POST['tab'] ?? 'contacts'));
        exit;
    }

    // Test DB Ping Latency
    $ping_start = microtime(true);
    try {
        $conn->query("SELECT 1");
        $ping_ms = round((microtime(true) - $ping_start) * 1000, 2);
    } catch (Exception $e) {
        $ping_ms = "Offline";
    }

    // Fetch Lists
    try {
        $contacts = $conn->query("SELECT * FROM contact_submissions ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
        $internships = $conn->query("SELECT * FROM internship_applications ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);

        $today = date('Y-m-d');
        $today_contacts = 0;
        foreach ($contacts as $c) {
            if (strpos($c['created_at'], $today) === 0) $today_contacts++;
        }
        $today_interns = 0;
        foreach ($internships as $in) {
            if (strpos($in['created_at'], $today) === 0) $today_interns++;
        }
    } catch (PDOException $e) {
        $contacts = [];
        $internships = [];
    }
}

function safe($str) {
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}

function cleanPhone($phone) {
    return preg_replace('/[^0-9]/', '', $phone ?? '');
}

$active_tab = $_GET['tab'] ?? 'contacts';
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>TECHXPT Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <style>
        /* -------------------------------------------------------------
           STRICT 3-COLOR PALETTE: RED (#FF2424), BLACK (#0A0A0A), WHITE (#FFFFFF)
           ZERO BORDER-RADIUS THROUGHOUT
           ------------------------------------------------------------- */
        :root {
            --red: #FF2424;
            --red-hover: #D81818;
            --red-subtle: rgba(255, 36, 36, 0.12);
            --red-border: rgba(255, 36, 36, 0.35);

            /* Dark Theme */
            --bg: #0A0A0A;
            --surface: #121212;
            --surface-hover: #1A1A1A;
            --border: #262626;
            --border-light: #404040;
            --text-primary: #FFFFFF;
            --text-secondary: #A3A3A3;
            --text-muted: #737373;
            --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
        }

        [data-theme="light"] {
            --bg: #FFFFFF;
            --surface: #F8F9FA;
            --surface-hover: #EFEFEF;
            --border: #E5E5E5;
            --border-light: #CCCCCC;
            --text-primary: #0A0A0A;
            --text-secondary: #525252;
            --text-muted: #737373;
            --card-shadow: 0 5px 20px rgba(0, 0, 0, 0.06);
        }

        *, *::before, *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            border-radius: 0 !important;
        }

        body {
            background-color: var(--bg);
            color: var(--text-primary);
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            line-height: 1.5;
            overflow-x: hidden;
            transition: background-color 0.2s ease, color 0.2s ease;
        }

        /* -------------------------------------------------------------
           LOGIN SCREEN (CLEAN & SHARP)
           ------------------------------------------------------------- */
        .login-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 1.25rem;
            background: var(--bg);
        }
        .login-card {
            background: var(--surface);
            border: 1px solid var(--border);
            width: 100%;
            max-width: 380px;
            padding: 2rem 1.75rem;
            box-shadow: var(--card-shadow);
            position: relative;
        }
        .login-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 3px;
            background: var(--red);
        }
        .brand-title {
            font-size: 1.5rem;
            font-weight: 900;
            letter-spacing: 0.04em;
            color: var(--text-primary);
            text-align: center;
        }
        .brand-title span { color: var(--red); }
        .brand-sub {
            text-align: center;
            font-size: 0.82rem;
            color: var(--text-secondary);
            margin-bottom: 1.5rem;
            margin-top: 0.25rem;
        }

        /* -------------------------------------------------------------
           FORM INPUTS & BUTTONS
           ------------------------------------------------------------- */
        .form-group { margin-bottom: 1.25rem; }
        label {
            display: block;
            font-size: 0.76rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            color: var(--text-secondary);
            margin-bottom: 0.35rem;
        }
        input[type="text"], input[type="password"], textarea, select {
            width: 100%;
            padding: 0.75rem 0.85rem;
            background: var(--bg);
            border: 1px solid var(--border);
            color: var(--text-primary);
            font-family: inherit;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.2s;
        }
        input:focus, textarea:focus, select:focus { border-color: var(--red); }

        .btn-primary {
            width: 100%;
            padding: 0.8rem;
            background: var(--red);
            color: #FFFFFF;
            border: 1px solid var(--red);
            font-weight: 800;
            font-size: 0.82rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: background 0.2s;
        }
        .btn-primary:hover { background: var(--red-hover); border-color: var(--red-hover); }

        .btn-outline {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 0.45rem 0.75rem;
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-primary);
            font-size: 0.78rem;
            font-weight: 700;
            text-decoration: none;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s;
        }
        .btn-outline:hover { border-color: var(--text-primary); background: var(--surface-hover); }

        .btn-red {
            border-color: var(--red-border);
            color: var(--red);
            background: var(--red-subtle);
        }
        .btn-red:hover { background: var(--red); color: #FFFFFF; border-color: var(--red); }

        .alert-box {
            background: var(--red-subtle);
            border-left: 3px solid var(--red);
            color: var(--red);
            padding: 0.75rem 1rem;
            font-size: 0.82rem;
            font-weight: 600;
            margin-bottom: 1.25rem;
        }

        /* -------------------------------------------------------------
           CLEAN FLUID TOPBAR (ZERO CRAMMING ON MOBILE)
           ------------------------------------------------------------- */
        .topbar {
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            padding: 0.75rem 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .topbar-left {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            min-width: 0;
        }
        .logo {
            font-size: 1.15rem;
            font-weight: 900;
            letter-spacing: 0.04em;
            color: var(--text-primary);
            text-decoration: none;
            white-space: nowrap;
        }
        .logo span { color: var(--red); }

        .status-pill {
            font-size: 0.68rem;
            font-weight: 700;
            text-transform: uppercase;
            padding: 2px 7px;
            background: var(--red-subtle);
            color: var(--red);
            border: 1px solid var(--red-border);
            letter-spacing: 0.04em;
            white-space: nowrap;
        }

        .topbar-right {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .theme-btn {
            background: var(--bg);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 0.4rem 0.65rem;
            font-size: 0.74rem;
            font-weight: 700;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            text-transform: uppercase;
        }
        .theme-btn:hover { border-color: var(--text-primary); }

        .hamburger-btn {
            display: none;
            background: var(--bg);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 0.4rem 0.65rem;
            cursor: pointer;
            font-size: 1.05rem;
            font-weight: 700;
            line-height: 1;
        }

        /* -------------------------------------------------------------
           MOBILE MENU DRAWER
           ------------------------------------------------------------- */
        .mobile-menu {
            display: none;
            flex-direction: column;
            background: var(--surface);
            border-bottom: 2px solid var(--red);
            padding: 0.75rem 1rem 1.25rem 1rem;
            gap: 0.5rem;
        }
        .mobile-menu.open { display: flex; }
        .mobile-nav-link {
            padding: 0.75rem 1rem;
            color: var(--text-primary);
            text-decoration: none;
            font-weight: 700;
            font-size: 0.85rem;
            border: 1px solid var(--border);
            background: var(--bg);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .mobile-nav-link.active {
            background: var(--red);
            color: #FFFFFF;
            border-color: var(--red);
        }

        /* -------------------------------------------------------------
           CONTAINER & STATS CARDS
           ------------------------------------------------------------- */
        .main-container {
            max-width: 1350px;
            width: 100%;
            margin: 0 auto;
            padding: clamp(0.85rem, 3vw, 1.75rem);
            flex: 1;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.85rem;
            margin-bottom: 1.5rem;
        }
        .stat-card {
            background: var(--surface);
            border: 1px solid var(--border);
            padding: 1rem 1.15rem;
            position: relative;
        }
        .stat-card::after {
            content: '';
            position: absolute;
            bottom: 0; left: 0; width: 26px; height: 3px;
            background: var(--red);
        }
        .stat-label {
            font-size: 0.72rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-secondary);
            margin-bottom: 0.3rem;
        }
        .stat-val {
            font-size: 1.75rem;
            font-weight: 900;
            color: var(--text-primary);
            line-height: 1;
        }
        .stat-sub {
            font-size: 0.72rem;
            color: var(--red);
            font-weight: 700;
            margin-top: 0.4rem;
            text-transform: uppercase;
        }

        /* -------------------------------------------------------------
           NAV TABS & SEARCH
           ------------------------------------------------------------- */
        .tabs-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            flex-wrap: wrap;
            margin-bottom: 1.25rem;
        }
        .desktop-tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .tab-btn {
            padding: 0.6rem 1.15rem;
            font-size: 0.8rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            text-decoration: none;
            color: var(--text-secondary);
            background: var(--surface);
            border: 1px solid var(--border);
            transition: all 0.2s;
        }
        .tab-btn.active {
            background: var(--red);
            color: #FFFFFF;
            border-color: var(--red);
        }
        .tab-btn:hover:not(.active) {
            border-color: var(--text-primary);
            color: var(--text-primary);
        }

        .controls-row {
            display: flex;
            gap: 0.6rem;
            flex-wrap: wrap;
            width: 100%;
            max-width: 480px;
        }
        .search-wrap {
            flex: 1;
            min-width: 180px;
        }

        /* -------------------------------------------------------------
           DESKTOP TABLE & MOBILE CARD ADAPTATION
           ------------------------------------------------------------- */
        .desktop-table-wrap {
            display: block;
            background: var(--surface);
            border: 1px solid var(--border);
            overflow-x: auto;
            box-shadow: var(--card-shadow);
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85rem;
        }
        th {
            background: var(--bg);
            padding: 0.85rem 1rem;
            font-size: 0.72rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-secondary);
            border-bottom: 1px solid var(--border);
            text-align: left;
            white-space: nowrap;
        }
        td {
            padding: 0.9rem 1rem;
            border-bottom: 1px solid var(--border);
            vertical-align: middle;
            color: var(--text-secondary);
        }
        tr:hover td {
            background: var(--surface-hover);
            color: var(--text-primary);
        }

        .client-name {
            font-weight: 800;
            color: var(--text-primary);
            font-size: 0.92rem;
        }
        .link-text {
            color: var(--text-primary);
            text-decoration: underline;
            font-size: 0.8rem;
        }
        .link-text:hover { color: var(--red); }

        .tag-pill {
            display: inline-block;
            padding: 3px 8px;
            background: var(--red-subtle);
            color: var(--red);
            border: 1px solid var(--red-border);
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .time-text {
            font-size: 0.76rem;
            color: var(--text-muted);
            white-space: nowrap;
        }

        /* Mobile Card View (shown only on mobile screens) */
        .mobile-card-list {
            display: none;
            flex-direction: column;
            gap: 0.85rem;
        }
        .mobile-lead-card {
            background: var(--surface);
            border: 1px solid var(--border);
            padding: 1.15rem;
            box-shadow: var(--card-shadow);
            position: relative;
        }
        .mobile-lead-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; bottom: 0; width: 3px;
            background: var(--red);
        }
        .mobile-card-head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 0.5rem;
            margin-bottom: 0.65rem;
        }
        .mobile-card-body {
            font-size: 0.85rem;
            margin-bottom: 0.85rem;
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
        }
        .mobile-actions {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            border-top: 1px solid var(--border);
            padding-top: 0.75rem;
        }

        /* -------------------------------------------------------------
           EMERGENCY GRID
           ------------------------------------------------------------- */
        .emergency-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.25rem;
        }
        .emergency-card {
            background: var(--surface);
            border: 1px solid var(--border);
            padding: 1.35rem;
            box-shadow: var(--card-shadow);
            position: relative;
        }
        .emergency-card.danger { border-color: var(--red-border); }
        .emergency-card.danger::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 3px;
            background: var(--red);
        }
        .card-header-title {
            font-size: 1.05rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: var(--text-primary);
            margin-bottom: 0.3rem;
        }
        .card-subtext {
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-bottom: 1rem;
            line-height: 1.4;
        }
        .switch-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem;
            background: var(--bg);
            border: 1px solid var(--border);
            margin-bottom: 0.85rem;
            gap: 0.5rem;
        }
        .switch-title {
            font-size: 0.82rem;
            font-weight: 800;
            text-transform: uppercase;
            color: var(--text-primary);
        }
        .switch-desc {
            font-size: 0.74rem;
            color: var(--text-secondary);
        }

        /* Toggle Checkbox */
        .custom-toggle {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 22px;
            flex-shrink: 0;
        }
        .custom-toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: var(--border-light);
            transition: .2s;
            border: 1px solid var(--border);
        }
        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            bottom: 3px;
            background-color: #FFFFFF;
            transition: .2s;
        }
        input:checked + .toggle-slider { background-color: var(--red); border-color: var(--red); }
        input:checked + .toggle-slider:before { transform: translateX(22px); }

        /* -------------------------------------------------------------
           MODAL POPUP (ZERO BORDER-RADIUS)
           ------------------------------------------------------------- */
        .modal-bg {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(4px);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            z-index: 999;
        }
        .modal-box {
            background: var(--surface);
            border: 1px solid var(--border-light);
            max-width: 520px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            padding: clamp(1.25rem, 4vw, 1.75rem);
            box-shadow: 0 25px 50px rgba(0,0,0,0.8);
            position: relative;
        }
        .modal-box::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 3px;
            background: var(--red);
        }
        .modal-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.65rem;
            border-bottom: 1px solid var(--border);
        }
        .modal-head h3 {
            font-size: 1.05rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: var(--text-primary);
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 1.4rem;
            color: var(--text-secondary);
            cursor: pointer;
            line-height: 1;
        }
        .modal-close:hover { color: var(--red); }
        .modal-content p {
            margin-bottom: 0.75rem;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }
        .modal-content strong {
            color: var(--text-primary);
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: block;
            margin-bottom: 2px;
        }

        .empty-view {
            padding: 3rem 1rem;
            text-align: center;
            color: var(--text-muted);
            font-size: 0.88rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        /* -------------------------------------------------------------
           RESPONSIVE MOBILE BREAKPOINTS (< 800px)
           ------------------------------------------------------------- */
        @media (max-width: 800px) {
            .desktop-only { display: none !important; }
            .desktop-tabs { display: none; }
            .hamburger-btn { display: inline-flex; }
            .desktop-table-wrap { display: none; }
            .mobile-card-list { display: flex; }
            .controls-row { max-width: 100%; width: 100%; }
            .tabs-bar { flex-direction: column; align-items: stretch; }
        }
    </style>
</head>
<body>

<?php if (!$is_logged_in): ?>
    <!-- 🔒 LOGIN SCREEN -->
    <div class="login-wrap">
        <div class="login-card">
            <div class="brand-title">TECH<span>XPT</span></div>
            <div class="brand-sub">Admin Portal Login</div>

            <?php if (!empty($login_error)): ?>
                <div class="alert-box"><?= safe($login_error) ?></div>
            <?php endif; ?>

            <form method="POST" action="admin.php">
                <input type="hidden" name="action" value="login">
                <input type="hidden" name="csrf_token" value="<?= safe($_SESSION['csrf_token'] ?? '') ?>">

                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Username" required autofocus autocomplete="username">
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Password" required autocomplete="current-password">
                </div>

                <button type="submit" class="btn-primary">Sign In</button>
            </form>
        </div>
    </div>

<?php else: ?>
    <!-- 📊 TOP NAVBAR -->
    <header class="topbar">
        <div class="topbar-left">
            <a href="admin.php" class="logo">TECH<span>XPT</span></a>
            <?php if (!empty($sys['maintenance_mode'])): ?>
                <span class="status-pill" style="background: var(--red); color: #FFF;">⚠️ Maintenance Active</span>
            <?php else: ?>
                <span class="status-pill desktop-only">Aiven Connected</span>
            <?php endif; ?>
        </div>

        <div class="topbar-right">
            <!-- Theme Toggle -->
            <button onclick="toggleTheme()" class="theme-btn" id="themeBtn" title="Toggle Dark/Light Mode">
                <span id="themeText">Dark</span>
            </button>

            <!-- Logout Button (Desktop) -->
            <a href="admin.php?action=logout" class="btn-outline btn-red desktop-only" style="padding: 0.4rem 0.75rem;">
                Sign Out
            </a>

            <!-- Mobile Hamburger Button -->
            <button onclick="toggleMobileMenu()" class="hamburger-btn" aria-label="Toggle Menu">
                ☰
            </button>
        </div>
    </header>

    <!-- Mobile Navigation Drawer -->
    <nav id="mobileMenu" class="mobile-menu">
        <a href="admin.php?tab=contacts" class="mobile-nav-link <?= $active_tab === 'contacts' ? 'active' : '' ?>">
            <span>Contact Leads</span>
            <span>(<?= count($contacts) ?>)</span>
        </a>
        <a href="admin.php?tab=internships" class="mobile-nav-link <?= $active_tab === 'internships' ? 'active' : '' ?>">
            <span>Internship Applications</span>
            <span>(<?= count($internships) ?>)</span>
        </a>
        <a href="admin.php?tab=emergency" class="mobile-nav-link <?= $active_tab === 'emergency' ? 'active' : '' ?>" style="color: var(--red);">
            <span>🚨 Emergency Controls</span>
            <span>⚙</span>
        </a>
        <a href="admin.php?export=<?= $active_tab === 'internships' ? 'internships' : 'contacts' ?>" class="mobile-nav-link" style="background: var(--red); color: #fff; border-color: var(--red);">
            <span>Download CSV / Excel</span>
            <span>⬇</span>
        </a>
        <a href="admin.php?action=logout" class="mobile-nav-link" style="color: var(--red); border-color: var(--red-border); margin-top: 0.25rem;">
            <span>Sign Out</span>
            <span>&times;</span>
        </a>
    </nav>

    <main class="main-container">

        <?php if (!empty($notification)): ?>
            <div class="alert-box" style="background: rgba(255, 36, 36, 0.15); color: #FFF; border-color: var(--red);">
                <?= safe($notification) ?>
            </div>
        <?php endif; ?>

        <!-- Top Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Contact Leads</div>
                <div class="stat-val"><?= count($contacts) ?></div>
                <div class="stat-sub">+<?= $today_contacts ?> New Today</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Internship Applicants</div>
                <div class="stat-val"><?= count($internships) ?></div>
                <div class="stat-sub">+<?= $today_interns ?> New Today</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Database Latency</div>
                <div class="stat-val" style="font-size: 1.35rem; color: var(--red); padding-top: 0.2rem;">
                    <?= $ping_ms ?> ms
                </div>
                <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; margin-top: 0.3rem; font-weight: 700;">
                    Aiven MySQL Cloud (SSL)
                </div>
            </div>
        </div>

        <!-- Desktop Navigation Tabs & Search Controls -->
        <div class="tabs-bar">
            <!-- Desktop Tabs -->
            <div class="desktop-tabs">
                <a href="admin.php?tab=contacts" class="tab-btn <?= $active_tab === 'contacts' ? 'active' : '' ?>">
                    Contact Leads (<?= count($contacts) ?>)
                </a>
                <a href="admin.php?tab=internships" class="tab-btn <?= $active_tab === 'internships' ? 'active' : '' ?>">
                    Internship Applications (<?= count($internships) ?>)
                </a>
                <a href="admin.php?tab=emergency" class="tab-btn <?= $active_tab === 'emergency' ? 'active' : '' ?>" style="border-color: var(--red-border); color: var(--red);">
                    🚨 Emergency Controls
                </a>
            </div>

            <!-- Search & Export -->
            <?php if ($active_tab !== 'emergency'): ?>
                <div class="controls-row">
                    <div class="search-wrap">
                        <input 
                            type="text" 
                            id="searchInput" 
                            placeholder="Search name, email, phone..." 
                            onkeyup="searchRows()"
                        >
                    </div>
                    <a href="admin.php?export=<?= $active_tab === 'contacts' ? 'contacts' : 'internships' ?>" class="btn-primary" style="width: auto; padding: 0.65rem 1.15rem; font-size: 0.78rem;">
                        Download Excel
                    </a>
                </div>
            <?php endif; ?>
        </div>

        <!-- -------------------------------------------------------------
             TAB 1: CONTACT LEADS
             ------------------------------------------------------------- -->
        <?php if ($active_tab === 'contacts'): ?>

            <!-- Desktop Table View -->
            <div class="desktop-table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Client Name</th>
                            <th>Email & Phone</th>
                            <th>Service Requested</th>
                            <th>Date</th>
                            <th>Quick Actions</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($contacts)): ?>
                            <tr><td colspan="6" class="empty-view">No contact submissions found.</td></tr>
                        <?php else: ?>
                            <?php foreach ($contacts as $c): ?>
                                <?php 
                                    $phone_clean = cleanPhone($c['phone']); 
                                    $details = htmlspecialchars(json_encode([
                                        'title' => 'Contact Lead Overview',
                                        'name' => $c['name'],
                                        'email' => $c['email'],
                                        'phone' => $c['phone'] ?: 'Not Provided',
                                        'service' => $c['service'] ?: 'General Inquiry',
                                        'message' => $c['message'],
                                        'date' => date('M d, Y · h:i A', strtotime($c['created_at']))
                                    ]), ENT_QUOTES, 'UTF-8');
                                ?>
                                <tr class="data-row">
                                    <td>
                                        <div class="client-name"><?= safe($c['name']) ?></div>
                                        <button onclick="openDetailModal(<?= $details ?>)" class="link-text" style="background: none; border: none; cursor: pointer; padding: 0; margin-top: 3px; font-weight: 700;">
                                            View Message &rarr;
                                        </button>
                                    </td>
                                    <td>
                                        <div><a href="mailto:<?= safe($c['email']) ?>" class="link-text"><?= safe($c['email']) ?></a></div>
                                        <?php if (!empty($c['phone'])): ?>
                                            <div style="font-size: 0.8rem; margin-top: 2px; color: var(--text-muted); font-weight: 600;"><?= safe($c['phone']) ?></div>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span class="tag-pill"><?= safe($c['service'] ?: 'General') ?></span>
                                    </td>
                                    <td class="time-text">
                                        <?= safe(date('M d, Y · h:i A', strtotime($c['created_at']))) ?>
                                    </td>
                                    <td>
                                        <div class="actions-group">
                                            <a href="mailto:<?= safe($c['email']) ?>" class="btn-outline" style="padding: 0.35rem 0.65rem;" title="Email Client">
                                                Email
                                            </a>
                                            <?php if (!empty($phone_clean)): ?>
                                                <a href="https://wa.me/<?= $phone_clean ?>" target="_blank" class="btn-outline btn-red" style="padding: 0.35rem 0.65rem;" title="WhatsApp Client">
                                                    WhatsApp
                                                </a>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                    <td>
                                        <form method="POST" action="admin.php" onsubmit="return confirm('Delete this record?');">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="table" value="contacts">
                                            <input type="hidden" name="tab" value="contacts">
                                            <input type="hidden" name="id" value="<?= safe($c['id']) ?>">
                                            <input type="hidden" name="csrf_token" value="<?= safe($_SESSION['csrf_token']) ?>">
                                            <button type="submit" class="btn-outline" style="border-color: var(--border); color: var(--red); padding: 0.35rem 0.65rem;">
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <!-- Mobile Responsive Card View -->
            <div class="mobile-card-list">
                <?php if (empty($contacts)): ?>
                    <div class="empty-view" style="background: var(--surface); border: 1px solid var(--border);">
                        No contact submissions found.
                    </div>
                <?php else: ?>
                    <?php foreach ($contacts as $c): ?>
                        <?php 
                            $phone_clean = cleanPhone($c['phone']); 
                            $details = htmlspecialchars(json_encode([
                                'title' => 'Contact Lead Overview',
                                'name' => $c['name'],
                                'email' => $c['email'],
                                'phone' => $c['phone'] ?: 'Not Provided',
                                'service' => $c['service'] ?: 'General Inquiry',
                                'message' => $c['message'],
                                'date' => date('M d, Y · h:i A', strtotime($c['created_at']))
                            ]), ENT_QUOTES, 'UTF-8');
                        ?>
                        <div class="mobile-lead-card data-row">
                            <div class="mobile-card-head">
                                <div>
                                    <div class="client-name"><?= safe($c['name']) ?></div>
                                    <span class="time-text"><?= safe(date('M d, Y · h:i A', strtotime($c['created_at']))) ?></span>
                                </div>
                                <span class="tag-pill"><?= safe($c['service'] ?: 'General') ?></span>
                            </div>

                            <div class="mobile-card-body">
                                <div><a href="mailto:<?= safe($c['email']) ?>" class="link-text"><?= safe($c['email']) ?></a></div>
                                <?php if (!empty($c['phone'])): ?>
                                    <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;"><?= safe($c['phone']) ?></div>
                                <?php endif; ?>
                            </div>

                            <div class="mobile-actions">
                                <button onclick="openDetailModal(<?= $details ?>)" class="btn-outline" style="flex: 1;">
                                    View Message
                                </button>
                                <?php if (!empty($phone_clean)): ?>
                                    <a href="https://wa.me/<?= $phone_clean ?>" target="_blank" class="btn-outline btn-red" style="flex: 1;">
                                        WhatsApp
                                    </a>
                                <?php endif; ?>
                                <a href="mailto:<?= safe($c['email']) ?>" class="btn-outline" style="flex: 1;">
                                    Email
                                </a>
                                <form method="POST" action="admin.php" onsubmit="return confirm('Delete this record?');" style="display: inline;">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="table" value="contacts">
                                    <input type="hidden" name="tab" value="contacts">
                                    <input type="hidden" name="id" value="<?= safe($c['id']) ?>">
                                    <input type="hidden" name="csrf_token" value="<?= safe($_SESSION['csrf_token']) ?>">
                                    <button type="submit" class="btn-outline" style="color: var(--red); border-color: var(--border);">
                                        &times;
                                    </button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

        <!-- -------------------------------------------------------------
             TAB 2: INTERNSHIP APPLICATIONS
             ------------------------------------------------------------- -->
        <?php elseif ($active_tab === 'internships'): ?>

            <!-- Desktop Table View -->
            <div class="desktop-table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Email & Phone</th>
                            <th>Track & Duration</th>
                            <th>College / Degree</th>
                            <th>Date</th>
                            <th>Quick Actions</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($internships)): ?>
                            <tr><td colspan="7" class="empty-view">No internship applications found.</td></tr>
                        <?php else: ?>
                            <?php foreach ($internships as $in): ?>
                                <?php 
                                    $phone_clean = cleanPhone($in['phone']); 
                                    $details = htmlspecialchars(json_encode([
                                        'title' => 'Internship Applicant Overview',
                                        'name' => $in['name'],
                                        'email' => $in['email'],
                                        'phone' => $in['phone'],
                                        'track' => $in['domain'] . ' (' . ($in['experience'] ?: '3 Months') . ')',
                                        'college' => $in['education'] ?: 'Not Specified',
                                        'notes' => $in['notes'] ?: 'No additional notes.',
                                        'date' => date('M d, Y · h:i A', strtotime($in['created_at']))
                                    ]), ENT_QUOTES, 'UTF-8');
                                ?>
                                <tr class="data-row">
                                    <td>
                                        <div class="client-name"><?= safe($in['name']) ?></div>
                                        <button onclick="openDetailModal(<?= $details ?>)" class="link-text" style="background: none; border: none; cursor: pointer; padding: 0; margin-top: 3px; font-weight: 700;">
                                            View Profile &rarr;
                                        </button>
                                    </td>
                                    <td>
                                        <div><a href="mailto:<?= safe($in['email']) ?>" class="link-text"><?= safe($in['email']) ?></a></div>
                                        <div style="font-size: 0.8rem; margin-top: 2px; color: var(--red); font-weight: 700;"><?= safe($in['phone']) ?></div>
                                    </td>
                                    <td>
                                        <span class="tag-pill"><?= safe($in['domain']) ?></span>
                                        <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 3px; font-weight: 600;">
                                            <?= safe($in['experience'] ?: '3 Months') ?>
                                        </div>
                                    </td>
                                    <td style="font-size: 0.82rem; font-weight: 600;">
                                        <?= safe($in['education'] ?: 'Not Specified') ?>
                                    </td>
                                    <td class="time-text">
                                        <?= safe(date('M d, Y · h:i A', strtotime($in['created_at']))) ?>
                                    </td>
                                    <td>
                                        <div class="actions-group">
                                            <a href="mailto:<?= safe($in['email']) ?>" class="btn-outline" style="padding: 0.35rem 0.65rem;" title="Email Applicant">
                                                Email
                                            </a>
                                            <?php if (!empty($phone_clean)): ?>
                                                <a href="https://wa.me/<?= $phone_clean ?>" target="_blank" class="btn-outline btn-red" style="padding: 0.35rem 0.65rem;" title="WhatsApp Applicant">
                                                    WhatsApp
                                                </a>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                    <td>
                                        <form method="POST" action="admin.php" onsubmit="return confirm('Delete this applicant?');">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="table" value="internships">
                                            <input type="hidden" name="tab" value="internships">
                                            <input type="hidden" name="id" value="<?= safe($in['id']) ?>">
                                            <input type="hidden" name="csrf_token" value="<?= safe($_SESSION['csrf_token']) ?>">
                                            <button type="submit" class="btn-outline" style="border-color: var(--border); color: var(--red); padding: 0.35rem 0.65rem;">
                                                Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

            <!-- Mobile Card View -->
            <div class="mobile-card-list">
                <?php if (empty($internships)): ?>
                    <div class="empty-view" style="background: var(--surface); border: 1px solid var(--border);">
                        No internship applications found.
                    </div>
                <?php else: ?>
                    <?php foreach ($internships as $in): ?>
                        <?php 
                            $phone_clean = cleanPhone($in['phone']); 
                            $details = htmlspecialchars(json_encode([
                                'title' => 'Internship Applicant Overview',
                                'name' => $in['name'],
                                'email' => $in['email'],
                                'phone' => $in['phone'],
                                'track' => $in['domain'] . ' (' . ($in['experience'] ?: '3 Months') . ')',
                                'college' => $in['education'] ?: 'Not Specified',
                                'notes' => $in['notes'] ?: 'No additional notes.',
                                'date' => date('M d, Y · h:i A', strtotime($in['created_at']))
                            ]), ENT_QUOTES, 'UTF-8');
                        ?>
                        <div class="mobile-lead-card data-row">
                            <div class="mobile-card-head">
                                <div>
                                    <div class="client-name"><?= safe($in['name']) ?></div>
                                    <span class="time-text"><?= safe(date('M d, Y · h:i A', strtotime($in['created_at']))) ?></span>
                                </div>
                                <span class="tag-pill"><?= safe($in['domain']) ?></span>
                            </div>

                            <div class="mobile-card-body">
                                <div><a href="mailto:<?= safe($in['email']) ?>" class="link-text"><?= safe($in['email']) ?></a></div>
                                <div style="font-size: 0.8rem; color: var(--red); font-weight: 700;"><?= safe($in['phone']) ?></div>
                                <div style="font-size: 0.78rem; color: var(--text-muted);"><?= safe($in['education'] ?: 'Education Not Specified') ?></div>
                            </div>

                            <div class="mobile-actions">
                                <button onclick="openDetailModal(<?= $details ?>)" class="btn-outline" style="flex: 1;">
                                    View Profile
                                </button>
                                <?php if (!empty($phone_clean)): ?>
                                    <a href="https://wa.me/<?= $phone_clean ?>" target="_blank" class="btn-outline btn-red" style="flex: 1;">
                                        WhatsApp
                                    </a>
                                <?php endif; ?>
                                <a href="mailto:<?= safe($in['email']) ?>" class="btn-outline" style="flex: 1;">
                                    Email
                                </a>
                                <form method="POST" action="admin.php" onsubmit="return confirm('Delete this applicant?');" style="display: inline;">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="table" value="internships">
                                    <input type="hidden" name="tab" value="internships">
                                    <input type="hidden" name="id" value="<?= safe($in['id']) ?>">
                                    <input type="hidden" name="csrf_token" value="<?= safe($_SESSION['csrf_token']) ?>">
                                    <button type="submit" class="btn-outline" style="color: var(--red); border-color: var(--border);">
                                        &times;
                                    </button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>

        <!-- -------------------------------------------------------------
             TAB 3: 🚨 EMERGENCY COMMAND CENTER
             ------------------------------------------------------------- -->
        <?php else: ?>
            <div class="emergency-grid">

                <div class="emergency-card danger">
                    <div class="card-header-title">🚨 Site Operations & Maintenance</div>
                    <div class="card-subtext">
                        Control public access, freeze inbound form submissions, or broadcast emergency announcements.
                    </div>

                    <form method="POST" action="admin.php">
                        <input type="hidden" name="action" value="save_emergency">
                        <input type="hidden" name="csrf_token" value="<?= safe($_SESSION['csrf_token']) ?>">

                        <div class="switch-row">
                            <div>
                                <div class="switch-title">Maintenance Mode</div>
                                <div class="switch-desc">Displays maintenance notice across website.</div>
                            </div>
                            <label class="custom-toggle">
                                <input type="checkbox" name="maintenance_mode" <?= !empty($sys['maintenance_mode']) ? 'checked' : '' ?>>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>

                        <div class="switch-row">
                            <div>
                                <div class="switch-title">Pause Form Inquiries</div>
                                <div class="switch-desc">Temporarily rejects new submissions.</div>
                            </div>
                            <label class="custom-toggle">
                                <input type="checkbox" name="pause_submissions" <?= !empty($sys['pause_submissions']) ? 'checked' : '' ?>>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>

                        <div class="form-group">
                            <label>Maintenance Notice Text</label>
                            <textarea name="maintenance_message" rows="2"><?= safe($sys['maintenance_message'] ?? '') ?></textarea>
                        </div>

                        <div class="form-group">
                            <label>Estimated Return Time (ETA)</label>
                            <input type="text" name="maintenance_eta" value="<?= safe($sys['maintenance_eta'] ?? '1 Hour') ?>" placeholder="e.g. 2 Hours / 10:00 PM">
                        </div>

                        <div class="switch-row" style="margin-top: 1.25rem;">
                            <div>
                                <div class="switch-title">Broadcast Site Notice</div>
                                <div class="switch-desc">Displays custom top alert bar on website.</div>
                            </div>
                            <label class="custom-toggle">
                                <input type="checkbox" name="announcement_active" <?= !empty($sys['announcement_active']) ? 'checked' : '' ?>>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>

                        <div class="form-group">
                            <label>Announcement Text</label>
                            <textarea name="announcement_text" rows="2" placeholder="e.g. High volume notice..."><?= safe($sys['announcement_text'] ?? '') ?></textarea>
                        </div>

                        <button type="submit" class="btn-primary" style="margin-top: 0.5rem;">
                            Save & Deploy Changes
                        </button>
                    </form>
                </div>

                <div class="emergency-card">
                    <div class="card-header-title">⚡ Cloud Diagnostics & Backups</div>
                    <div class="card-subtext">
                        Run health checks, export complete data backups, or unlock rate-limited administrators.
                    </div>

                    <div style="background: var(--bg); border: 1px solid var(--border); padding: 0.85rem; margin-bottom: 1.25rem;">
                        <div style="font-size: 0.74rem; font-weight: 800; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 0.5rem;">
                            Database Diagnostics
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; padding: 4px 0; border-bottom: 1px solid var(--border);">
                            <span>Roundtrip Latency</span>
                            <span style="font-weight: 800; color: var(--red);"><?= $ping_ms ?> ms</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; padding: 4px 0; border-bottom: 1px solid var(--border);">
                            <span>Total Contact Records</span>
                            <span style="font-weight: 800; color: var(--text-primary);"><?= count($contacts) ?></span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; padding: 4px 0;">
                            <span>Total Intern Applications</span>
                            <span style="font-weight: 800; color: var(--text-primary);"><?= count($internships) ?></span>
                        </div>
                    </div>

                    <div style="margin-bottom: 1.25rem;">
                        <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: var(--text-primary); margin-bottom: 0.25rem;">
                            Full System Backup
                        </div>
                        <div style="font-size: 0.76rem; color: var(--text-secondary); margin-bottom: 0.6rem;">
                            Download complete JSON snapshot of all records and settings.
                        </div>
                        <a href="admin.php?export=full_backup" class="btn-outline" style="width: 100%; border-color: var(--text-primary); padding: 0.7rem;">
                            💾 Download Full Backup (JSON)
                        </a>
                    </div>

                    <div>
                        <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: var(--text-primary); margin-bottom: 0.25rem;">
                            Security Lockout Reset
                        </div>
                        <div style="font-size: 0.76rem; color: var(--text-secondary); margin-bottom: 0.6rem;">
                            Clear failed login attempt counters and unlock administrators.
                        </div>
                        <form method="POST" action="admin.php" onsubmit="return confirm('Reset all login security counters?');">
                            <input type="hidden" name="action" value="reset_security">
                            <input type="hidden" name="csrf_token" value="<?= safe($_SESSION['csrf_token']) ?>">
                            <button type="submit" class="btn-outline btn-red" style="width: 100%; padding: 0.7rem;">
                                🔓 Reset Rate-Limiter & Lockouts
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        <?php endif; ?>

    </main>

    <!-- 🔍 DETAIL MODAL -->
    <div id="detailModal" class="modal-bg" onclick="if(event.target === this) closeDetailModal();">
        <div class="modal-box">
            <div class="modal-head">
                <h3 id="modalHeading">Details</h3>
                <button class="modal-close" onclick="closeDetailModal()">&times;</button>
            </div>
            <div id="modalBody" class="modal-content">
                <!-- Dynamically Inserted -->
            </div>
            <div style="text-align: right; margin-top: 1.25rem; border-top: 1px solid var(--border); padding-top: 0.75rem;">
                <button onclick="closeDetailModal()" class="btn-primary" style="width: auto; padding: 0.45rem 1.25rem;">
                    Close
                </button>
            </div>
        </div>
    </div>

    <script>
        function initTheme() {
            const saved = localStorage.getItem('techxpt-admin-theme') || 'dark';
            document.documentElement.setAttribute('data-theme', saved);
            document.getElementById('themeText').innerText = saved === 'dark' ? 'Dark' : 'Light';
        }

        function toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('techxpt-admin-theme', next);
            document.getElementById('themeText').innerText = next === 'dark' ? 'Dark' : 'Light';
        }

        initTheme();

        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('open');
        }

        function searchRows() {
            const term = document.getElementById('searchInput').value.toLowerCase();
            const rows = document.querySelectorAll('.data-row');
            rows.forEach(row => {
                row.style.display = row.innerText.toLowerCase().includes(term) ? '' : 'none';
            });
        }

        function openDetailModal(data) {
            document.getElementById('modalHeading').innerText = data.title || 'Details';
            let html = `
                <p><strong>Full Name:</strong> ${escapeHtml(data.name)}</p>
                <p><strong>Email Address:</strong> <a href="mailto:${escapeHtml(data.email)}" class="link-text">${escapeHtml(data.email)}</a></p>
                <p><strong>Phone / WhatsApp:</strong> ${escapeHtml(data.phone)}</p>
            `;
            if (data.service) {
                html += `<p><strong>Service Requested:</strong> ${escapeHtml(data.service)}</p>`;
            }
            if (data.track) {
                html += `<p><strong>Internship Track:</strong> ${escapeHtml(data.track)}</p>`;
            }
            if (data.college) {
                html += `<p><strong>College / Education:</strong> ${escapeHtml(data.college)}</p>`;
            }
            if (data.message) {
                html += `<p><strong>Message / Project Brief:</strong><br><span style="white-space: pre-wrap; color: var(--text-primary); font-weight: 500;">${escapeHtml(data.message)}</span></p>`;
            }
            if (data.notes) {
                html += `<p><strong>Applicant Notes:</strong><br><span style="white-space: pre-wrap; color: var(--text-primary); font-weight: 500;">${escapeHtml(data.notes)}</span></p>`;
            }
            html += `<p style="font-size: 0.74rem; color: var(--text-muted); margin-top: 1rem;"><strong>Submitted Date:</strong> ${escapeHtml(data.date)}</p>`;

            document.getElementById('modalBody').innerHTML = html;
            document.getElementById('detailModal').style.display = 'flex';
        }

        function closeDetailModal() {
            document.getElementById('detailModal').style.display = 'none';
        }

        function escapeHtml(str) {
            if (!str) return '';
            const d = document.createElement('div');
            d.textContent = str;
            return d.innerHTML;
        }
    </script>
<?php endif; ?>

</body>
</html>
