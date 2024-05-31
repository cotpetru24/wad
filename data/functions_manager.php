<?php
// Enable error reporting for debugging
ini_set('memory_limit', '256M');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// function getRecipesList($conn, $filterCriteria = [])
// {
//     // $sql = "SELECT * FROM recipes WHERE 1=1";
//     $sql = "SELECT 
//     recipes.dish_id, 
//     recipes.dish_name, 
//     origin.origin_country, 
//     recipes.dish_recipe_description, 
//     category.category_name, 
//     complexity.complexity_name,
//     recipes.dish_prep_time, 
//     recipes.dish_img, 
//     recipes.dish_upload_date_time, 
//     recipes.dish_rating,  
//     recipes.dish_ingredients,
//     recipes.dish_steps
//     FROM recipes
//     INNER JOIN category ON recipes.dish_category_id = category.category_id
//     INNER JOIN complexity ON recipes.dish_complexity_id = complexity.complexity_id
//     INNER JOIN origin ON recipes.dish_origin_id = origin.origin_id
//     WHERE 1=1;";
//     // ORDER BY recipes.dish_id ASC;";

//     $paramTypes = '';
//     $paramValues = [];
//     if (!empty($filterCriteria)) {
//         foreach ($filterCriteria as $key => $value) {
//             $sql .= " AND $key=?";
//             $paramTypes .= 's'; // Assuming all parameters are strings; change as necessary
//             $paramValues[] = $value;
//         }
//     }

//     $stmt = $conn->prepare($sql);

//     if (!empty($paramValues)) {
//         $stmt->bind_param($paramTypes, ...$paramValues);
//     }

//     $stmt->execute();
//     $result = $stmt->get_result();

//     if ($result->num_rows > 0) {
//         $results = [];
//         while ($row = $result->fetch_assoc()) {
//             if (!empty($row['dish_img'])) {
//                 $dishImgData = $row['dish_img'];
//                 $row['dish_img'] = 'data:image/jpeg;base64,' . base64_encode($dishImgData);
//             }
//             array_push($results, $row);
//         }
//         echo json_encode($results);
//     } else {
//         $noResults = [
//             [
//                 "recipe_id" => "0",
//                 "dish_name" => "No results",
//                 "dish_recipe_description" => "No recipes to list",
//                 "dish_ingredients" => "No ingredients",
//                 "dish_complexity_id" => "1",
//                 "dish_prep_time" => "0"
//             ]
//         ];
//         echo json_encode($noResults);
//     }

//     $stmt->close();
// }


