<?php

// Enabling error reporting 
// For debugging and development purposes
ini_set('memory_limit', '512M');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");


// Function to check if a SESSSION has been started, and if not start a new SESSION
function ensure_session_start()
{
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
}


// Ensure the session is started at the beginning
ensure_session_start();


// Logging session data for debugging and development purposes
error_log(print_r($_SESSION, true));


// Function to retrieve all recipes from DB or filtered recipes
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

    // Adding filter criteria to the SQL query if filterCriteria specified
    if (!empty($filterCriteria)) {
        foreach ($filterCriteria as $key => $value) {
            if ($key !== 'function') {

                // Validating column names to prevent SQL injection
                $allowedColumns = ['dish_chef_recommended', 'dish_origin_id', 'origin_country', 'dish_rating', 'dish_prep_time', 'category_name', 'complexity_name', 'origin_country'];
                $keyParts = explode('.', $key);

                // Handling multiple filter criteria
                if (count($keyParts) == 2 && in_array($keyParts[1], $allowedColumns)) {
                    $column = $keyParts[1];
                }

                // Handling single filter criteria
                elseif (count($keyParts) == 1 && in_array($keyParts[0], $allowedColumns)) {
                    $column = $keyParts[0];
                }

                // Ignoring filter key if key is not valid
                else {
                    continue;
                }

                // Handling dish_prep_time filter to use comparison operators
                // And
                // Dynamically determine parameter type
                if ($column == 'dish_prep_time') {
                    if (preg_match('/^(<=?|>=?|=)\s*(\d+)$/', $value, $matches)) {
                        $operator = $matches[1];
                        $prepTimeValue = (int) $matches[2];
                        $sql .= " AND {$column} {$operator} ?";
                        $paramValues[] = $prepTimeValue;
                        $paramTypes .= 'i';
                    }
                    // Ignoring filter key if key is not valid
                    else {
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
                        // Default to string if type could not be determined
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

        // Appending query results to $results assoc array
        while ($row = $result->fetch_assoc()) {

            //If not !dish_img encod it to base64
            if (!empty($row['dish_img'])) {
                $dishImgData = $row['dish_img'];
                $row['dish_img'] = 'data:image/jpeg;base64,' . base64_encode($dishImgData);
            }
            array_push($results, $row);
        }
        echo json_encode($results);
    }

    //If there are no results, return an empty array
    else {
        $noResults = [];
        echo json_encode($noResults);
    }

    $stmt->close();
}


// Function to retrieve all the messages from DB
function getMessagesList($conn)
{
    $sql = "SELECT * FROM messages 
            ORDER BY message_sent_date_time DESC";
    $stmt = $conn->prepare($sql);
    $result = $conn->query($sql);
    if ($stmt->execute()) {
        if ($result) {
            $results = [];

            // Appending query results to $results assoc array
            while ($row = $result->fetch_assoc()) {
                array_push($results, $row);
            }

            echo json_encode($results);
        }

        //If there are no results, return an empty array
        else {
            $noResults = [];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error getting messages: " . $stmt->error]);
    }
    $stmt->close();
}


// Function to delete a message from DB
function deleteMessage($conn, $data)
{
    error_log("deleteMessage called with messageId: " . $data['messageId']);
    $sql = 'DELETE FROM messages WHERE message_id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $data['messageId']);
    if ($stmt->execute()) {
        error_log("Message deleted successfully.");
        echo json_encode(['status' => 'success', 'message' => 'Message deleted successfully']);
    } else {
        error_log("Error deleting message: " . $stmt->error);
        echo json_encode(['status' => 'error', 'message' => 'Error deleting message: ' . $stmt->error]);
    }

    $stmt->close();
}


// Function to delete a recipe from DB
function deleteRecipe($conn, $data)
{
    $sql = 'DELETE FROM recipes WHERE dish_id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $data['recipeId']);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Recipe removed successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error removing recipe: ' . $stmt->error]);
    }

    $stmt->close();
}


// Function to save a message in DB
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


//Function to add a new recipe/ save recipe to DB
function addNewRecipe($conn, $data)
{
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

        //If dish_img has been uploaded decode Base64 encoded image before storing it
        if (isset($data['dishImage']) && $data['dishImage']) {
            $base64Image = $data['dishImage'];
            $binaryData = base64_decode($base64Image);

            if ($binaryData === false) {
                echo json_encode(["status" => "error", "message" => "Base64 decoding failed"]);
                return;
            }

            // Preparing the SQL statement to update the image in DB for the last inserted row
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


//Function to edit a recipe that is already stored in DB
function editRecipe($conn, $data)
{
    $sql = "UPDATE recipes SET dish_name=?, dish_origin_id=?, dish_recipe_description=?, dish_ingredients=?, dish_complexity_id=?, 
    dish_prep_time=?, dish_category_id=?, dish_rating=?, dish_steps = ?, dish_chef_recommended = ? WHERE dish_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        'sissiiiisii',
        $data['dishName'],
        $data['dishOrigin'],
        $data['dishDescription'],
        $data['dishIngredients'],
        $data['dishComplexity'],
        $data['dishPrepTime'],
        $data['dishCategory'],
        $data['dishRating'],
        $data['dishSteps'],
        $data['dishChefRecommended'],
        $data['dishId']
    );

    if ($stmt->execute()) {

        //If dish_img has been uploaded decode Base64 encoded image before storing it
        if (isset($data['dishImage']) && $data['dishImage']) {
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


// Function to search recipes by dish_name
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

    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $results = [];

        // Appending query results to $results assoc array
        while ($row = $result->fetch_assoc()) {

            //If dish_img not null encod it to base64
            if (!empty($row['dish_img'])) {
                $dishImgData = $row['dish_img'];
                $row['dish_img'] = 'data:image/jpeg;base64,' . base64_encode($dishImgData);
            }
            array_push($results, $row);
        }
        echo json_encode($results);
    }

    //If there are no results, return an empty array
    else {
        $noResults = [];
        echo json_encode($noResults);
    }

    $stmt->close();
}


// Function to search mesages by sender_name or sender_email
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

            // Appending query results to $results assoc array
            while ($row = $result->fetch_assoc()) {
                array_push($results, $row);
            }
            echo json_encode($results);
        }

        //If there are no results, return an empty array
        else {
            $noResults = [];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error executing query: " . $stmt->error]);
    }
    $stmt->close();
}


// Function to flag or unflag a message
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


// Function to mark a message as read
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


// Function to filter messages based on message_read
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

            // Appending query results to $results assoc array
            while ($row = $result->fetch_assoc()) {
                array_push($results, $row);
            }
            echo json_encode($results);
        }

        // If there are no results, return an empty array
        else {
            $noResults = [];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error executing query: " . $stmt->error]);
    }
    $stmt->close();
}


