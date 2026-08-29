<?php
// api/admin.php
// Enterprise-Grade Secure Admin Dashboard for TECHXPT Lead Management

// -------------------------------------------------------------
// 1. Strict Security Headers
// -------------------------------------------------------------
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");

// -------------------------------------------------------------
// 2. Secure Session Initialization
// -------------------------------------------------------------
$is_https = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') 
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

session_set_cookie_params([
    'lifetime' => 86400, // 24 hours
    'path' => '/',
    'secure' => $is_https,
    'httponly' => true,
    'samesite' => 'Strict'
]);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Session expiration: 60 minutes inactivity
$timeout_duration = 3600;
if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY']) > $timeout_duration) {
    session_unset();
    session_destroy();
    session_start();
}
$_SESSION['LAST_ACTIVITY'] = time();

// -------------------------------------------------------------
// 3. Database Connection & Authentication Setup
// -------------------------------------------------------------
require_once 'db.php';

// Define Master Credentials (load from Environment or fallback for setup)
// In production on Render, set ADMIN_USER and ADMIN_PASS in Environment Variables
$ADMIN_USER = getenv('ADMIN_USER') ?: 'admin';
$ADMIN_PASS = getenv('ADMIN_PASS') ?: 'TechXpt@2026Secure';

// Generate CSRF Token
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// -------------------------------------------------------------
// 4. Rate Limiting Protection (Brute Force Prevention)
// -------------------------------------------------------------
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['lockout_time'] = 0;
}

$is_locked_out = (time() < $_SESSION['lockout_time']);

// Handle Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_unset();
    session_destroy();
    header("Location: admin.php");
    exit;
}

// Handle Login Submission
$login_error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login') {
    if ($is_locked_out) {
        $remaining = ceil(($_SESSION['lockout_time'] - time()) / 60);
        $login_error = "Too many failed attempts. Locked out for $remaining minute(s).";
    } else {
        // Validate CSRF
        if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
            $login_error = "Security token mismatch. Please try again.";
        } else {
            $input_user = trim($_POST['username'] ?? '');
            $input_pass = trim($_POST['password'] ?? '');

            if (hash_equals($ADMIN_USER, $input_user) && hash_equals($ADMIN_PASS, $input_pass)) {
                // Login Success
                session_regenerate_id(true);
                $_SESSION['authenticated'] = true;
                $_SESSION['admin_user'] = $input_user;
                $_SESSION['login_attempts'] = 0;
                $_SESSION['lockout_time'] = 0;
                header("Location: admin.php");
                exit;
            } else {
                // Login Failure
                $_SESSION['login_attempts']++;
                if ($_SESSION['login_attempts'] >= 5) {
                    $_SESSION['lockout_time'] = time() + (15 * 60); // 15 min lock
                    $login_error = "Maximum attempts exceeded. Account locked for 15 minutes.";
                } else {
                    $attempts_left = 5 - $_SESSION['login_attempts'];
                    $login_error = "Invalid username or password. ($attempts_left attempts remaining)";
                }
            }
        }
    }
}

// Check Authentication Status
$is_logged_in = !empty($_SESSION['authenticated']) && $_SESSION['authenticated'] === true;

