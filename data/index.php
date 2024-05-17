<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require "db_connect.php";
require_once "functions_manager.php";

// Read the input and determine the function to call
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Log the received data
error_log(print_r($data, TRUE));

$response = [];

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    // this is for the new get recipes and messages list, comment it out if it doesnt work to add this to list messages

    if(isset($data['function'])) {
        switch ($data['function']) {
            case 'getRecipesList':
                getRecipesList($conn);
            break;
            case 'getMessagesList':
                getMessagesList($conn);
            break;
        }
    }

    getRecipesList($conn);
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($data['function'])) {
        switch ($data['function']) {
            case 'removeRecipe':
                removeRecipe($conn, $data['recipeID']);
                break;
            case 'addRecipe':
                addRecipe($conn, $data['json']);
                break;
            case 'editRecipe':
                editRecipe($conn, $data['recipeID'], $data['json']);
                break;
            case 'viewRecipe':
                viewRecipe($conn, $data['recipeID']);
                break;
            case 'insertImage':
                insertImage($conn, $data['image']);
                break;
            case 'sendMessage':
                sendMessage($conn, $data);
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
