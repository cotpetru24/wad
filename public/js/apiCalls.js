

// function to add tasks using a JSON data source


// const addButton = document.getElementById("addTask");
// const input = document.getElementById("newTaskText");
// addButton.addEventListener("click", ()=>{addTask()});
// input.addEventListener("keypress", (k=>{if(k.key==="Enter") {addButton.click()}}));


// 
// this is the old one in case the above doesn't work use this onw
// export async function getRecipes(){
//     try{
//         const response = await fetch("http://localhost/data/index.php");
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const recipes = await response.json();
//         addRecipes(recipes);
//     }
//     catch(error){
//         console.log("Error retrieving data: " + error);
//     }
// }


// get recipes function - API call
export async function getRecipes(filterCriteria = {}) {
    try {
        const param = new URLSearchParams({ "function": "getRecipesList" });

        for (const [key, value] of Object.entries(filterCriteria)) {
            param.append(key, value)
        }


        const response = await fetch(`http://localhost/data/index.php?${param.toString()}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const recipes = await response.json();
        //addRecipes(recipes);
        return recipes;
    }
    catch (error) {
        console.log("Error retrieving data: " + error);
    }
}



// remove recipe funcion - API call
export async function removeRecipe(recipe) {
    try {
        const param = new URLSearchParams({ "function": "removeRecipe", "recipeID": recipe.recipe_id });
        const recipeData = await fetch("http://localhost/data/index.php", { method: "POST", body: param });
        getRecipes();
    }
    catch (error) {
        console.log("Error removing recipe" + error);
    }
}




// add recipe function - API call
export async function addRecipe() {
    try {
        const param = new URLSearchParams({ "function": "addRecipe", "jsonData": "recipe data should go here" });
        const recipeData = await fetch("http://localhost/data/index.php", { method: "POST", body: param });
        getRecipes();
    }
    catch (error) {
        console.log("error retrieving data: " + error);
    }
}

// view recipe function - API call
export async function viewRecipe(recipe_ID) {
    try {
        const param = new URLSearchParams({ "function": "viewRecipe", "recipeID": "recipe_ID" });
        const recipeData = await fetch("http://localhost/data/index.php", { method: "POST", body: param });
    }
    catch (error) {
        console.log("error retrieving data " + error)
    }
}

// send message function - API call
export async function sendMessage(jsonData) {
    try {
        jsonData.function = "sendMessage";

        const response = await fetch("http://localhost/data/index.php",
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jsonData) });

        if (!response.ok) {
            throw new Error(`Network response was not OK! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(`Message sent successfully:`, responseData)
        // alert('Message sent successfully!');
    }
    catch (error) {
        console.log("Error sending message:", error);
    }
}


//to check is the below is used---->>>>>>> if no, to remove it


// Function to view message
// export function addMessage(message) {
//     const viewMessagePopup = document.getElementById('viewMessagePopup');
//     const overlay = document.getElementById('overlay');
//     const viewMessageContent = document.getElementById('viewMessageContent');

//     viewMessageContent.innerHTML = `
//                 <p><strong>Name:</strong> ${message.name}</p>
//                 <p><strong>Email:</strong> ${message.email}</p>
//                 <p><strong>Message:</strong> ${message.content}</p>
//                 <p><strong>Date:</strong> ${message.date}</p>
//                 <p><strong>Status:</strong> ${message.read ? 'Read' : 'Unread'}</p>
//             `;

//     viewMessagePopup.classList.add('active');
//     overlay.classList.add('active');
// }

// sampleMessages.forEach(addMessageRow);


// get messages function - API call
export async function getMessages() {
    try {
        const param = new URLSearchParams({ "function": "getMessagesList" });


        const response = await fetch(`http://localhost/data/index.php?${param.toString()}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const messages = await response.json();
        return messages;
    }
    catch (error) {
        console.log("Error getting messages:", error);
    }
}

// delete message fucntion - API call
export async function deleteMessage(messageId) {
    try {
        const data = {
            "function": "deleteMessage",
            "messageId": messageId
        };
        const response = await fetch("http://localhost/data/index.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'  // Set the content type header to JSON
            },
            body: JSON.stringify(data)  // Convert data to JSON string
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        getMessages();
    } catch (error) {
        console.log("Error deleting message:", error);
    }
}























export async function addRecipeRows() {
    const recipes = await getRecipes({ "dish_chef_recommended": "1" });
    recipes.forEach(recipe => addRecipeRow(recipe));

}












//Function to add a recipe row to the table
export function addRecipeRow(recipe) {
    const recipesList = document.getElementById('adminRecipesList');


    const row = document.createElement('tr');

    row.innerHTML = `
                <td>${recipe.name}</td>
                <td>${recipe.description}</td>
                <td>${recipe.category}</td>
                <td>${recipe.name}</td>
                <td>${recipe.complexity}</td>
                <td>${recipe.prepTime}</td>
                <td>${recipe.rating}</td>
                <td><img src="${recipe.image}" alt="Dish Image"></td>
                <td class="actions" id="actionsTh">
                    <button onclick="previewRecipe(${JSON.stringify(recipe)})">Preview</button>
                    <button onclick="editRecipe(${JSON.stringify(recipe)})">Edit</button>
                    <button onclick="confirmAction('Delete recipe?', 'deleteRecipe', ${recipe.id})">Delete</button>
                </td>
            `;

    recipesList.appendChild(row);
}


