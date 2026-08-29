<?php
// api/admin.php
// Clean, User-Friendly & Secure Admin Dashboard for TECHXPT

// -------------------------------------------------------------
// 1. Security Headers
// -------------------------------------------------------------
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");

// -------------------------------------------------------------
// 2. Session Setup & Security
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

// 60-minute inactivity auto-logout
if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY']) > 3600) {
    session_unset();
    session_destroy();
    session_start();
}
$_SESSION['LAST_ACTIVITY'] = time();

// -------------------------------------------------------------
// 3. Database Connection
// -------------------------------------------------------------
require_once 'db.php';

// Master Credentials
$ADMIN_USER = getenv('ADMIN_USER') ?: 'admin';
$ADMIN_PASS = getenv('ADMIN_PASS') ?: 'TechXpt@2026Secure';

// Generate CSRF Token
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// -------------------------------------------------------------
// 4. Rate Limiting Protection
// -------------------------------------------------------------
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['lockout_time'] = 0;
}

$is_locked_out = (time() < $_SESSION['lockout_time']);

// Logout
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
        $login_error = "Too many attempts. Please wait $remaining minute(s).";
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
                    $login_error = "Too many failed attempts. Locked for 15 minutes.";
                } else {
                    $left = 5 - $_SESSION['login_attempts'];
                    $login_error = "Incorrect username or password ($left attempts remaining).";
                }
            }
        }
    }
}

