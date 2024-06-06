<?php

session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Enabling error reporting 
// and
// Logging the request method and paramenter
// For debugging and development purposes
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
error_log("GET data: " . print_r($_GET, true));


require "db_connect.php";
require_once "functions_manager.php";


$response = [];

// GET method API calls
if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    //Switch to determin which function to execute
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
} 

// POST method API calls
else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    error_log("POST data: " . print_r($data, true));

    //Switch to determin which function to execute
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
            case 'deleteUser':
                deleteUser($conn, $data);
                break;
            case 'filterUsers':
                filterUsers($conn, $data);
                break;
            case 'searchUsers':
                searchUsers($conn, $data);
                break;
            case 'editUser':
                editUser($conn, $data);
                break;
            case 'getFavourites':
                getFavourites($conn, $data);
                break;
            case 'addFavourite':
                addFavourite($conn, $data);
                break;
            case 'removeFavourite':
                removeFavourite($conn, $data);
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
