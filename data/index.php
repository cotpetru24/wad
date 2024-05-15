<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require "db_connect.php";
require_once "functions_manager.php";


$input = file_get_contents("php://input");
$data = json_decode($input, true);

if ($_SERVER['REQUEST_METHOD']=='GET'){
    getRecipesList($conn);
} 
else if ($_SERVER['REQUEST_METHOD']== 'POST'){

    if (isset($data['function'])){
        switch ($data['function']){
            case 'removeRecipe':
                //remove recipe from db
                removeRecipe($conn, $_POST['recipeID']);
                break;
            case 'addRecipe':
                //add recipe to db
                addRecipe($conn, $_POST['json data shoud be passed here']);
                break;
            case 'editRecipe':
                //edit a recipe stored in db
                editRecipe($conn, $_POST['recipeID'], $_POST['json data should be passed here//may have to check exactly which attribute was changed and update only that attribute']);
                break;
            case 'viewRecipe':
                //preview a recipe from admin page
                viewRecipe($conn, $_POST['recipeID']);
                break;


                //done ======>>>>>> to add the option to lists and read messages
            case 'sendMessage':
                sendMessage($conn, $data);
                break;
        }
    }
}

$conn->close()
?>