$is_logged_in = !empty($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;

// -------------------------------------------------------------
// 5. Dashboard Actions (CSV Export, Delete, Status Update)
// -------------------------------------------------------------
if ($is_logged_in) {
    // CSV Export
    if (isset($_GET['export'])) {
        $export_type = $_GET['export'] === 'internships' ? 'internships' : 'contacts';
        $filename = "techxpt_" . $export_type . "_" . date('Y-m-d') . ".csv";

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=' . $filename);
        $output = fopen('php://output', 'w');

        if ($export_type === 'contacts') {
            fputcsv($output, ['ID', 'Name', 'Email', 'Phone / Company', 'Services Requested', 'Message', 'Submitted Date']);
            $stmt = $conn->query("SELECT id, name, email, phone, service, message, created_at FROM contact_submissions ORDER BY created_at DESC");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                fputcsv($output, $row);
            }
        } else {
            fputcsv($output, ['ID', 'Name', 'Email', 'Phone', 'Track', 'College / Degree', 'Duration', 'LinkedIn', 'GitHub', 'Notes', 'Submitted Date']);
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

    // Fetch Records
    try {
        $contacts = $conn->query("SELECT * FROM contact_submissions ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
        $internships = $conn->query("SELECT * FROM internship_applications ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);

        // Count for Today
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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechXpt Admin Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #090d16;
            --card: #111827;
            --card-hover: #172033;
            --border: #1f2937;
            --border-light: #374151;
            --text: #f9fafb;
            --text-muted: #9ca3af;
            --primary: #ff2424;
            --primary-hover: #e01b1b;
            --success: #10b981;
            --blue: #3b82f6;
            --radius: 8px;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background-color: var(--bg);
            color: var(--text);
            font-family: 'Plus Jakarta Sans', sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            line-height: 1.5;
        }

        /* Login Box */
        .login-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 1.5rem;
        }
        .login-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            width: 100%;
            max-width: 400px;
            padding: 2.25rem;
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
        }
        .login-header { text-align: center; margin-bottom: 1.75rem; }
        .login-logo {
            font-size: 1.4rem;
            font-weight: 900;
            letter-spacing: 0.05em;
            color: #ffffff;
            margin-bottom: 0.35rem;
        }
        .login-logo span { color: var(--primary); }
        .login-sub { font-size: 0.88rem; color: var(--text-muted); }

        .form-group { margin-bottom: 1.25rem; }
        label {
            display: block;
            font-size: 0.82rem;
            font-weight: 600;
            color: var(--text-muted);
            margin-bottom: 0.4rem;
        }
        input[type="text"], input[type="password"], select {
            width: 100%;
            padding: 0.75rem 0.9rem;
            background: #0d131f;
            border: 1px solid var(--border-light);
            border-radius: 6px;
            color: var(--text);
            font-family: inherit;
            font-size: 0.92rem;
            outline: none;
            transition: border-color 0.2s;
        }
        input:focus { border-color: var(--primary); }

        .btn-primary {
            width: 100%;
            padding: 0.85rem;
            background: var(--primary);
            color: #ffffff;
            border: none;
            border-radius: 6px;
            font-weight: 700;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background 0.2s;
        }
        .btn-primary:hover { background: var(--primary-hover); }

        .btn-action {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 0.4rem 0.75rem;
            border-radius: 5px;
            font-size: 0.78rem;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            border: 1px solid var(--border-light);
            background: #1e293b;
            color: var(--text);
            transition: all 0.2s;
        }
        .btn-action:hover { background: #334155; }
        .btn-whatsapp {
            background: rgba(16, 185, 129, 0.15);
            border-color: rgba(16, 185, 129, 0.3);
            color: #34d399;
        }
        .btn-whatsapp:hover { background: rgba(16, 185, 129, 0.3); }

        .btn-mail {
            background: rgba(59, 130, 246, 0.15);
            border-color: rgba(59, 130, 246, 0.3);
            color: #60a5fa;
        }
        .btn-mail:hover { background: rgba(59, 130, 246, 0.3); }

        .btn-delete {
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.25);
            color: #f87171;
        }
        .btn-delete:hover { background: rgba(239, 68, 68, 0.25); }

        .alert-error {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #fca5a5;
            padding: 0.75rem;
            border-radius: 6px;
            font-size: 0.85rem;
            margin-bottom: 1.25rem;
            text-align: center;
        }

        /* Top Navigation Header */
        .navbar {
            background: var(--card);
            border-bottom: 1px solid var(--border);
            padding: 0.85rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 50;
        }
        .logo-area { display: flex; align-items: center; gap: 0.75rem; }
        .logo-title { font-size: 1.15rem; font-weight: 900; letter-spacing: 0.04em; }
        .logo-title span { color: var(--primary); }
        .live-badge {
            font-size: 0.72rem;
            background: rgba(16, 185, 129, 0.15);
            color: var(--success);
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: 600;
        }

        /* Container */
        .container {
            max-width: 1350px;
            width: 100%;
            margin: 0 auto;
            padding: 1.75rem 1.25rem;
            flex: 1;
        }

        /* Summary Stats Cards */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1rem;
            margin-bottom: 1.75rem;
        }
        .stat-box {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 1.25rem;
        }
        .stat-label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem; }
        .stat-number { font-size: 1.85rem; font-weight: 800; color: #ffffff; }
        .stat-pill { font-size: 0.72rem; color: var(--success); font-weight: 600; margin-top: 0.25rem; }

        /* Controls & Navigation Tabs */
        .controls-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            flex-wrap: wrap;
            margin-bottom: 1.25rem;
        }
        .nav-tabs { display: flex; gap: 0.5rem; }
        .tab-link {
            padding: 0.65rem 1.15rem;
            border-radius: 6px;
            font-size: 0.88rem;
            font-weight: 700;
            text-decoration: none;
            color: var(--text-muted);
            background: var(--card);
            border: 1px solid var(--border);
            transition: all 0.2s;
        }
        .tab-link.active {
            background: var(--primary);
            color: #ffffff;
            border-color: var(--primary);
        }
        .tab-link:hover:not(.active) {
            background: var(--card-hover);
            color: #ffffff;
        }

        .search-box {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            width: 100%;
            max-width: 340px;
        }

        /* Table Design */
        .table-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.88rem;
        }
        th {
            background: #0f1523;
            padding: 0.85rem 1rem;
            color: var(--text-muted);
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid var(--border);
            text-align: left;
            white-space: nowrap;
        }
        td {
            padding: 1rem;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            vertical-align: middle;
        }
        tr:hover td { background: rgba(255,255,255,0.02); }

        .name-cell { font-weight: 700; color: #ffffff; font-size: 0.95rem; }
        .email-link { color: #60a5fa; text-decoration: none; font-size: 0.82rem; }
        .email-link:hover { text-decoration: underline; }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            background: rgba(255, 36, 36, 0.12);
            color: #f87171;
            border: 1px solid rgba(255, 36, 36, 0.25);
            border-radius: 4px;
            font-size: 0.76rem;
            font-weight: 600;
        }
        .badge-blue {
            background: rgba(59, 130, 246, 0.12);
            color: #93c5fd;
            border-color: rgba(59, 130, 246, 0.3);
        }
        .date-cell { font-size: 0.8rem; color: var(--text-muted); white-space: nowrap; }

        /* Detail Modal Popup */
        .modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.75);
            backdrop-filter: blur(4px);
            display: none;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            z-index: 999;
        }
        .modal-card {
            background: var(--card);
            border: 1px solid var(--border-light);
            border-radius: var(--radius);
            max-width: 550px;
            width: 100%;
            padding: 1.75rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.25rem;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid var(--border);
        }
        .modal-title { font-size: 1.15rem; font-weight: 800; color: #ffffff; }
        .modal-close {
            background: none; border: none; font-size: 1.4rem; color: var(--text-muted); cursor: pointer;
        }
        .modal-close:hover { color: #ffffff; }
        .modal-body p { margin-bottom: 0.75rem; font-size: 0.9rem; }
        .modal-body strong { color: #ffffff; font-size: 0.82rem; text-transform: uppercase; display: block; margin-bottom: 2px; }

        .empty-state { padding: 4rem 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.92rem; }
    </style>
</head>
<body>

<?php if (!$is_logged_in): ?>
    <!-- 🔒 CLEAN LOGIN SCREEN -->
    <div class="login-wrap">
        <div class="login-card">
            <div class="login-header">
                <div class="login-logo">TECH<span>XPT</span></div>
                <div class="login-sub">Admin Leads Portal</div>
            </div>

            <?php if (!empty($login_error)): ?>
                <div class="alert-error"><?= safe($login_error) ?></div>
            <?php endif; ?>

            <form method="POST" action="admin.php">
                <input type="hidden" name="action" value="login">
                <input type="hidden" name="csrf_token" value="<?= safe($_SESSION['csrf_token']) ?>">

                <div class="form-group">
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Enter username" required autofocus autocomplete="username">
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Enter password" required autocomplete="current-password">
                </div>

                <button type="submit" class="btn-primary">Sign In</button>
            </form>
        </div>
    </div>

<?php else: ?>
    <!-- 📊 CLEAN ADMIN DASHBOARD -->
    <header class="navbar">
        <div class="logo-area">
            <div class="logo-title">TECH<span>XPT</span> ADMIN</div>
            <span class="live-badge">● Database Connected</span>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center;">
            <a href="admin.php?action=logout" class="btn-action" style="color: #f87171; border-color: rgba(239,68,68,0.3);">
                Sign Out
            </a>
        </div>
    </header>

    <div class="container">

        <!-- Top Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-label">Total Contact Inquiries</div>
                <div class="stat-number"><?= count($contacts) ?></div>
                <div class="stat-pill">+<?= $today_contacts ?> submitted today</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Total Internship Applications</div>
                <div class="stat-number"><?= count($internships) ?></div>
                <div class="stat-pill">+<?= $today_interns ?> submitted today</div>
            </div>
            <div class="stat-box">
                <div class="stat-label">Cloud Database Storage</div>
                <div class="stat-number" style="font-size: 1.4rem; color: var(--success); padding-top: 0.3rem;">
                    Aiven Cloud MySQL
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
                    Encrypted SSL Active
                </div>
            </div>
        </div>

        <!-- Navigation Tabs & Actions -->
        <div class="controls-header">
            <div class="nav-tabs">
                <a href="admin.php?tab=contacts" class="tab-link <?= $active_tab === 'contacts' ? 'active' : '' ?>">
                    Contact Leads (<?= count($contacts) ?>)
                </a>
                <a href="admin.php?tab=internships" class="tab-link <?= $active_tab === 'internships' ? 'active' : '' ?>">
                    Internship Applicants (<?= count($internships) ?>)
                </a>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <div class="search-box">
                    <input 
                        type="text" 
                        id="searchInput" 
                        placeholder="Search by name, email, phone..." 
                        onkeyup="searchRecords()"
                    >
                </div>
                <a href="admin.php?export=<?= $active_tab === 'contacts' ? 'contacts' : 'internships' ?>" class="btn-action" style="background: var(--primary); border-color: var(--primary); color: #fff; font-weight: 700;">
                    📥 Download Excel (CSV)
                </a>
            </div>
        </div>

        <!-- TAB 1: CONTACT INQUIRIES -->
        <?php if ($active_tab === 'contacts'): ?>
            <div class="table-card">
                <table id="recordsTable">
                    <thead>
                        <tr>
                            <th>Client Name</th>
                            <th>Contact Info</th>
                            <th>Service Requested</th>
                            <th>Date</th>
                            <th>Quick Actions</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($contacts)): ?>
                            <tr><td colspan="6" class="empty-state">No inquiries received yet.</td></tr>
                        <?php else: ?>
                            <?php foreach ($contacts as $c): ?>
                                <?php 
                                    $phone_digits = cleanPhone($c['phone']); 
                                    $json_data = htmlspecialchars(json_encode([
                                        'title' => 'Contact Inquiry Details',
                                        'name' => $c['name'],
                                        'email' => $c['email'],
                                        'phone' => $c['phone'] ?: 'None',
                                        'service' => $c['service'] ?: 'General Inquiry',
                                        'message' => $c['message'],
                                        'date' => date('M d, Y · h:i A', strtotime($c['created_at']))
                                    ]), ENT_QUOTES, 'UTF-8');
                                ?>
                                <tr class="record-row">
                                    <td>
                                        <div class="name-cell"><?= safe($c['name']) ?></div>
                                        <button onclick="viewDetails(<?= $json_data ?>)" style="background: none; border: none; color: #60a5fa; font-size: 0.76rem; cursor: pointer; padding: 0; margin-top: 2px;">
                                            View Full Message &rarr;
                                        </button>
                                    </td>
                                    <td>
                                        <div><a href="mailto:<?= safe($c['email']) ?>" class="email-link"><?= safe($c['email']) ?></a></div>
                                        <?php if (!empty($c['phone'])): ?>
                                            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;"><?= safe($c['phone']) ?></div>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span class="badge"><?= safe($c['service'] ?: 'General Inquiry') ?></span>
                                    </td>
                                    <td class="date-cell">
                                        <?= safe(date('M d, Y · h:i A', strtotime($c['created_at']))) ?>
                                    </td>
                                    <td>
                                        <div style="display: flex; gap: 5px;">
                                            <a href="mailto:<?= safe($c['email']) ?>" class="btn-action btn-mail" title="Send Email">
                                                ✉ Email
                                            </a>
                                            <?php if (!empty($phone_digits)): ?>
                                                <a href="https://wa.me/<?= $phone_digits ?>" target="_blank" class="btn-action btn-whatsapp" title="Chat on WhatsApp">
                                                    💬 WhatsApp
                                                </a>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                    <td>
                                        <form method="POST" action="admin.php" onsubmit="return confirm('Are you sure you want to delete this lead?');">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="table" value="contacts">
                                            <input type="hidden" name="tab" value="contacts">
                                            <input type="hidden" name="id" value="<?= safe($c['id']) ?>">
                                            <input type="hidden" name="csrf_token" value="<?= safe($_SESSION['csrf_token']) ?>">
                                            <button type="submit" class="btn-action btn-delete">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

        <!-- TAB 2: INTERNSHIP APPLICATIONS -->
        <?php else: ?>
            <div class="table-card">
                <table id="recordsTable">
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Contact Info</th>
                            <th>Internship Track</th>
                            <th>College / Degree</th>
                            <th>Date</th>
                            <th>Quick Actions</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($internships)): ?>
                            <tr><td colspan="7" class="empty-state">No internship applications received yet.</td></tr>
                        <?php else: ?>
                            <?php foreach ($internships as $in): ?>
                                <?php 
                                    $phone_digits = cleanPhone($in['phone']); 
                                    $json_data = htmlspecialchars(json_encode([
                                        'title' => 'Internship Application Details',
                                        'name' => $in['name'],
                                        'email' => $in['email'],
                                        'phone' => $in['phone'],
                                        'track' => $in['domain'] . ' (' . ($in['experience'] ?: '3 Months') . ')',
                                        'college' => $in['education'] ?: 'Not specified',
                                        'notes' => $in['notes'] ?: 'No additional notes provided.',
                                        'date' => date('M d, Y · h:i A', strtotime($in['created_at']))
                                    ]), ENT_QUOTES, 'UTF-8');
                                ?>
                                <tr class="record-row">
                                    <td>
                                        <div class="name-cell"><?= safe($in['name']) ?></div>
                                        <button onclick="viewDetails(<?= $json_data ?>)" style="background: none; border: none; color: #60a5fa; font-size: 0.76rem; cursor: pointer; padding: 0; margin-top: 2px;">
                                            View Full Profile &rarr;
                                        </button>
                                    </td>
                                    <td>
                                        <div><a href="mailto:<?= safe($in['email']) ?>" class="email-link"><?= safe($in['email']) ?></a></div>
                                        <div style="font-size: 0.8rem; color: #34d399; font-weight: 600; margin-top: 2px;"><?= safe($in['phone']) ?></div>
                                    </td>
                                    <td>
                                        <span class="badge badge-blue"><?= safe($in['domain']) ?></span>
                                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">
                                            <?= safe($in['experience'] ?: '3 Months') ?>
                                        </div>
                                    </td>
                                    <td style="font-size: 0.84rem; color: #d1d5db; max-width: 200px;">
                                        <?= safe($in['education'] ?: 'Not Specified') ?>
                                    </td>
                                    <td class="date-cell">
                                        <?= safe(date('M d, Y · h:i A', strtotime($in['created_at']))) ?>
                                    </td>
                                    <td>
                                        <div style="display: flex; gap: 5px;">
                                            <a href="mailto:<?= safe($in['email']) ?>" class="btn-action btn-mail" title="Send Email">
                                                ✉ Email
                                            </a>
                                            <?php if (!empty($phone_digits)): ?>
                                                <a href="https://wa.me/<?= $phone_digits ?>" target="_blank" class="btn-action btn-whatsapp" title="Chat on WhatsApp">
                                                    💬 WhatsApp
                                                </a>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                    <td>
                                        <form method="POST" action="admin.php" onsubmit="return confirm('Are you sure you want to delete this applicant?');">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="table" value="internships">
                                            <input type="hidden" name="tab" value="internships">
                                            <input type="hidden" name="id" value="<?= safe($in['id']) ?>">
                                            <input type="hidden" name="csrf_token" value="<?= safe($_SESSION['csrf_token']) ?>">
                                            <button type="submit" class="btn-action btn-delete">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>

    </div>

    <!-- 🔍 DETAIL MODAL -->
    <div id="detailModal" class="modal-overlay" onclick="if(event.target === this) closeModal();">
        <div class="modal-card">
            <div class="modal-header">
                <div id="modalTitle" class="modal-title">Details</div>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div id="modalContent" class="modal-body">
                <!-- Dynamically populated -->
            </div>
            <div style="text-align: right; margin-top: 1.25rem; border-top: 1px solid var(--border); padding-top: 0.75rem;">
                <button onclick="closeModal()" class="btn-action" style="padding: 0.5rem 1.2rem;">Close</button>
            </div>
        </div>
    </div>

    <script>
        // Live Search Filter
        function searchRecords() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            const rows = document.querySelectorAll('.record-row');

            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        }

        // View Details Modal
        function viewDetails(data) {
            document.getElementById('modalTitle').innerText = data.title || 'Submission Details';
            
            let html = `
                <p><strong>Full Name:</strong> ${escapeHtml(data.name)}</p>
                <p><strong>Email Address:</strong> <a href="mailto:${escapeHtml(data.email)}" style="color: #60a5fa;">${escapeHtml(data.email)}</a></p>
                <p><strong>Phone / WhatsApp:</strong> ${escapeHtml(data.phone || 'None')}</p>
            `;

            if (data.service) {
                html += `<p><strong>Service / Budget:</strong> ${escapeHtml(data.service)}</p>`;
            }
            if (data.track) {
                html += `<p><strong>Internship Track:</strong> ${escapeHtml(data.track)}</p>`;
            }
            if (data.college) {
                html += `<p><strong>College / Degree:</strong> ${escapeHtml(data.college)}</p>`;
            }
            if (data.message) {
                html += `<p><strong>Project Message / Brief:</strong><br><span style="color: #d1d5db; white-space: pre-wrap;">${escapeHtml(data.message)}</span></p>`;
            }
            if (data.notes) {
                html += `<p><strong>Applicant Notes:</strong><br><span style="color: #d1d5db; white-space: pre-wrap;">${escapeHtml(data.notes)}</span></p>`;
            }

            html += `<p style="font-size: 0.78rem; color: #9ca3af; margin-top: 1rem;"><strong>Submitted On:</strong> ${escapeHtml(data.date)}</p>`;

            document.getElementById('modalContent').innerHTML = html;
            document.getElementById('detailModal').style.display = 'flex';
        }

        function closeModal() {
            document.getElementById('detailModal').style.display = 'none';
        }

        function escapeHtml(str) {
            if (!str) return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }
    </script>
<?php endif; ?>

</body>
</html>