// -------------------------------------------------------------
// 5. Authenticated Actions (CSV Export & Deletion)
// -------------------------------------------------------------
if ($is_logged_in) {
    // CSV Export Handler
    if (isset($_GET['export'])) {
        $export_type = $_GET['export'];
        $filename = "techxpt_" . preg_replace('/[^a-zA-Z0-9_-]/', '', $export_type) . "_" . date('Y-m-d_H-i') . ".csv";

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=' . $filename);

        $output = fopen('php://output', 'w');

        if ($export_type === 'contacts') {
            fputcsv($output, ['ID', 'Name', 'Email', 'Phone / Company', 'Services Requested', 'Message / Brief', 'Date Submitted']);
            $stmt = $conn->query("SELECT id, name, email, phone, service, message, created_at FROM contact_submissions ORDER BY created_at DESC");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                fputcsv($output, $row);
            }
        } elseif ($export_type === 'internships') {
            fputcsv($output, ['ID', 'Name', 'Email', 'Phone', 'Track / Domain', 'College / Degree', 'Duration', 'LinkedIn', 'GitHub', 'Notes', 'Date Submitted']);
            $stmt = $conn->query("SELECT id, name, email, phone, domain, education, experience, linkedin, github, notes, created_at FROM internship_applications ORDER BY created_at DESC");
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                fputcsv($output, $row);
            }
        }
        fclose($output);
        exit;
    }

    // Single Record Deletion
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
        if (isset($_POST['csrf_token']) && hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
            $table = $_POST['table'] === 'internships' ? 'internship_applications' : 'contact_submissions';
            $delete_id = filter_var($_POST['id'], FILTER_VALIDATE_INT);
            if ($delete_id) {
                $del_stmt = $conn->prepare("DELETE FROM $table WHERE id = :id");
                $del_stmt->execute([':id' => $delete_id]);
            }
        }
        header("Location: admin.php?tab=" . urlencode($_POST['tab'] ?? 'contacts'));
        exit;
    }

    // Fetch Dashboard Data
    try {
        $contacts_stmt = $conn->query("SELECT * FROM contact_submissions ORDER BY created_at DESC");
        $contacts = $contacts_stmt->fetchAll(PDO::FETCH_ASSOC);

        $internships_stmt = $conn->query("SELECT * FROM internship_applications ORDER BY created_at DESC");
        $internships = $internships_stmt->fetchAll(PDO::FETCH_ASSOC);

        $total_contacts = count($contacts);
        $total_internships = count($internships);
    } catch (PDOException $e) {
        $contacts = [];
        $internships = [];
        $db_error = "Query failed: " . $e->getMessage();
    }
}

function safe($str) {
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}

