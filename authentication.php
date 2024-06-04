<?php
require 'data/functions_manager.php'; // Ensure the session check function is included
require 'data/db_connect.php';

header("Content-Type: application/json"); // Ensure the response is JSON

$response = ['status' => 'error', 'message' => 'Invalid request']; // Default response

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['login'])) {
        // Login logic
        $email = $_POST['email'];
        $password = $_POST['password'];

        // Call the authenticateUser function
        $login_data = [
            'email' => $email,
            'password' => $password
        ];
        $response = authenticateUser($conn, $login_data);

    } elseif (isset($_POST['register'])) {
        // Registration logic
        $name = $_POST['name'];
        $surname = $_POST['surname'];
        $email = $_POST['reg_email'];
        $password = $_POST['reg_password'];
        $confirm_password = $_POST['confirm_password'];

        if ($password !== $confirm_password) {
            $response = ['status' => 'error', 'message' => 'Passwords do not match.'];
        } else {
            $register_data = [
                'name' => $name,
                'surname' => $surname,
                'email' => $email,
                'password' => $password
            ];
            $response = registerUser($conn, $register_data);
        }
    }
}

echo json_encode($response);

