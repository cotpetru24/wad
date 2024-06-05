<?php
// Enable error reporting for debugging
ini_set('memory_limit', '512M');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Add this function to check if the session has started
function ensure_session_start() {
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
}

// Ensure the session is started at the beginning
ensure_session_start();

error_log(print_r($_SESSION, true)); // Log session data for debugging

function check_user_session($role = null) {
    if (!isset($_SESSION['user_id'])) {
        header("Location: index.php");
        exit();
    }

    if ($role && $_SESSION['user_type'] !== $role) {
        header("Location: index.php");
        exit();
    }
}
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
                    $column = $keyParts[1];
                    // Handle keys with one part
                } elseif (count($keyParts) == 1 && in_array($keyParts[0], $allowedColumns)) {
                    $column = $keyParts[0];
                } else {
                    // Skip invalid keys
                    continue;
                }

                // Special handling for dish_prep_time with comparison operators
                if ($column == 'dish_prep_time') {
                    if (preg_match('/^(<=?|>=?|=)\s*(\d+)$/', $value, $matches)) {
                        $operator = $matches[1];
                        $prepTimeValue = (int) $matches[2];
                        $sql .= " AND {$column} {$operator} ?";
                        $paramValues[] = $prepTimeValue;
                        $paramTypes .= 'i';
                    } else {
                        // Skip invalid prep time filter
                        continue;
                    }
                } else {
                    $sql .= " AND {$column}=?";
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
    }

    $sql .= " ORDER BY recipes.dish_name ASC";

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
        $noResults = [];
        echo json_encode($noResults);
    }

    $stmt->close();
}



// Fucntion to retrive messages from db
function getMessagesList($conn)
{
    $sql = "SELECT * FROM messages 
            ORDER BY message_sent_date_time DESC";
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
            $noResults = [];
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
        dish_category_id, dish_complexity_id, dish_prep_time, dish_rating, dish_chef_recommended, dish_steps)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        'sissiiiiis',
        $data['dishName'],
        $data['dishOrigin'],
        $data['dishDescription'],
        $data['dishIngredients'],
        $data['dishCategory'],
        $data['dishComplexity'],
        $data['dishPrepTime'],
        $data['dishRating'],
        $data['dishChefRecommended'],
        $data['dishSteps']
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
    dish_prep_time=?, dish_category_id=?, dish_rating=?, dish_steps = ? WHERE dish_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        'sissiiiisi',
        $data['dishName'],
        $data['dishOrigin'],
        $data['dishDescription'],
        $data['dishIngredients'],
        $data['dishComplexity'],
        $data['dishPrepTime'],
        $data['dishCategory'],
        $data['dishRating'],
        $data['dishSteps'],
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

    $stmt->close();
}


function searchRecipes($conn, $criteria)
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
            WHERE dish_name LIKE ?
            ORDER BY recipes.dish_name ASC";

    $stmt = $conn->prepare($sql);
    $searchCriteria = '%' . $criteria['criteria'] . '%';
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
        $noResults = [];
        echo json_encode($noResults);
    }

    $stmt->close();
}


function searchMessages($conn, $criteria)
{
    $sql = "SELECT * FROM messages
            WHERE sender_name LIKE ? OR sender_email LIKE ?
            ORDER BY message_sent_date_time DESC";

    $stmt = $conn->prepare($sql);
    $searchCriteria = '%' . $criteria['criteria'] . '%';
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
            $noResults = [];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error executing query: " . $stmt->error]);
    }
    $stmt->close();
}


function flagUnflagMessage($conn, $data)
{
    $sql = "UPDATE messages 
    SET flagged = CASE 
                    WHEN flagged = 1 THEN 0 
                    ELSE 1 
                  END 
    WHERE message_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $data['message_id']);
    if ($stmt->execute()) {
        error_log("Message flagged successfully.");
        echo json_encode(['status' => 'success', 'message' => 'Message flagged successfully']);
    } else {
        error_log("Error flagging message: " . $stmt->error);
        echo json_encode(['status' => 'error', 'message' => 'Error flagging message: ' . $stmt->error]);
    }

    $stmt->close();

}


function markMessageAsRead($conn, $data)
{
    $sql = "UPDATE messages SET message_read = 1 where message_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $data['message_id']);

    if ($stmt->execute()) {
        error_log("Message marked as read successfully.");
        echo json_encode(['status' => 'success', 'message' => 'Message marked as read successfully']);
    } else {
        error_log("Error marking message as read: " . $stmt->error);
        echo json_encode(['status' => 'error', 'message' => 'Error marking message as read: ' . $stmt->error]);
    }

    $stmt->close();
}


function filterMessages($conn, $data)
{
    $sql = "SELECT * FROM messages
            WHERE message_read = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $data['criteria']);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $results = [];
            while ($row = $result->fetch_assoc()) {
                array_push($results, $row);
            }
            echo json_encode($results);
        } else {
            $noResults = [];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error executing query: " . $stmt->error]);
    }
    $stmt->close();
}



function registerUser($conn, $data){
    $sql = "INSERT INTO users (user_name, user_surname, user_email, user_password_hash) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt->bind_param("ssss", $data['name'], $data['surname'], $data['email'], $hashedPassword);

    if ($stmt->execute()) {
        error_log("User registered successfully.");
        $response = ['status' => 'success', 'message' => 'User registered successfully'];
    } else {
        error_log("Error registering user: " . $stmt->error);
        $response = ['status' => 'error', 'message' => 'Error registering user: ' . $stmt->error];
    }

    $stmt->close();
    return $response;
}

