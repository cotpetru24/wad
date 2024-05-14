<?php
header("Access-Control-Allow-Origin: *");
require "db_connect.php";
require "functions_manager";


if ($_SERVER['REQUEST_METHOD']=='GET'){
    getRecipesList($conn);
} 
else if ($_SERVER['REQUEST_METHOD']== 'POST'){

    if (isset($_POST['function'])){
        switch ($_POST['function']){
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
            case 'sendMessage':
                sendMessage($conn, $_POST['json data here']);
                break;
        }
    }
}

$conn->close()
?>