function getRecipesList($conn, $filterCriteria = [])
{
    $sql = "SELECT 
        recipes.dish_id, 
        recipes.dish_name, 
        origin.origin_country, 
        recipes.dish_recipe_description, 
        category.category_name, 
        complexity.complexity_name,
        recipes.dish_prep_time, 
        recipes.dish_img, 
        recipes.dish_upload_date_time, 
        recipes.dish_rating,  
        recipes.dish_ingredients,
        recipes.dish_steps,
        recipes.dish_chef_recommended
        FROM recipes
        INNER JOIN category ON recipes.dish_category_id = category.category_id
        INNER JOIN complexity ON recipes.dish_complexity_id = complexity.complexity_id
        INNER JOIN origin ON recipes.dish_origin_id = origin.origin_id
        WHERE 1=1";

    $paramTypes = '';
    $paramValues = [];

    // Adding filter criteria to the SQL query
    if (!empty($filterCriteria)) {
        foreach ($filterCriteria as $key => $value) {
            if ($key !== 'function') {
                // Validate column names to prevent SQL injection
                $allowedColumns = ['dish_chef_recommended', 'dish_origin_id', 'origin_country', 'dish_rating', 'dish_prep_time', 'category_name', 'complexity_name', 'origin_country'];
                $keyParts = explode('.', $key);
                // Handle keys with two parts
                if (count($keyParts) == 2 && in_array($keyParts[1], $allowedColumns)) {
                    $sql .= " AND {$keyParts[1]}=?";
                    // Handle keys with one part
                } elseif (count($keyParts) == 1 && in_array($keyParts[0], $allowedColumns)) {
                    $sql .= " AND {$keyParts[0]}=?";
                } else {
                    // Skip invalid keys
                    continue;
                }
                // Dynamically determine parameter type
                if (is_int($value)) {
                    $paramTypes .= 'i';
                } elseif (is_float($value)) {
                    $paramTypes .= 'd';
                } elseif (is_string($value)) {
                    $paramTypes .= 's';
                } else {
                    // Default to string if type is not determined
                    $paramTypes .= 's';
                }

                $paramValues[] = $value;

            }
        }
    }

    $sql .= " ORDER BY recipes.dish_id ASC";

    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        echo json_encode(["status" => "error", "message" => "Failed to prepare SQL statement"]);
        return;
    }

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
function getMessagesList($conn)
{
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



function deleteMessage($conn, $messageId)
{
    error_log("deleteMessage called with messageId: $messageId");
    $sql = 'DELETE FROM messages WHERE message_id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $messageId);
    if ($stmt->execute()) {
        error_log("Message deleted successfully.");
        echo json_encode(['status' => 'success', 'message' => 'Message deleted successfully']);
    } else {
        error_log("Error deleting message: " . $stmt->error);
        echo json_encode(['status' => 'error', 'message' => 'Error deleting message: ' . $stmt->error]);
    }

    $stmt->close();
}



function deleteRecipe($conn, $id)
{
    $sql = 'DELETE FROM recipes WHERE dish_id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Recipe removed successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error removing recipe: ' . $stmt->error]);
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


function addNewRecipe($conn, $data)
{
    // Prepare the SQL statement to insert the new recipe
    $sql = 'INSERT INTO recipes (
        dish_name, dish_origin_id, dish_recipe_description, dish_ingredients, 
        dish_category_id, dish_complexity_id, dish_prep_time, dish_rating, dish_chef_recommended)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        'sissiiiii',
        $data['dishName'],
        $data['dishOrigin'],
        $data['dishDescription'],
        $data['dishIngredients'],
        $data['dishCategory'],
        $data['dishComplexity'],
        $data['dishPrepTime'],
        $data['dishRating'],
        $data['dishChefRecommended']
    );

    if ($stmt->execute()) {
        $lastInsertedId = $stmt->insert_id;

        if (isset($data['dishImage']) && $data['dishImage']) {
            // Decode the Base64 encoded image
            $base64Image = $data['dishImage'];
            $binaryData = base64_decode($base64Image);

            if ($binaryData === false) {
                echo json_encode(["status" => "error", "message" => "Base64 decoding failed"]);
                return;
            }

            // Prepare the SQL statement to update the image in the database
            $stmt = $conn->prepare("UPDATE recipes SET dish_img = ? WHERE dish_id = ?");
            $null = NULL;
            $stmt->bind_param("bi", $null, $lastInsertedId);
            $stmt->send_long_data(0, $binaryData);

            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Recipe added successfully with image"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to upload image: " . $stmt->error]);
            }
        } else {
            echo json_encode(["status" => "success", "message" => "Recipe added successfully without image"]);
        }
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

