<?php

session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");
require "db_connect.php";
require_once "functions_manager.php";

// Log the request method and parameters
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
error_log("GET data: " . print_r($_GET, true));

$response = [];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['function'])) {
        switch ($_GET['function']) {
            case 'getRecipesList':
                getRecipesList($conn, $_GET);
                break;
            case 'getMessagesList':
                getMessagesList($conn);
                break;
            case 'getUsersList':
                getUsersList($conn);
                break;
            default:
                $response = ["status" => "error", "message" => "Invalid function"];
                echo json_encode($response);
                exit();
        }
    } else {
        $response = ["status" => "error", "message" => "Function not specified"];
        echo json_encode($response);
        exit();
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    error_log("POST data: " . print_r($data, true));

    if (isset($data['function'])) {
        switch ($data['function']) {
            case 'deleteRecipe':
                deleteRecipe($conn, $data['recipeId']);
                break;
            case 'addNewRecipe':
                addNewRecipe($conn, $data);
                break;
            case 'editRecipe':
                editRecipe($conn, $data);
                break;
            case 'viewRecipe':
                viewRecipe($conn, $data['recipeID']);
                break;
            case 'sendMessage':
                sendMessage($conn, $data);
                break;
            case 'deleteMessage':
                deleteMessage($conn, $data['messageId']);
                break;
            case 'searchMessages': 
                searchMessages($conn, $data);
                break;
            case 'searchRecipes':
                searchRecipes($conn,$data);
                break;
            case 'filterMessages':
                filterMessages($conn, $data);
                break;
            case 'markMessageAsRead':
                markMessageAsRead($conn, $data);
                break;
            case 'flagUnflagMessage':
                flagUnflagMessage($conn, $data);
                break;
            case 'registerUser':
                registerUser($conn, $data);
                break;

            default:
                $response = ["status" => "error", "message" => "Invalid function"];
                echo json_encode($response);
                exit();
        }
    } else {
        $response = ["status" => "error", "message" => "Function not specified"];
        echo json_encode($response);
        exit();
    }
} else {
    $response = ["status" => "error", "message" => "Invalid request method"];
    echo json_encode($response);
    exit();
}

$conn->close();
?>