// Function to register a user / add a new user to DB
function registerUser($conn, $data)
{
    $sql = "INSERT INTO users (user_name, user_surname, user_email, user_password_hash) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    // Hashing the password before storing it in the DB
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


// Function to authenticate a user
function authenticateUser($conn, $data)
{
    $sql = "SELECT user_id, user_password_hash, user_type, user_name FROM users WHERE user_email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $data['email']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();

        // Verifying password hash and appending user_id, user_type and user_name to $_SESSION assoc array
        if (password_verify($data['password'], $user['user_password_hash'])) {
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


// Function to retrive all the users from DB
function getUsersList($conn)
{
    $sql = "SELECT * FROM users 
            ORDER BY user_email ASC";
    $stmt = $conn->prepare($sql);
    $result = $conn->query($sql);
    if ($stmt->execute()) {
        if ($result) {
            $results = [];

            // Appending query results to $results assoc array
            while ($row = $result->fetch_assoc()) {
                array_push($results, $row);
            }

            echo json_encode($results);
        }

        // If there are no results, return an empty array
        else {
            $noResults = [];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error getting users: " . $stmt->error]);
    }
    $stmt->close();
}


// Function to delete a user from DB
function deleteUser($conn, $userId)
{
    $sql = 'DELETE FROM users WHERE user_id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $userId['userId']);
    if ($stmt->execute()) {
        error_log("User deleted successfully.");
        echo json_encode(['status' => 'success', 'message' => 'User deleted successfully']);
    } else {
        error_log("Error deleting user: " . $stmt->error);
        echo json_encode(['status' => 'error', 'message' => 'Error deleting user: ' . $stmt->error]);
    }

    $stmt->close();
}


// Function to filter users based on role / user_type
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

            // Appending query results to $results assoc array
            while ($row = $result->fetch_assoc()) {
                array_push($results, $row);
            }
            echo json_encode($results);
        }

        // If there are no results, return an empty array
        else {
            $noResults = [];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error executing query: " . $stmt->error]);
    }
    $stmt->close();
}


// Function to search users based on name or email address
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

            // Appending query results to $results assoc array
            while ($row = $result->fetch_assoc()) {
                array_push($results, $row);
            }
            echo json_encode($results);
        }

        // If there are no results, return an empty array
        else {
            $noResults = [];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error executing query: " . $stmt->error]);
    }
    $stmt->close();
}


