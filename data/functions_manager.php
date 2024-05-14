<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require "db_connect.php";


//function that returns a list of recipes
function getRecipesList($conn, $filterCriteria = []){
    $sql = "SELECT * FROM recipes WHERE 1=1";
    $param = [];
    if (!empty($filterCriteria)){
        foreach ($filterCriteria as $key => $value){
            $sql.= "AND $key=?";
            $param[] = $value;
        }
    }

    $stmt = $conn->prepare($sql);
    foreach ($param as $index => $param){
        $stmt->bindValue($index + 1, $param);
    }

    if(($stmt->execute())->num_rows > 0){
        $results = array();
        while($row = $result->fetch_assoc()){
            array_push($results, $row);
        }
        $resultsJSON=json_encode($results);
        echo $resultsJSON;
        return $resultsJSON;
    }
    // else{
    //     // echo '[{"recipe_id" : "0", "dish_name": "No results", "dish_recipe_description" : "No recipes to list", 
    //     //     "dish_ingredients": "No ingredients"}, "dish_complexity_id" : "1", "dish_prep_time" : "0"]';
    // }

}


function removeRecipe($conn, $id){
    $sql = 'DELETE FROM recipes WHERE recipe_id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bindParam('i', $id, PDO::PARAM_INT);

    If ($stmt->execute()){
        echo 'recipe removed successfully';
    }
    else{
        echo 'Error removing recipe: '.$sql.'.'.$stmt->error;
    }

    $stmt->close();

} 

function addRecipe($conn, $jsonData){
    $sql = 'INSERT INTO recipes (
        dish_name, dish_origin_id, dish_recipe_description, dish_category_id, dish_ingredients, dish_complexity_id, dish_prep_time)
        VALUES (?,?,?,?,?,?,?)';
    $stmt = $conn->prepare($sql);
    $stmt->bindParam('sisisii', $jsonData);
    
    if ($stmt->execute()){
        echo 'recipe added successfully';
    }
    else{
        echo 'error adding recipe: '.$sql. "." .$stmt->error;
    }

    $stmt->close();

}



function viewRecipe($conn, $id){
    $sql = "SELECT recipe_id, dish_name, dish_recipe_description, dish_ingredients, dish_complexity_id, dish_prep_time FROM recipes
    WHERE recipe_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam('i', $id);
    $result = $stmt->execute();

    if($result->num_rows == 1){    
        echo 'recipe viewed successfully';
    }
    else{
        echo 'error retrieving recipe: '.$sql. "." .$stmt->error;
    }
$stmt->close();
}



function editRecipe($conn, $id, $json){
    $sql = "UPDATE recipes SET dish_name, dish_recipe_description, dish_ingredients, dish_complexity_id, dish_prep_time =?,?,?,?,?,?,
    WHERE recipe_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam("i", $id);

    if ($stmt->execute()){
        echo 'recipe edited successfully';
    }
    else{
        echo 'error editing recipe: '.$sql. "." .$stmt->error;
    }

    $stmt->close();
}




function sendMessage($conn, $data) {
    $response = array("status" => "", "message" => "");
    $sql = "INSERT INTO messages (sender_name, sender_email, message_text) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $data['name'], $data['email'], $data['message']);

    if ($stmt->execute()) {
        $response["status"] = "success";
        $response["message"] = "Message sent successfully";
    } else {
        $response["status"] = "error";
        $response["message"] = "Error sending message: " . $stmt->error;
    }

    $stmt->close();
    echo json_encode($response);
}