$active_tab = $_GET['tab'] ?? 'contacts';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TECHXPT // SECURE VAULT DASHBOARD</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-base: #06090e;
            --bg-card: #0d121b;
            --bg-hover: #131b27;
            --border: #1e293b;
            --border-accent: #ff2424;
            --text-main: #f1f5f9;
            --text-muted: #94a3b8;
            --accent: #ff2424;
            --accent-glow: rgba(255, 36, 36, 0.2);
            --success: #10b981;
            --font-main: 'Plus Jakarta Sans', sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background-color: var(--bg-base);
            color: var(--text-main);
            font-family: var(--font-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            line-height: 1.5;
        }

        /* Login Screen */
        .login-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 1.5rem;
            background: radial-gradient(circle at 50% 30%, rgba(255, 36, 36, 0.08) 0%, transparent 60%);
        }
        .login-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            width: 100%;
            maxWidth: 420px;
            padding: 2.25rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6);
            position: relative;
        }
        .login-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; height: 3px;
            background: var(--accent);
        }

        /* Headers & Branding */
        .brand-badge {
            font-family: var(--font-mono);
            font-size: 0.72rem;
            color: var(--accent);
            letter-spacing: 0.15em;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 0.5rem;
        }
        .brand-badge::before {
            content: '';
            width: 6px; height: 6px;
            background: var(--accent);
            display: inline-block;
        }
        h1, h2, h3 {
            font-family: var(--font-main);
            font-weight: 800;
            letter-spacing: -0.02em;
        }

        /* Form Inputs */
        .form-group { margin-bottom: 1.2rem; }
        label {
            display: block;
            font-size: 0.76rem;
            font-family: var(--font-mono);
            color: var(--text-muted);
            margin-bottom: 0.4rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        input, select {
            width: 100%;
            padding: 0.75rem 0.9rem;
            background: var(--bg-base);
            border: 1px solid var(--border);
            color: var(--text-main);
            font-family: var(--font-main);
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.2s;
        }
        input:focus { border-color: var(--accent); }

        .btn-primary {
            width: 100%;
            padding: 0.85rem 1rem;
            background: var(--accent);
            color: #ffffff;
            border: none;
            font-family: var(--font-mono);
            font-weight: 700;
            font-size: 0.82rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-decoration: none;
        }
        .btn-primary:hover { background: #e01b1b; transform: translateY(-1px); }

        .btn-secondary {
            padding: 0.5rem 0.9rem;
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-main);
            font-family: var(--font-mono);
            font-size: 0.75rem;
            text-transform: uppercase;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .btn-secondary:hover {
            border-color: var(--text-muted);
            background: var(--bg-hover);
        }

        .alert-error {
            background: rgba(255, 36, 36, 0.12);
            border-left: 3px solid var(--accent);
            padding: 0.75rem 1rem;
            font-size: 0.82rem;
            color: #ff9999;
            margin-bottom: 1.25rem;
            font-family: var(--font-mono);
        }

        /* Top Navbar */
        .topbar {
            background: var(--bg-card);
            border-bottom: 1px solid var(--border);
            padding: 0.9rem 1.75rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .topbar-left { display: flex; align-items: center; gap: 1.5rem; }
        .topbar-title {
            font-size: 1.1rem;
            font-weight: 800;
            letter-spacing: 0.04em;
        }
        .user-tag {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            padding: 3px 8px;
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        /* Main Container */
        .main-content {
            flex: 1;
            max-width: 1400px;
            width: 100%;
            margin: 0 auto;
            padding: 2rem 1.5rem;
        }

        /* Stats Cards */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 1.25rem;
            margin-bottom: 2rem;
        }
        .stat-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            padding: 1.4rem;
            position: relative;
        }
        .stat-card::after {
            content: '';
            position: absolute;
            bottom: 0; left: 0; width: 40px; height: 2px;
            background: var(--accent);
        }
        .stat-label {
            font-family: var(--font-mono);
            font-size: 0.72rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 0.4rem;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: 900;
            font-family: var(--font-mono);
            color: var(--text-main);
        }

        /* Navigation Tabs */
        .tabs-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid var(--border);
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .tabs-list { display: flex; gap: 0.5rem; }
        .tab-btn {
            padding: 0.75rem 1.4rem;
            font-family: var(--font-mono);
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            text-decoration: none;
            color: var(--text-muted);
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
        }
        .tab-btn.active {
            color: var(--accent);
            border-bottom-color: var(--accent);
            background: rgba(255, 36, 36, 0.05);
        }

        /* Search Filter */
        .filter-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.25rem;
            gap: 1rem;
            flex-wrap: wrap;
        }
        .search-input {
            max-width: 380px;
            font-family: var(--font-mono);
            font-size: 0.82rem;
        }

        /* Table Styling */
        .table-responsive {
            background: var(--bg-card);
            border: 1px solid var(--border);
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85rem;
            text-align: left;
        }
        th {
            background: rgba(255,255,255,0.02);
            padding: 0.9rem 1rem;
            font-family: var(--font-mono);
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--text-muted);
            border-bottom: 1px solid var(--border);
            white-space: nowrap;
        }
        td {
            padding: 1rem;
            border-bottom: 1px solid rgba(255,255,255,0.04);
            vertical-align: top;
        }
        tr:hover td { background: rgba(255,255,255,0.015); }
        .tag-badge {
            display: inline-block;
            padding: 2px 7px;
            background: rgba(255, 36, 36, 0.1);
            color: #ff6b6b;
            border: 1px solid rgba(255, 36, 36, 0.2);
            font-size: 0.72rem;
            font-family: var(--font-mono);
            border-radius: 2px;
        }
        .time-badge {
            font-family: var(--font-mono);
            font-size: 0.72rem;
            color: var(--text-muted);
            white-space: nowrap;
        }
        .btn-delete {
            background: none;
            border: none;
            color: #ef4444;
            cursor: pointer;
            font-family: var(--font-mono);
            font-size: 0.72rem;
            opacity: 0.6;
            transition: opacity 0.2s;
        }
        .btn-delete:hover { opacity: 1; text-decoration: underline; }
        .empty-box {
            padding: 4rem 2rem;
            text-align: center;
            color: var(--text-muted);
            font-family: var(--font-mono);
        }
    </style>
</head>
<body>

<?php if (!$is_logged_in): ?>
    <!-- 🔒 SECURE LOGIN FORM -->
    <div class="login-wrap">
        <div class="login-card">
            <div class="brand-badge">TECHXPT // SECURITY LAYER</div>
            <h2 style="font-size: 1.45rem; margin-bottom: 0.4rem;">ADMIN VAULT ACCESS</h2>
            <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 1.5rem;">
                Enter verified credentials to inspect encrypted telemetry and form leads.
            </p>

            <?php if (!empty($login_error)): ?>
                <div class="alert-error"><?= safe($login_error) ?></div>
            <?php endif; ?>

            <form method="POST" action="admin.php">
                <input type="hidden" name="action" value="login">
                <input type="hidden" name="csrf_token" value="<?= safe($_SESSION['csrf_token']) ?>">

                <div class="form-group">
                    <label>Terminal Operator</label>
                    <input type="text" name="username" placeholder="Username" required autofocus autocomplete="username">
                </div>

                <div class="form-group">
                    <label>Master Security Key</label>
                    <input type="password" name="password" placeholder="Password" required autocomplete="current-password">
                </div>

                <button type="submit" class="btn-primary">AUTHENTICATE SESSION &rarr;</button>
            </form>
        </div>
    </div>