// Function to edit user details
function editUser($conn, $data)
{
    $passwordClause = "";
    $types = 'ssssi';
    $params = [
        $data['userName'],
        $data['userSurname'],
        $data['userEmail'],
        $data['userRole'],
        $data['userId']
    ];

    // If new password is not null, add it to the SQL and parameters
    if (!empty($data['userPassword'])) {

        // Hashing the new password before storring it in DB
        $hashedPassword = password_hash($data['userPassword'], PASSWORD_DEFAULT);
        $passwordClause = ", user_password_hash=?";
        $types = 'sssssi';
        array_splice($params, 4, 0, $hashedPassword);
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

    // Binding parameters dynamically
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


// Function to retrive users's favourite recipes from DB
function getFavourites($conn, $data)
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
    INNER JOIN favourites ON recipes.dish_id = favourites.dish_id
    WHERE favourites.user_id = ?
    ORDER BY recipes.dish_name ASC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $data['user']);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $results = [];

            // Appending query results to $results assoc array
            while ($row = $result->fetch_assoc()) {

                // If dish_img not null encod it to base64
                if (!empty($row['dish_img'])) {
                    $dishImgData = $row['dish_img'];
                    $row['dish_img'] = 'data:image/jpeg;base64,' . base64_encode($dishImgData);
                }
                array_push($results, $row);
            }
            echo json_encode($results);
        }

        // If there are no results, return an empty array
        else {
            $noResults = [];
            echo json_encode($noResults);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Error getting favourite recipes: " . $stmt->error]);
    }
    $stmt->close();
}


// Function to add a favourite recipe for a user
function addFavourite($conn, $data)
{
    $sql = "INSERT INTO favourites (user_id, dish_id) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $data['user_id'], $data['dish_id']);

    if ($stmt->execute()) {
        error_log("Favourite recipe added successfully.");
        $response = ['status' => 'success', 'message' => 'Favourite recipe added successfully'];
    } else {
        error_log("Error adding favourite recipe: " . $stmt->error);
        $response = ['status' => 'error', 'message' => 'Error adding favourite recipe: ' . $stmt->error];
    }

    $stmt->close();
}


// Function to remove a recipe from a user's favourites list
function removeFavourite($conn, $data)
{
    $sql = 'DELETE FROM favourites WHERE user_id = ? AND dish_id = ?';
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $data['user_id'], $data['dish_id']);
    if ($stmt->execute()) {
        error_log("Recipe removed from favourites successfully.");
        echo json_encode(['status' => 'success', 'message' => 'Recipe removed from favourites successfully.']);
    } else {
        error_log("Error removing recipe from favourites: " . $stmt->error);
        echo json_encode(['status' => 'error', 'message' => 'Error removing recipe from favourites: ' . $stmt->error]);
    }

    $stmt->close();
}
