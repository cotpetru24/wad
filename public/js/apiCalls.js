// API call - Function to retrieve all recipes from DB or filtered recipes
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
        return recipes;
    }
    catch (error) {
        return [];
    }
}


// API call - Function to add a new recipe/ save recipe to DB
export async function addNewRecipe(jsonData) {
    try {

        // Converting dish_ingredients to a JSON string if it's an array
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
    }
    catch (error) {
        console.log("error saving recipe: " + error);
    }
}


// API call - Function to save a message in DB
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
    }
    catch (error) {
        console.log("Error sending message:", error);
    }
}


// API call - Function to retrieve all the messages from DB
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


// API call - Function to retrive all the users from DB
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


// API call - Function to delete a message from DB
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


// API call - Function to delete a user from DB
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


// API call - Function to edit a recipe that is already stored in DB
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

























// API call - Function to delete a recipe from DB
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


// API call - Function to search recipes by dish_name
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


// API call - Function to search mesages by sender_name or sender_email
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
        return messages;
    } catch (error) {
        console.log("Error retrieving data: " + error);
        return [];
    }
}


// API call - Function to filter messages based on message_read
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
        return messages;
    } catch (error) {
        console.log("Error retrieving data: " + error);
    }
}


// API call - Function to flag or unflag a message
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


// API call - Function to mark a message as read
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


// API call - Function to filter users based on user_type / role
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
        return users;
    } catch (error) {
        console.log("Error retrieving data: " + error);
    }
}


// API call - Function to search users based on name or email address
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
        return users;
    } catch (error) {
        console.log("Error retrieving data: " + error);
        return [];
    }
}


// API call - Function to edit user details
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


// API call - Function to retrive users's favourite recipes from DB
export async function getFavourites(user) {
    try {
        const data = {
            "function": "getFavourites",
            "user": user
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
        const favourites = await response.json();
        return favourites;
    } catch (error) {
        console.error("Error retrieving data: ", error);
        return { status: 'error', message: error.message };
    }
}


// API call - Function to add a favourite recipe for a user
export async function addFavourite(user_id, dish_id) {
    try {
        const data = {
            "function": "addFavourite",
            "user_id": user_id,
            "dish_id": dish_id
        };
        const response = await fetch(`http://localhost/data/api.php`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`http error! status: ${response.status}`);
        }
    } catch (error) {
        console.log("Error adding to favourites:", error);
    }
}


// API call - Function to remove a recipe from a user's favourites list
export async function removeFavourite(user_id, dish_id) {
    try {
        const data = {
            "function": "removeFavourite",
            "user_id": user_id,
            "dish_id": dish_id
        };
        const response = await fetch(`http://localhost/data/api.php`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`http error! status: ${response.status}`);
        }
    } catch (error) {
        console.log("Error adding to favourites:", error);
    }
}