function editRecipe($conn, $data)
{
    $sql = "UPDATE recipes SET dish_name=?, dish_origin_id=?, dish_recipe_description=?, dish_ingredients=?, dish_complexity_id=?, 
    dish_prep_time=?, dish_category_id=?, dish_rating=? WHERE dish_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        'sissiiiii',
        $data['dishName'],
        $data['dishOrigin'],
        $data['dishDescription'],
        $data['dishIngredients'],
        $data['dishComplexity'],
        $data['dishPrepTime'],
        $data['dishCategory'],
        $data['dishRating'],
        $data['dishId']
    );


    if ($stmt->execute()) {
        if (isset($data['dishImage']) && $data['dishImage']) {
            // Decode the Base64 encoded image
            $base64Image = $data['dishImage'];
            $binaryData = base64_decode($base64Image);

            if ($binaryData === false) {
                echo json_encode(["status" => "error", "message" => "Base64 decoding failed"]);
                return;
            }

            // Prepare the SQL statement to update the image in the database
            $stmt = $conn->prepare("UPDATE recipes SET dish_img = ? WHERE dish_id = ?");
            $null = NULL;
            $stmt->bind_param("bi", $null, $data['dishId']);
            $stmt->send_long_data(0, $binaryData);

            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Recipe updated successfully with image"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to upload image: " . $stmt->error]);
            }
        } else {
            echo json_encode(["status" => "success", "message" => "Recipe updated successfully without image"]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error adding recipe: ' . $stmt->error]);
    }


























    // if ($stmt->execute()) {
    //     echo json_encode(['status' => 'success', 'message' => 'Recipe edited successfully']);
    // } else {
    //     echo json_encode(['status' => 'error', 'message' => 'Error editing recipe: ' . $stmt->error]);
    // }

    $stmt->close();
}




// //Function to insert an image in db
// function insertImage($conn, $base64Image)
// {
//     // Decode the Base64 encoded image
//     $binaryData = base64_decode($base64Image);

//     if ($binaryData === false) {
//         echo json_encode(["status" => "error", "message" => "Base64 decoding failed"]);
//         return;
//     }

//     // Prepare the SQL statement to update the image in the database
//     $stmt = $conn->prepare("UPDATE recipes SET dish_img = ? WHERE dish_id = 2");

//     // Bind the binary data to the prepared statement
//     $null = NULL;
//     $stmt->bind_param("b", $null);
//     $stmt->send_long_data(0, $binaryData);

//     if ($stmt->execute()) {
//         echo json_encode(["status" => "success", "message" => "Image uploaded successfully"]);
//     } else {
//         echo json_encode(["status" => "error", "message" => "Failed to upload image: " . $stmt->error]);
//     }
//     $stmt->close();
// }






function searchRecipes($conn, $criteria) {
    $sql = "SELECT 
                recipes.dish_id, 
                recipes.dish_name, 
                origin.origin_country, 
                recipes.dish_recipe_description, 
                category.category_name, 
                complexity.complexity_name,
                recipes.dish_prep_time, 
                recipes.dish_img, 
                recipes.dish_upload_date_time, 
                recipes.dish_rating,  
                recipes.dish_ingredients,
                recipes.dish_steps,
                recipes.dish_chef_recommended
            FROM recipes
            INNER JOIN category ON recipes.dish_category_id = category.category_id
            INNER JOIN complexity ON recipes.dish_complexity_id = complexity.complexity_id
            INNER JOIN origin ON recipes.dish_origin_id = origin.origin_id
            WHERE dish_name LIKE ?
            ORDER BY recipes.dish_name ASC";
    
    $stmt = $conn->prepare($sql);
    $searchCriteria = '%'.$criteria['criteria'].'%';
    $stmt->bind_param('s', $searchCriteria);

    // Execute statement and handle results
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


function searchMessages($conn, $criteria) {
    $sql = "SELECT * FROM messages
            WHERE sender_name LIKE ? OR sender_email LIKE ?";

    $stmt = $conn->prepare($sql);
    $searchCriteria = '%'.$criteria.'%';
    $stmt->bind_param('ss', $searchCriteria, $searchCriteria);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $results = [];
            while ($row = $result->fetch_assoc()) {
                array_push($results, $row);
            }
            echo json_encode($results);
        } else {
            $noResults = [
                [
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
        echo json_encode(["status" => "error", "message" => "Error executing query: " . $stmt->error]);
    }
    $stmt->close();
}
