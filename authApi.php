<?php
require 'data/functionsManager.php';
require 'data/dbConnect.php';

header("Content-Type: application/json");

$response = ['status' => 'error', 'message' => 'Invalid request'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Login API call
    if (isset($_POST['login'])) {
        $email = $_POST['email'];
        $password = $_POST['password'];
        $login_data = [
            'email' => $email,
            'password' => $password
        ];
        $response = authenticateUser($conn, $login_data);
    } 
    
    // Register API call
    elseif (isset($_POST['register'])) {
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

// Sending the api response back
echo json_encode($response);

