<?php
session_start();

// Logging session data for debugging and development purposes
error_log(print_r($_SESSION, true));


// Function to check the $_SESSION for a user
function check_user_session($role = null)
{
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        error_log("User not logged in. Redirecting to index.php.");
        header("Location: index.php");
        exit();
    }

    // Check if the user_type matches the required user_type
    if ($role && (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== $role)) {
        error_log("User role does not match required role. Redirecting to index.php.");
        header("Location: index.php");
        exit();
    }

    error_log("User is logged in and has the required role.");
}


// Function to check if a user is loged in
function isUserLoggedIn()
{
    return isset($_SESSION['user_id']);
}

// Function to check if a user is of type 'admin'
function isAdmin()
{
    return isset($_SESSION['user_type']) && $_SESSION['user_type'] === 'admin';
}
