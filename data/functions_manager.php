<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

function getRecipesList($conn, $filterCriteria = [])
{
    $sql = "SELECT * FROM recipes WHERE 1=1";
    $paramTypes = '';
    $paramValues = [];
    if (!empty($filterCriteria)) {
        foreach ($filterCriteria as $key => $value) {
            $sql .= " AND $key=?";
            $paramTypes .= 's'; // Assuming all parameters are strings; change as necessary
            $paramValues[] = $value;
        }
    }

    $stmt = $conn->prepare($sql);

    if (!empty($paramValues)) {
        $stmt->bind_param($paramTypes, ...$paramValues);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $results = [];
        while ($row = $result->fetch_assoc()) {
            if (!empty($row['dish_img'])) {
                $dishImgData = $row['dish_img'];
                $row['dish_img'] = 'data:image/jpeg;base64,' . base64_encode($dishImgData);
            }
            array_push($results, $row);
        }
        echo json_encode($results);
    } else {
        $noResults = [
            [
                "recipe_id" => "0",
                "dish_name" => "No results",
                "dish_recipe_description" => "No recipes to list",
                "dish_ingredients" => "No ingredients",
                "dish_complexity_id" => "1",
                "dish_prep_time" => "0"
            ]
        ];
        echo json_encode($noResults);
    }

    $stmt->close();
}

// Fucntion to retrive messages from db
function getMessagesList($conn){ 
    $sql = "SELECT * FROM messages";
    $stmt = $conn->prepare($sql);
    $result = $conn->query($sql);
    if ($stmt->execute()) {
        if ($result) {
            $results = [];
            while ($row = $result->fetch_assoc()) {
                array_push($results, $row);
            }

        echo json_encode($results);
        } else {
            $noResults = [
                [   /** to check in db if these fields are correct */
                    "message_id" => "0",
                    "sender_first_name" => "No results",
                    "sender_last_name" => "No results",
                    "message_text" => "No messages to list",
                    "message_flagged" => "0"
                ]
            ];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error sending message: " . $stmt->error]);
    }
    $stmt->close();
}

function removeRecipe($conn, $id)
{
    $sql = 'DELETE FROM recipes WHERE recipe_id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Recipe removed successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error removing recipe: ' . $stmt->error]);
    }

    $stmt->close();
}

function addRecipe($conn, $jsonData)
{
    $data = json_decode($jsonData, true);
    $sql = 'INSERT INTO recipes (
        dish_name, dish_origin_id, dish_recipe_description, dish_category_id, dish_ingredients, dish_complexity_id, dish_prep_time)
        VALUES (?, ?, ?, ?, ?, ?, ?)';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        'sisssii',
        $data['dish_name'],
        $data['dish_origin_id'],
        $data['dish_recipe_description'],
        $data['dish_category_id'],
        $data['dish_ingredients'],
        $data['dish_complexity_id'],
        $data['dish_prep_time']
    );

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Recipe added successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error adding recipe: ' . $stmt->error]);
    }

    $stmt->close();
}

function viewRecipe($conn, $id)
{
    $sql = "SELECT recipe_id, dish_name, dish_recipe_description, dish_ingredients, dish_complexity_id, dish_prep_time FROM recipes
    WHERE recipe_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error retrieving recipe: ' . $stmt->error]);
    }

    $stmt->close();
}

function editRecipe($conn, $id, $json)
{
    $data = json_decode($json, true);
    $sql = "UPDATE recipes SET dish_name=?, dish_recipe_description=?, dish_ingredients=?, dish_complexity_id=?, dish_prep_time=? WHERE recipe_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        'sssiii',
        $data['dish_name'],
        $data['dish_recipe_description'],
        $data['dish_ingredients'],
        $data['dish_complexity_id'],
        $data['dish_prep_time'],
        $id
    );

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Recipe edited successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error editing recipe: ' . $stmt->error]);
    }

    $stmt->close();
}

function sendMessage($conn, $data)
{
    $sql = "INSERT INTO messages (sender_name, sender_email, message_text) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $data['name'], $data['email'], $data['message']);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Message sent successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error sending message: " . $stmt->error]);
    }

    $stmt->close();
}


//Function to insert an image in db
function insertImage($conn, $base64Image)
{
    // Decode the Base64 encoded image
    $binaryData = base64_decode($base64Image);

    if ($binaryData === false) {
        echo json_encode(["status" => "error", "message" => "Base64 decoding failed"]);
        return;
    }

    // Prepare the SQL statement to update the image in the database
    $stmt = $conn->prepare("UPDATE recipes SET dish_img = ? WHERE dish_id = 2");

    // Bind the binary data to the prepared statement
    $null = NULL;
    $stmt->bind_param("b", $null);
    $stmt->send_long_data(0, $binaryData);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Image uploaded successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to upload image: " . $stmt->error]);
    }
    $stmt->close();
}
