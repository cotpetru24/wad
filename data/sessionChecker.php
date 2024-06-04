<?php
session_start();
error_log(print_r($_SESSION, true)); // Log session data for debugging

function check_user_session($role = null) {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        error_log("User not logged in. Redirecting to index.php.");
        header("Location: index.php");
        exit();
    }

    // Check if the user's role matches the required role
    if ($role && (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== $role)) {
        error_log("User role does not match required role. Redirecting to index.php.");
        header("Location: index.php");
        exit();
    }

    error_log("User is logged in and has the required role.");
}

function isUserLoggedIn() {
    return isset($_SESSION['user_id']);
}

function isAdmin() {
    return isset($_SESSION['user_type']) && $_SESSION['user_type'] === 'admin';
}
?>
