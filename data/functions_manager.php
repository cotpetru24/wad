<?php
require "db_connect.php";
require "index.php";



function getRecipesList($conn){

}

function removeRecipe($conn, $id){

} 

function addRecipe($conn, $jsonData){

}

function editRecipe($conn, $id, $json){

}

function previewRecipe($conn, $id){

}

function getFilteredRecipesList($conn, $filterCriteria){

}

?>


//Function to return a JSON array of objects
function tasksListAsJSON($connection){
    $sql = "SELECT taskID, taskDescription, completed FROM tasks";
    $result = $connection->query($sql);

    //check to see if there are rows/tasks in the returned object
    if ($result->num_rows > 0) {
        //create an empty array to hold the results of the query
        $results = array();
        while ($row = $result->fetch_assoc()) {
            array_push($results, $row);
        }
        // JSON encode the array of objects and echo it
        $resultsJSON=json_encode($results);
        echo $resultsJSON;
    }
    else {
        // return a dummy object if no tasks are returned
        echo '[{"taskID" : "0", "tasksDescription" : "No tasks in the list", "completed": "0"}]';
    }
}

//function to add a new task
function addTask($connection, $newTaskText){
    $sql = 'INSERT INTO tasks (taskDescription, completed) VALUES (?, 0)';
    $stmt = $connection->prepare($sql);
    $stmt->bind_param('s', $newTaskText);
    if ($stmt->execute()){
        echo 'task added successfully';
    }
    else {
        echo "Error: could not add task: " .$sql.".".$connection->error;
    }

    $stmt->close();
}

//function to remove a task
function removeTask($connection, $taskID){
    $sql = "DELETE FROM tasks where taskID=?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("i", $taskID);

    if ($stmt->execute()){
        echo "task removed successfully";
    }
    else {
        echo "Error: could not remove task: ".$sql.".".$connection->error;
    }
    $stmt->close();
}

//function to change task completion status
function toggleCompleted($connection, $taskID, $currentState){
    $newState = abs($currentState-1);
    echo $newState;
    echo $taskID;
    echo $currentState;
    $sql = "UPDATE tasks SET completed = ? WHERE taskID = ?";
    $stmt = $connection->prepare($sql);
    $stmt->bind_param("ii", $newState, $taskID);

    if ($stmt->execute()){
        echo "task status updated successfully";
    }
    else{
        echo "Error: could not update task status: ".$sql.".".$connection->error;
    }
    $stmt->close();
}


//toggleCompleted($conn, 20, 1);

//close db connection
$conn->close();