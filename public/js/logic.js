
    //javasccript will go here
    
    //const dummyJson = '[{"taskID":"1","taskDescription":"Take the bins out","completed":"0"},{"taskID":"2","taskDescription":"Mow the lawn","completed":"1"},{"taskID":"3","taskDescription":"Walk the dog","completed":"0"}]';
    //const tasks = JSON.parse(dummyJson);

    /////////////////////////////////////////////
    //////////// TO DO LIST FUNCTIONALITY  //////

    const list = document.getElementById("toDoList");
    

    // function to add tasks using a JSON data source
    function addTasks(tasksList){
                                                                        //const tasksList2 = JSON.parse(tasksList);

        //clear current tasks list
        list.innerText = "";

        tasksList.forEach((task) => {
            //assign newly created page element to variables
            let taskItem = document.createElement("li");
            let completeButton = document.createElement("button");
            let deleteButton = document.createElement("button");
            let completeSpan = document.createElement("span");
            let taskTextSpan = document.createElement("span");
            let deleteSpan = document.createElement("span");

            taskItem.id = "taskID" + task.taskID;
            completeSpan.classList.add("completeSpan");
            taskTextSpan.classList.add("taskTextSpan");
            deleteSpan.classList.add("deleteSpan");

            taskItem.appendChild(completeSpan);
            taskItem.appendChild(taskTextSpan);
            taskItem.appendChild(deleteSpan);

            //setting the values of the new elements
            if(task.completed == true){
                taskTextSpan.classList.add("completed");
                completeButton.innerHTML = "&#9989;";
            }
            else {
                completeButton.innerHTML = "&#128998;";
            }

            taskTextSpan.innerHTML = task.taskDescription;
            deleteButton.innerHTML = "&#10060;";

            //appending the elements to the DOM
            completeSpan.appendChild(completeButton);
            deleteSpan.appendChild(deleteButton);

            completeButton.addEventListener("click", ()=> {toggleCompleted(task)});
            deleteButton.addEventListener("click", ()=> {removeTask(task)});

            list.appendChild(taskItem);
        });
        
    }


    const addButton = document.getElementById("addTask");
    const input = document.getElementById("newTaskText");
    addButton.addEventListener("click", ()=>{addTask()});
    input.addEventListener("keypress", (k=>{if(k.key==="Enter") {addButton.click()}}));




    async function getTasks(){
        try{
            const taskData = await fetch("http://localhost/data/index.php");
            const tasks = await taskData.json();
            addTasks(tasks);
        }
        catch(error){
            console.log("Error retrieving data: " + error);
        }
    }

    async function toggleCompleted(task){
        try{
            const param = new URLSearchParams({"function": "toggleCompleted", "taskID" : task.taskID, "completed" : task.completed});
            const taskCompleted = await fetch("http://localhost/data/index.php", {method: "POST", body: param});
            getTasks();

        }
        catch(error){
            console.log("Error retrieving data: " + error);
        }
    }

    async function removeTask(task){
        try{
            const param = new URLSearchParams({"function" : "removeTask", "taskID" : task.taskID});
            const taskData = await fetch("http://localhost/data/index.php", {method: "POST", body: param}); 
            getTasks();
        }
        catch(error){
            console.log("Error retrieving data: " + error);
        }

    }



    async function addTask(){
        try{
        const param = new URLSearchParams({"function" : "addTask", "newTaskText" : input.value});
        const taskData = await fetch("http://localhost/data/index.php", {method: "POST", body: param}); 
            getTasks();
        }
        catch(error){
            console.log("Error retrieving data: " + error);
        }
    }
    
    getTasks();