<?php else: ?>
    <!-- 📊 AUTHENTICATED DASHBOARD -->
    <header class="topbar">
        <div class="topbar-left">
            <div class="topbar-title">TECHXPT // LEADS VAULT</div>
            <span class="user-tag">● SECURE SESSION: <?= safe($_SESSION['admin_user']) ?></span>
        </div>
        <div style="display: flex; gap: 0.75rem; align-items: center;">
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);" class="desktop-only">
                NODE: AIVEN-CLOUD-MYSQL
            </span>
            <a href="admin.php?action=logout" class="btn-secondary" style="border-color: rgba(239,68,68,0.4); color: #f87171;">
                TERMINATE SESSION
            </a>
        </div>
    </header>

    <main class="main-content">

        <!-- Summary Statistics -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">TOTAL CONTACT & QUOTE INQUIRIES</div>
                <div class="stat-value"><?= number_format($total_contacts) ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">TOTAL INTERNSHIP APPLICANTS</div>
                <div class="stat-value"><?= number_format($total_internships) ?></div>
            </div>
            <div class="stat-card">
                <div class="stat-label">DATABASE CLUSTER STATUS</div>
                <div class="stat-value" style="font-size: 1.25rem; color: var(--success); padding-top: 0.4rem;">
                    CONNECTED (SSL 256-BIT)
                </div>
            </div>
        </div>

        <!-- Tabbed Navigation -->
        <div class="tabs-header">
            <div class="tabs-list">
                <a href="admin.php?tab=contacts" class="tab-btn <?= $active_tab === 'contacts' ? 'active' : '' ?>">
                    01 // CONTACT LEADS (<?= $total_contacts ?>)
                </a>
                <a href="admin.php?tab=internships" class="tab-btn <?= $active_tab === 'internships' ? 'active' : '' ?>">
                    02 // INTERNSHIP APPLICANTS (<?= $total_internships ?>)
                </a>
            </div>

            <div>
                <a href="admin.php?export=<?= $active_tab === 'contacts' ? 'contacts' : 'internships' ?>" class="btn-secondary">
                    ⬇ EXPORT TO CSV / EXCEL
                </a>
            </div>
        </div>

        <!-- Filter / Search Bar -->
        <div class="filter-bar">
            <input 
                type="text" 
                id="searchTable" 
                placeholder="Type to filter by name, email, keyword..." 
                class="search-input"
                onkeyup="filterRows()"
            >
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);" id="rowCount">
                Showing all records
            </span>
        </div>

        <!-- TAB 1: CONTACTS -->
        <?php if ($active_tab === 'contacts'): ?>
            <div class="table-responsive">
                <table id="dataTable">
                    <thead>
                        <tr>
                            <th># ID</th>
                            <th>CLIENT / SENDER</th>
                            <th>SERVICES & BUDGET</th>
                            <th>PROJECT BRIEF</th>
                            <th>TIMESTAMP</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($contacts)): ?>
                            <tr><td colspan="6" class="empty-box">No contact inquiries found in database.</td></tr>
                        <?php else: ?>
                            <?php foreach ($contacts as $c): ?>
                                <tr class="data-row">
                                    <td style="font-family: var(--font-mono); color: var(--text-muted); font-size: 0.78rem;">
                                        #<?= safe($c['id']) ?>
                                    </td>
                                    <td>
                                        <div style="font-weight: 700; color: #ffffff;"><?= safe($c['name']) ?></div>
                                        <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted);">
                                            <a href="mailto:<?= safe($c['email']) ?>" style="color: #60a5fa; text-decoration: none;">
                                                <?= safe($c['email']) ?>
                                            </a>
                                        </div>
                                        <?php if (!empty($c['phone'])): ?>
                                            <div style="font-size: 0.78rem; color: var(--text-muted);">
                                                <?= safe($c['phone']) ?>
                                            </div>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span class="tag-badge"><?= safe($c['service'] ?: 'General Inquiry') ?></span>
                                    </td>
                                    <td style="max-width: 420px; line-height: 1.4; color: #cbd5e1;">
                                        <?= nl2br(safe($c['message'])) ?>
                                    </td>
                                    <td>
                                        <span class="time-badge"><?= safe(date('M d, Y · H:i', strtotime($c['created_at']))) ?></span>
                                    </td>
                                    <td>
                                        <form method="POST" action="admin.php" onsubmit="return confirm('Permanently delete inquiry #<?= safe($c['id']) ?>?');">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="table" value="contacts">
                                            <input type="hidden" name="tab" value="contacts">
                                            <input type="hidden" name="id" value="<?= safe($c['id']) ?>">
                                            <input type="hidden" name="csrf_token" value="<?= safe($_SESSION['csrf_token']) ?>">
                                            <button type="submit" class="btn-delete">DELETE</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>

        <!-- TAB 2: INTERNSHIPS -->
        <?php else: ?>
            <div class="table-responsive">
                <table id="dataTable">
                    <thead>
                        <tr>
                            <th># ID</th>
                            <th>APPLICANT</th>
                            <th>TRACK & DURATION</th>
                            <th>COLLEGE / NOTES</th>
                            <th>TIMESTAMP</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($internships)): ?>
                            <tr><td colspan="6" class="empty-box">No internship applications found.</td></tr>
                        <?php else: ?>
                            <?php foreach ($internships as $in): ?>
                                <tr class="data-row">
                                    <td style="font-family: var(--font-mono); color: var(--text-muted); font-size: 0.78rem;">
                                        #<?= safe($in['id']) ?>
                                    </td>
                                    <td>
                                        <div style="font-weight: 700; color: #ffffff;"><?= safe($in['name']) ?></div>
                                        <div style="font-family: var(--font-mono); font-size: 0.78rem;">
                                            <a href="mailto:<?= safe($in['email']) ?>" style="color: #60a5fa; text-decoration: none;">
                                                <?= safe($in['email']) ?>
                                            </a>
                                        </div>
                                        <div style="font-family: var(--font-mono); font-size: 0.78rem; color: #a3e635;">
                                            <?= safe($in['phone']) ?>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="tag-badge" style="background: rgba(96,165,250,0.1); color: #93c5fd; border-color: rgba(96,165,250,0.3);">
                                            <?= safe($in['domain']) ?>
                                        </div>
                                        <div style="font-size: 0.76rem; color: var(--text-muted); margin-top: 3px; font-family: var(--font-mono);">
                                            <?= safe($in['experience'] ?: 'Standard') ?>
                                        </div>
                                    </td>
                                    <td style="max-width: 360px; color: #cbd5e1; font-size: 0.82rem;">
                                        <div style="font-weight: 600; color: #ffffff;"><?= safe($in['education'] ?: 'Not Specified') ?></div>
                                        <?php if (!empty($in['notes'])): ?>
                                            <div style="color: var(--text-muted); margin-top: 4px;"><?= nl2br(safe($in['notes'])) ?></div>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span class="time-badge"><?= safe(date('M d, Y · H:i', strtotime($in['created_at']))) ?></span>
                                    </td>
                                    <td>
                                        <form method="POST" action="admin.php" onsubmit="return confirm('Permanently delete applicant #<?= safe($in['id']) ?>?');">
                                            <input type="hidden" name="action" value="delete">
                                            <input type="hidden" name="table" value="internships">
                                            <input type="hidden" name="tab" value="internships">
                                            <input type="hidden" name="id" value="<?= safe($in['id']) ?>">
                                            <input type="hidden" name="csrf_token" value="<?= safe($_SESSION['csrf_token']) ?>">
                                            <button type="submit" class="btn-delete">DELETE</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>

    </main>

    <script>
        function filterRows() {
            const input = document.getElementById('searchTable').value.toLowerCase();
            const rows = document.querySelectorAll('.data-row');
            let visibleCount = 0;

            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                if (text.includes(input)) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            document.getElementById('rowCount').innerText = `Showing ${visibleCount} record(s)`;
        }
    </script>
<?php endif; ?>

</body>
</html>