function authenticateUser($conn, $data){
    $sql = "SELECT user_id, user_password_hash, user_type, user_name FROM users WHERE user_email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $data['email']);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows == 1){
        $user = $result->fetch_assoc();
        if (password_verify($data['password'], $user['user_password_hash'])){
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['user_type'] = $user['user_type'];
            $_SESSION['user_name'] = $user['user_name'];
            return ['status' => 'success', 'message' => 'Login successful'];
        } else {
            $response = ['status' => 'error', 'message' => 'Invalid password'];
        }
    } else {
        $response = ['status' => 'error', 'message' => 'User not found'];
    }

    $stmt->close();
    return $response;
}


// Fucntion to retrive messages from db
function getUsersList($conn)
{
    $sql = "SELECT * FROM users 
            ORDER BY user_email ASC";
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
            $noResults = [];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error getting users: " . $stmt->error]);
    }
    $stmt->close();
}










function deleteUser($conn, $userId)
{
    // error_log("deleteUser called with userId: $userId");
    $sql = 'DELETE FROM users WHERE user_id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $userId['userId']);
    if ($stmt->execute()) {
        error_log("user deleted successfully.");
        echo json_encode(['status' => 'success', 'message' => 'user deleted successfully']);
    } else {
        error_log("Error deleting user: " . $stmt->error);
        echo json_encode(['status' => 'error', 'message' => 'Error deleting user: ' . $stmt->error]);
    }

    $stmt->close();
}



function filterUsers($conn, $data)
{
    $sql = "SELECT * FROM users
            WHERE user_type = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $data['criteria']);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $results = [];
            while ($row = $result->fetch_assoc()) {
                array_push($results, $row);
            }
            echo json_encode($results);
        } else {
            $noResults = [];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error executing query: " . $stmt->error]);
    }
    $stmt->close();
}



function searchUsers($conn, $criteria)
{
    $sql = "SELECT * FROM users
    WHERE user_email LIKE ? OR CONCAT(user_name, ' ', user_surname) LIKE ?
    ORDER BY user_name ASC";


    $stmt = $conn->prepare($sql);
    $searchCriteria = '%' . $criteria['criteria'] . '%';
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
            $noResults = [];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error executing query: " . $stmt->error]);
    }
    $stmt->close();
}




























function editUser($conn, $data) {
    $passwordClause = "";
    $types = 'ssssi'; // Parameter types: string, string, string, string, integer
    $params = [
        $data['userName'],
        $data['userSurname'],
        $data['userEmail'],
        $data['userRole'],
        $data['userId']
    ];

    // If password is provided and not null, add it to the SQL and parameters
    if (!empty($data['userPassword'])) {
        $hashedPassword = password_hash($data['userPassword'], PASSWORD_DEFAULT);
        $passwordClause = ", user_password_hash=?";
        $types = 'sssssi'; // Adjust parameter types to include the password
        array_splice($params, 4, 0, $hashedPassword); // Insert password at the correct position
    }

    $sql = "UPDATE users SET 
            user_name=?, 
            user_surname=?, 
            user_email=?, 
            user_type=?"
            . $passwordClause . 
            " WHERE user_id=?";

    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        error_log("Prepare failed: (" . $conn->errno . ") " . $conn->error);
        echo json_encode(['status' => 'error', 'message' => 'Prepare failed: ' . $conn->error]);
        return;
    }

    // Bind the parameters dynamically
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        error_log("User updated successfully.");
        echo json_encode(['status' => 'success', 'message' => 'User updated successfully']);
    } else {
        error_log("Error updating user: " . $stmt->error);
        echo json_encode(['status' => 'error', 'message' => 'Error updating user: ' . $stmt->error]);
    }

    $stmt->close();
}



// Fucntion to retrive favourite dishes from db
function getFavourites($conn, $data)
{
    $sql = "SELECT recipes.* FROM recipes
    RIGHT JOIN favourites ON favourites.dish_id = recipes.dish_id
    WHERE favourites.user_id = ?
    ORDER BY recipes.dish_name ASC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $data['user_id']);
    $result = $conn->query($sql);
    if ($stmt->execute()) {
        if ($result) {
            $results = [];
            while ($row = $result->fetch_assoc()) {
                array_push($results, $row);
            }

            echo json_encode($results);
        } else {
            $noResults = [];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error getting recipes: " . $stmt->error]);
    }
    $stmt->close();
}







function addFavourite($conn, $data){
    $sql = "INSERT INTO favourites (user_id, dish_id) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $data['user_id'], $data['dish_id']);

    if ($stmt->execute()) {
        error_log("favourite added successfully.");
        $response = ['status' => 'success', 'message' => 'favourite added successfully'];
    } else {
        error_log("Error registering user: " . $stmt->error);
        $response = ['status' => 'error', 'message' => 'Error adding favourite: ' . $stmt->error];
    }

    $stmt->close();
    return $response;
}

function removeFavourite($conn, $data)
{
    $sql = 'DELETE FROM favourites WHERE user_id = ? AND dish_id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $data['user_id'], $data['dish_id']);
    if ($stmt->execute()) {
        error_log("favourite removed successfully.");
        echo json_encode(['status' => 'success', 'message' => 'favourite removed successfully.']);
    } else {
        error_log("Error deleting message: " . $stmt->error);
        echo json_encode(['status' => 'error', 'message' => 'Error removing favourite: ' . $stmt->error]);
    }

    $stmt->close();
}



?>
