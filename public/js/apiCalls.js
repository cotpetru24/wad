

// function to add tasks using a JSON data source


// const addButton = document.getElementById("addTask");
// const input = document.getElementById("newTaskText");
// addButton.addEventListener("click", ()=>{addTask()});
// input.addEventListener("keypress", (k=>{if(k.key==="Enter") {addButton.click()}}));


// 
// this is the old one in case the above doesn't work use this onw
// export async function getRecipes(){
//     try{
//         const response = await fetch("http://localhost/data/api.php");
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
            if (value) {
                param.append(key, value)
            }
        }

        const response = await fetch(`http://localhost/data/api.php?${param.toString()}`,
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
        return [];
        console.log("Error retrieving data: " + error);
    }
}




// add new recipe function - API call
export async function addNewRecipe(jsonData) {
    try {

        // Convert dish_ingredients to a JSON string if it's an array
        if (Array.isArray(jsonData.dishIngredients)) {
            jsonData.dishIngredients = JSON.stringify(jsonData.dishIngredients);
        }
        jsonData.function = "addNewRecipe";

        const response = await fetch("http://localhost/data/api.php",
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData)
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(`recipe added successfully:`, responseData)
        // getRecipes();
    }
    catch (error) {
        console.log("error saving recipe: " + error);
    }
}




// view recipe function - API call
export async function viewRecipe(recipe_ID) {
    try {
        const param = new URLSearchParams({ "function": "viewRecipe", "recipeID": "recipe_ID" });
        const recipeData = await fetch("http://localhost/data/api.php", { method: "POST", body: param });
    }
    catch (error) {
        console.log("error retrieving data " + error)
    }
}

// send message function - API call
export async function sendMessage(jsonData) {
    try {
        jsonData.function = "sendMessage";

        const response = await fetch("http://localhost/data/api.php",
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


        const response = await fetch(`http://localhost/data/api.php?${param.toString()}`,
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


// get messages function - API call
export async function getUsersList() {
    try {
        const param = new URLSearchParams({ "function": "getUsersList" });


        const response = await fetch(`http://localhost/data/api.php?${param.toString()}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        return users;
    }
    catch (error) {
        console.log("Error getting users:", error);
    }
}


// delete message fucntion - API call
export async function deleteMessage(messageId) {
    try {
        const data = {
            "function": "deleteMessage",
            "messageId": messageId
        };
        const response = await fetch("http://localhost/data/api.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        getMessages();
    } catch (error) {
        console.log("Error deleting message:", error);
    }
}






// delete user fucntion - API call
export async function deleteUser(userId) {
    try {
        const data = {
            "function": "deleteUser",
            "userId": userId
        };
        const response = await fetch("http://localhost/data/api.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        getUsersList();
    } catch (error) {
        console.log("Error deleting user:", error);
    }
}





















export async function editRecipe(jsonData) {
    try {
        jsonData.function = "editRecipe";
        const response = await fetch("http://localhost/data/api.php",
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData)
            }
        );
        if (!response.ok) {
            throw new Error(`http error! status: , ${response.status}`);
        }
        const responseData = await response.json();
        console.log(`changes saved successfully`, responseData);
    }

    catch (error) {
        console.log("error saving changes" + error);
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


// delete message fucntion - API call
export async function deleteRecipe(recipeId) {
    try {
        const data = {
            "function": "deleteRecipe",
            "recipeId": recipeId
        };
        const response = await fetch("http://localhost/data/api.php", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        addRecipeRows();
    } catch (error) {
        console.log("Error deleting recipe:", error);
    }
}




//searchRecipes function
export async function searchRecipes(searchCriteria) {
    try {
        const data = {
            "function": "searchRecipes",
            "criteria": searchCriteria
        };

        const response = await fetch(`http://localhost/data/api.php`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const recipes = await response.json();
        return recipes;
    } catch (error) {
        console.log("Error retrieving data: " + error);
    }
}

//searchMessages function
export async function searchMessages(searchCriteria) {
    try {
        const data = {
            "function": "searchMessages",
            "criteria": searchCriteria
        };

        const response = await fetch(`http://localhost/data/api.php`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const messages = await response.json();
        //addRecipes(recipes);
        return messages;
    } catch (error) {
        console.log("Error retrieving data: " + error);
        return [];
    }
}


//filterMessages function
export async function filterMessages(filterCriteria) {
    try {
        const data = {
            "function": "filterMessages",
            "criteria": filterCriteria
        };

        const response = await fetch(`http://localhost/data/api.php`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const messages = await response.json();
        //addRecipes(recipes);
        return messages;
    } catch (error) {
        console.log("Error retrieving data: " + error);
    }
}

//flagUnflagMessage function
export async function flagUnflagMessage(messageId) {
    try {
        const data = {
            "function": "flagUnflagMessage",
            "message_id": messageId
        };

        const response = await fetch(`http://localhost/data/api.php`, {
            method: "POST",
            headers: {
                'Content-Type': 'appliction/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`http error! status: ${response.status}`);
        }
        getMessages();
    } catch (error) {
        console.log("Error deleting message:", error);
    }


}

//function to mark a message as read

export async function markMessageAsRead(messageId) {
    try {
        const data = {
            "function": "markMessageAsRead",
            "message_id": messageId
        };

        const response = await fetch(`http://localhost/data/api.php`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`http error! status: ${response.status}`);
        }
    }
    catch (error) {
        console.log("Error marking message as read:", error)
    }
}









filterUsers



//filterMessages function
export async function filterUsers(filterCriteria) {
    try {
        const data = {
            "function": "filterUsers",
            "criteria": filterCriteria
        };

        const response = await fetch(`http://localhost/data/api.php`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        //addRecipes(recipes);
        return users;
    } catch (error) {
        console.log("Error retrieving data: " + error);
    }
}




//searchUsers function
export async function searchUsers(searchCriteria) {
    try {
        const data = {
            "function": "searchUsers",
            "criteria": searchCriteria
        };

        const response = await fetch(`http://localhost/data/api.php`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        //addRecipes(recipes);
        return users;
    } catch (error) {
        console.log("Error retrieving data: " + error);
        return [];
    }
}




export async function editUser(jsonData) {
    try {
        jsonData.function = "editUser";
        const response = await fetch("http://localhost/data/api.php",
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData)
            }
        );
        if (!response.ok) {
            throw new Error(`http error! status: , ${response.status}`);
        }
        const responseData = await response.json();
        console.log(`changes saved successfully`, responseData);
    }

    catch (error) {
        console.log("error saving changes" + error);
    }

}