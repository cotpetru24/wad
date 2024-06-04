import * as apiCalls from './apiCalls.js';
import * as functions from './functions.js';
import * as commonController from './commonController.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Check if the current URL includes "adminPage.html"
    if (window.location.pathname.includes('adminPage.html')) {
        addRecipeRows();
    }
    commonController.tabsController();
});

async function addRecipeRows(filter = {}) {
    const recipes = await apiCalls.getRecipes(filter);
    const recipesList = document.getElementById('adminRecipesList');
    recipesList.innerHTML = ''; // Clear existing rows before adding new ones

    if (recipes.length === 0) {
        const noRecipesRow = document.createElement('tr');
        noRecipesRow.classList.add('noResultsRow');
        const noRecipesCell = document.createElement('td');
        noRecipesCell.classList.add('noResultsFound');

        noRecipesCell.colSpan = 8;
        noRecipesCell.textContent = 'No Recipes found';
        noRecipesRow.appendChild(noRecipesCell);
        recipesList.appendChild(noRecipesRow);
    } else {
        recipes.forEach(recipe => addRecipeRow(recipe));
    }
}



// export function addRecipeRow(recipe) {
//     const recipesList = document.getElementById('adminRecipesList');
//     const row = document.createElement('tr');
//     row.classList.add('recipe-row');

//     row.innerHTML = `
//         <td>${recipe.dish_name}</td>
//         <td>${functions.toTitleCase(recipe.origin_country)}</td>
//         <td>${functions.toTitleCase(recipe.category_name)}</td>
//         <td>${functions.toTitleCase(recipe.complexity_name)}</td>
//         <td>${functions.formatPrepTime(recipe.dish_prep_time)}</td>
//         <td>${recipe.dish_rating}</td>
//         <td><img src="${recipe.dish_img ? recipe.dish_img : 'public/img/image_coming_soon_with_camera_text.jpg'}" alt="Dish Image"></td>
//         <td class="actions" id="actionsTh">
//             <button class="expand-btn">Expand</button>
//             <button class="edit-btn">Edit</button>
//             <button class="delete-btn">Delete</button>
//         </td>
//     `;


//     // <td class="fixed-cell">${recipe.dish_recipe_description}</td>
//     // <td class="fixed-cell">${JSON.parse(recipe.dish_ingredients).join(', ')}</td>


//     const expandedRow = document.createElement('tr');
//     const expandedRowData = document.createElement('td')
//     expandedRowData.classList.add('expandedRecipeTd')
//     const expandedContent = document.createElement('div')
//     expandedContent.classList.add('expanded-content')

//     expandedRowData.appendChild(expandedContent);
//     expandedRow.appendChild(expandedContent);

//     expandedRow.classList.add('recipe-expanded-row');
//     expandedRow.style.display = 'none';
//     const chefRecommendedText = recipe.dish_chef_recommended === 1 ? "Yes" : "No";

//     const expandedRowRecipeDescription = document.createElement('h3');
//     expandedRowRecipeDescription.innerText = "Description:";
//     expandedRowData.appendChild(expandedRowRecipeDescription);


//     const descriptionParagraph = document.createElement('p');
//     descriptionParagraph.innerText = ${ recipe.dish_recipe_description };
//     expandedRowData.appendChild(descriptionParagraph);

//     //Ingredients
//     if (recipe.dish_ingredients) {
//         let recipeIngredientsHeader = document.createElement("h3");
//         recipeIngredientsHeader.innerHTML = "Ingredients:";
//         let ingredientsList = document.createElement("ul");
//         const dishIngredientsArray = JSON.parse(recipe.dish_ingredients);
//         dishIngredientsArray.forEach(value => {
//             let listItem = document.createElement("li");
//             listItem.textContent = value;
//             ingredientsList.appendChild(listItem);
//         });

//         expandedRowData.appendChild(recipeIngredientsHeader);
//         expandedRowData.appendChild(ingredientsList);
//     }





//     //Steps
//     if (recipe.dish_steps) {
//         let recipeStepsHeader = document.createElement("h3");
//         recipeStepsHeader.innerHTML = "Instructions";
//         let recipeSteps = document.createElement("ol");
//         const dishSteps = JSON.parse(recipe.dish_steps);
//         dishSteps.forEach(step => {
//             let recipeStep = document.createElement("li");
//             let stepTitle = document.createElement("strong");
//             stepTitle.textContent = step.title + ":";
//             let stepDescription = document.createElement("span");
//             stepDescription.textContent = step.description;

//             recipeStep.appendChild(stepTitle);
//             recipeStep.appendChild(stepDescription);
//             recipeSteps.appendChild(recipeStep);
//         }
//         )
//         expandedRowData.appendChild(recipeStepsHeader);
//         expandedRowData.appendChild(recipeSteps);
//     }

//     // expandedRow.innerHTML = `
//     //     <td colspan="8">
//     //         <div class="expanded-content">
//     //             <h3>Description:</h3>
//     //             <p>${recipe.dish_recipe_description}</p>
//     //             // <h3>Ingredients:</h3>
//     //             // <p>${JSON.parse(recipe.dish_ingredients).join(', ')}</p>
//     //             <h3>Steps:</h3>
//     //             <p>${recipe.dish_steps}</p>


//     //             <h3>Chef Recommended: ${chefRecommendedText}</h3>

//     //             <h3>Recipe added: ${recipe.dish_upload_date_time}</h3>

//     //         </div>
//     //     </td>
//     // `;



//     recipesList.appendChild(row);
//     recipesList.appendChild(expandedRow);

//     // Attach event listeners
//     row.querySelector('.expand-btn').addEventListener('click', commonController.toggleExpand);
//     row.querySelector('.edit-btn').addEventListener('click', () => editRecipe(recipe));
//     row.querySelector('.delete-btn').addEventListener('click', () => confirmAction('Delete recipe?', 'deleteRecipe', recipe.dish_id));
// }


//if the below works fine delete the above.

export function addRecipeRow(recipe) {
    const recipesList = document.getElementById('adminRecipesList');
    const row = document.createElement('tr');
    row.classList.add('recipe-row');

    row.innerHTML = `
        <td>${recipe.dish_name}</td>
        <td>${functions.toTitleCase(recipe.origin_country)}</td>
        <td>${functions.toTitleCase(recipe.category_name)}</td>
        <td>${functions.toTitleCase(recipe.complexity_name)}</td>
        <td>${functions.formatPrepTime(recipe.dish_prep_time)}</td>
        <td>${recipe.dish_rating}</td>
        <td><img src="${recipe.dish_img ? recipe.dish_img : 'public/img/image_coming_soon_with_camera_text.jpg'}" alt="Dish Image"></td>
        <td class="actions" id="actionsTh">
            <button class="expand-btn">Expand</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;

    const expandedRow = document.createElement('tr');
    const expandedRowData = document.createElement('td');
    expandedRowData.classList.add('expandedRecipeTd');
    expandedRowData.colSpan = 8;

    const expandedContent = document.createElement('div');
    expandedContent.classList.add('expanded-content');

    expandedRowData.appendChild(expandedContent);
    expandedRow.appendChild(expandedRowData);

    expandedRow.classList.add('recipe-expanded-row');
    expandedRow.style.display = 'none';
    const chefRecommendedText = recipe.dish_chef_recommended === 1 ? "Yes" : "No";

    const expandedRowRecipeDescription = document.createElement('h3');
    expandedRowRecipeDescription.innerText = "Description:";
    expandedContent.appendChild(expandedRowRecipeDescription);

    const descriptionParagraph = document.createElement('p');
    descriptionParagraph.innerText = recipe.dish_recipe_description;
    expandedContent.appendChild(descriptionParagraph);

    // Ingredients
    if (recipe.dish_ingredients) {
        let recipeIngredientsHeader = document.createElement("h3");
        recipeIngredientsHeader.innerHTML = "Ingredients:";
        let ingredientsList = document.createElement("ul");
        const dishIngredientsArray = JSON.parse(recipe.dish_ingredients);
        dishIngredientsArray.forEach(value => {
            let listItem = document.createElement("li");
            listItem.textContent = value;
            ingredientsList.appendChild(listItem);
        });

        expandedContent.appendChild(recipeIngredientsHeader);
        expandedContent.appendChild(ingredientsList);
    }

    // Steps
    if (recipe.dish_steps) {
        let recipeStepsHeader = document.createElement("h3");
        recipeStepsHeader.innerHTML = "Instructions:";
        let recipeSteps = document.createElement("ol");
        const dishSteps = JSON.parse(recipe.dish_steps);
        dishSteps.forEach(step => {
            let recipeStep = document.createElement("li");
            let stepTitle = document.createElement("strong");
            stepTitle.textContent = step.title + ": ";
            let stepDescription = document.createElement("span");
            stepDescription.textContent = step.description;

            recipeStep.appendChild(stepTitle);
            recipeStep.appendChild(stepDescription);
            recipeSteps.appendChild(recipeStep);
        });
        expandedContent.appendChild(recipeStepsHeader);
        expandedContent.appendChild(recipeSteps);
    }

    let chefRecommendedHeader = document.createElement("h3");
    chefRecommendedHeader.innerText = "Chef Recommended: " + chefRecommendedText;
    expandedContent.appendChild(chefRecommendedHeader);

    let recipeAddedHeader = document.createElement("h3");
    recipeAddedHeader.innerText = "Recipe added: " + recipe.dish_upload_date_time;
    expandedContent.appendChild(recipeAddedHeader);

    recipesList.appendChild(row);
    recipesList.appendChild(expandedRow);

    // Attach event listeners
    row.querySelector('.expand-btn').addEventListener('click', commonController.toggleExpand);
    row.querySelector('.edit-btn').addEventListener('click', () => editRecipe(recipe));
    row.querySelector('.delete-btn').addEventListener('click', () => confirmAction('Delete recipe?', 'deleteRecipe', recipe.dish_id));
}



async function updateRecipe() {
    const dishId = document.getElementById('editRecipeId').value;
    const dishName = document.getElementById('editDishName').value;
    const dishOrigin = document.getElementById('editDishOrigin').value;
    const dishDescription = document.getElementById('editDishDescription').value;
    const dishCategory = document.getElementById('editDishCategory').value;
    const dishComplexity = document.getElementById('editDishComplexity').value;
    const dishPrepTime = document.getElementById('editDishPrepTime').value;
    const dishRating = document.getElementById('editDishRating').value;
    const dishImage = document.getElementById('editDishImage').files[0];

    const ingredientsElements = document.querySelectorAll("#editIngredientsContainer .ingredientDescription");
    const dishIngredients = Array.from(ingredientsElements).map(input => input.value);

    const stepsElements = document.querySelectorAll("#editStepsContainer .step");
    const dishSteps = Array.from(stepsElements).map((stepElement, index) => ({
        step: index + 1,
        title: stepElement.querySelector(".stepTitle").value,
        description: stepElement.querySelector(".stepDescription").value,
    }));

    const reader = new FileReader();

    reader.onloadend = function () {
        const base64Image = reader.result ? reader.result.split(',')[1] : null;

        const jsonData = {
            function: 'editRecipe',
            dishId: dishId,
            dishName: dishName,
            dishOrigin: dishOrigin,
            dishDescription: dishDescription,
            dishIngredients: JSON.stringify(dishIngredients),
            dishSteps: JSON.stringify(dishSteps),
            dishCategory: dishCategory,
            dishComplexity: dishComplexity,
            dishPrepTime: dishPrepTime,
            dishRating: dishRating,
            dishImage: base64Image
        };

        apiCalls.editRecipe(jsonData).then(() => {
            document.getElementById('editRecipePopup').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
            addRecipeRows(); // Refresh the recipe list
        }).catch(error => {
            console.error('Error updating recipe:', error);
        });
    };

    reader.onerror = function (error) {
        console.error('Error reading file:', error);
    };

    if (dishImage) {
        reader.readAsDataURL(dishImage);
    } else {
        // No image selected, proceed without reading file
        const jsonData = {
            function: 'editRecipe',
            dishId: dishId,
            dishName: dishName,
            dishOrigin: dishOrigin,
            dishDescription: dishDescription,
            dishIngredients: JSON.stringify(dishIngredients),
            dishSteps: JSON.stringify(dishSteps),
            dishCategory: dishCategory,
            dishComplexity: dishComplexity,
            dishPrepTime: dishPrepTime,
            dishRating: dishRating,
            dishImage: null
        };

        apiCalls.editRecipe(jsonData).then(() => {
            document.getElementById('editRecipePopup').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
            addRecipeRows(); // Refresh the recipe list
        }).catch(error => {
            console.error('Error updating recipe:', error);
        });
    }
}


// Function to update step numbers in edit form
function updateEditStepNumbers() {
    const steps = document.querySelectorAll("#editStepsContainer .step");
    steps.forEach((step, index) => {
        step.querySelector("p").innerText = `Step ${index + 1}`;
    });
}






// Save changes button event listener
document.getElementById('saveEditButton').addEventListener('click', updateRecipe);

// Function to show confirmation popup
function confirmAction(message, action, id, callback) {
    const confirmPopup = document.getElementById('confirmActionPopup');
    const overlay = document.getElementById('overlay');
    const confirmMessage = document.getElementById('confirmActionMessage');
    const yesButton = document.getElementById('confirmActionYesButton');

    confirmMessage.textContent = message;
    yesButton.onclick = async function () {
        try {
            if (action === 'disableUser') {
                await disableUser(id);
            } else if (action === 'unlockUser') {
                await unlockUser(id);
            // } else if (action === 'deleteUser') {
            //     await deleteUser(id);
            } else if (action === 'deleteRecipe') {
                await apiCalls.deleteRecipe(id);
                addRecipeRows(); // Refresh the recipe list
            } else if (action === 'deleteMessage') {
                await apiCalls.deleteMessage(id);
            } else if (action === 'deleteUser') {
                await apiCalls.deleteUser(id);
            }
            confirmPopup.classList.remove('active');
            overlay.classList.remove('active');
            // Call the callback function after the action
            if (typeof callback === 'function') {
                callback();
            }
        } catch (error) {
            console.error(`Error performing action ${action}:`, error);
        }
    };

    confirmPopup.classList.add('active');
    overlay.classList.add('active');
}

// Function to close popups
document.getElementById('closePreviewPopup')?.addEventListener('click', () => {
    document.getElementById('previewRecipePopup')?.classList.remove('active');
    document.getElementById('overlay')?.classList.remove('active');
});

document.getElementById('closeEditPopup')?.addEventListener('click', () => {
    document.getElementById('editRecipePopup')?.classList.remove('active');
    document.getElementById('overlay')?.classList.remove('active');
});

document.getElementById('closeViewMessagePopup')?.addEventListener('click', () => {
    document.getElementById('viewMessagePopup')?.classList.remove('active');
    document.getElementById('overlay')?.classList.remove('active');
});

document.getElementById('closeEditUserPopup')?.addEventListener('click', () => {
    document.getElementById('editUserPopup')?.classList.remove('active');
    document.getElementById('overlay')?.classList.remove('active');
});

document.getElementById('closeConfirmActionPopup')?.addEventListener('click', () => {
    document.getElementById('confirmActionPopup')?.classList.remove('active');
    document.getElementById('overlay')?.classList.remove('active');
});

document.getElementById('confirmActionNoButton')?.addEventListener('click', () => {
    document.getElementById('confirmActionPopup')?.classList.remove('active');
    document.getElementById('overlay')?.classList.remove('active');
});

// Listing messages in the messages tab/admin page
const messagesTab = document.getElementById("messagesTab");
if (messagesTab) {
    messagesTab.addEventListener('click', async () => {
        await listMessages();
    });
}

async function listMessages() {
    try {
        const messagesList = document.getElementById("messagesList");
        if (messagesList) {
            messagesList.innerHTML = "";
            const messages = await apiCalls.getMessages();
            messages.forEach(message => addMessageRow(message));
        } else {
            console.error("Element with ID 'messagesList' not found.");
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}














































// Toggle Add Recipe Form
document.getElementById("toggleFormButton").addEventListener("click", function () {
    const form = document.getElementById("addRecipeForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
    // document.getElementById("toggleFormButton").innerText === "+ Add Recipe"
    //     ? document.getElementById("toggleFormButton").innerText = "Cancel"
    //     : document.getElementById("toggleFormButton").innerText = "+ Add Recipe"

    const toggleButton = document.getElementById("toggleFormButton");
    if (toggleButton.innerText === "+ Add Recipe") {
        toggleButton.innerText = "Cancel";
    } else {
        toggleButton.innerText = "+ Add Recipe";
        resetAddRecipeForm();
    }



    // ? (document.getElementById("toggleFormButton").innerText ="Cancel", resetAddRecipeForm())
    // : (document.getElementById("toggleFormButton").innerText ="+ Add Recipe", resetAddRecipeForm())
});

// // Toggle Add User Form
// document.getElementById("toggleUserFormButton").addEventListener("click", function () {
//     const form = document.getElementById("addUserForm");
//     form.style.display = form.style.display === "none" ? "block" : "none";
// });



// Function to add a message row to the table
function addMessageRow(message) {
    const messagesList = document.getElementById('messagesList');
    const row = document.createElement('tr');
    row.classList.add(message.message_read == 1 ? 'read-message-row' : 'unread-message-row');
    row.id = message.message_id;

    // Create a unique ID for the button and image
    const flagButtonId = `flag-button-${message.message_id}`;

    row.innerHTML = `
        <td>
            <button class="flag-button ${message.flagged == 1 ? 'flag-pink' : 'flag-grey'}" id="${flagButtonId}">
            </button>
        </td>
        <td>${message.sender_name}</td>
        <td>${message.sender_email}</td>
        <td>${message.message_sent_date_time}</td>
        <td class="actions">
            <button class="read-btn">Read</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;

    // Append the new row to the messages list
    messagesList.appendChild(row);

    // Add hover functionality to the flag button
    const flagButton = document.getElementById(flagButtonId);

    flagButton.addEventListener('mouseenter', () => {
        flagButton.classList.add('flag-purple');
    });

    flagButton.addEventListener('mouseleave', () => {
        flagButton.classList.remove('flag-purple');
    });

    // Add click event listener for the flag button to swap classes
    row.querySelector('.flag-button').addEventListener('click', () => {
        functions.toggleFlagClass(flagButton);
        apiCalls.flagUnflagMessage(message.message_id);
    });

    // Create and append the expanded row
    const expandedRow = document.createElement('tr');
    expandedRow.classList.add('message-expanded-row'); // to change the name
    expandedRow.style.display = 'none';

    expandedRow.innerHTML = `
        <td colspan="5">
           <div class="expanded-content">
                <h3>From: ${message.sender_name}</h3>
                <h3>Email: ${message.sender_email}</h3>
                <p>${message.message_text}</p>
            </div>
        </td>
    `;

    messagesList.appendChild(expandedRow);

    // Set event handlers for the buttons
    row.querySelector('.read-btn').addEventListener('click', (event) => {
        if (row.classList.contains('unread-message-row')) {
            row.classList.remove('unread-message-row');
            row.classList.add('read-message-row');
        };
        commonController.toggleExpand(event);
        apiCalls.markMessageAsRead(message.message_id);
    });

    row.querySelector('.delete-btn').addEventListener('click', () => {
        confirmAction('Delete message?', 'deleteMessage', message.message_id, () => {
            listMessages();  // Refresh the message list after deleting the message
        });
    });
}





// // Function to add a user row to the table
// function addUserRow(user) {
//     const usersList = document.getElementById('usersList');
//     const row = document.createElement('tr');

//     row.innerHTML = `
//                 <td>${user.name}</td>
//                 <td>${user.email}</td>
//                 <td>${user.role}</td>
//                 <td class="actions">
//                     <button onclick="editUser(${JSON.stringify(user)})">Edit</button>
//                     <button onclick="confirmAction('Reset password?', 'resetPassword', ${user.id})">Reset Password</button>
//                     <button onclick="confirmAction('Disable user?', 'disableUser', ${user.id})">Disable</button>
//                     <button onclick="confirmAction('Unlock user?', 'unlockUser', ${user.id})">Unlock</button>
//                     <button onclick="confirmAction('Delete user?', 'deleteUser', ${user.id})">Delete</button>
//                 </td>
//             `;

//     usersList.appendChild(row);
// }












// Tabs functionality ///////////////************ the same is in common controller - should remove this one */
export function tabsController() {
    const contentSections = document.querySelectorAll('.contentSection');
    const tabButtonArray = document.querySelectorAll('.tabs');
    tabButtonArray.forEach((tabButton, index) => {
        tabButton.addEventListener('click', () => {
            document.querySelector('.tabSelected')?.classList.remove('tabSelected');
            tabButton.classList.add('tabSelected');
            contentSections.forEach((section, sectionIndex) => {
                section.style.display = sectionIndex === index ? 'block' : 'none';
            });
        });
    });
}




//search recipes function + event listener => admin page
async function searchRecipesAdmin() {
    const search = document.getElementById("recipeSearchBox").value;
    const recipesList = document.getElementById('adminRecipesList');
    let searchResults = await apiCalls.searchRecipes(search);
    recipesList.innerHTML = ''; // Clear existing rows before adding new ones




    if (searchResults.length === 0) {
        const noRecipesRow = document.createElement('tr');
        noRecipesRow.classList.add('noResultsRow');
        const noRecipesCell = document.createElement('td');
        noRecipesCell.classList.add('noResultsFound');

        noRecipesCell.colSpan = 8;
        noRecipesCell.textContent = 'No Recipes found';
        noRecipesRow.appendChild(noRecipesCell);
        recipesList.appendChild(noRecipesRow);
    } else {
        searchResults.forEach(result => addRecipeRow(result));
    }



    // searchResults.forEach(result => addRecipeRow(result)); ---------------- commented but not sure if this is needed
    // addRecipeRows(searchResults);
}


document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById('adminRecipesSearch')
    const searchInput = document.getElementById('recipeSearchBox');

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            searchRecipesAdmin();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                searchRecipesAdmin();
            }
        });
    }
});




// Filter recipes function + event listener
async function filterRecipes() {
    const recipeCategory = document.getElementById('recipeOriginFilter').value;
    const recipeComplexity = document.getElementById('recipeComplexityFilter').value;
    const recipeRating = document.getElementById('recipeRatingFilter').value;
    const recipePrepTime = document.getElementById('recipePrepTimeFilter').value;

    let filterCriteria = { "origin_country": recipeCategory, "complexity_name": recipeComplexity, "dish_prep_time": recipePrepTime, "dish_rating": recipeRating };

    addRecipeRows(filterCriteria)
}
document.getElementById('adminRecipesFilter')?.addEventListener('click', () => {
    filterRecipes();
});

//Removing filters
document.getElementById('adminRecipesClearFilters')?.addEventListener('click', function () {
    const filterSelects = document.querySelectorAll('.filter-group select');
    const searchInput = document.getElementById('recipeSearchBox');
    searchInput.value = '',
        filterSelects.forEach(function (select) {
            select.value = '';
        });
    addRecipeRows();
});



// Function to display messages
function displayMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = ''; // Clear the list first

    if (messages.length === 0) {
        const noMessagesRow = document.createElement('tr');
        noMessagesRow.classList.add('noResultsRow');
        const noMessagesCell = document.createElement('td');
        noMessagesCell.classList.add('noResultsFound');

        noMessagesCell.colSpan = 5; // Adjust based on the number of columns in your table
        noMessagesCell.textContent = 'No Messages found';
        noMessagesRow.appendChild(noMessagesCell);
        messagesList.appendChild(noMessagesRow);
    } else {
        messages.forEach(message => {
            addMessageRow(message);
        });
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById('adminMessagesSearch');
    const searchInput = document.getElementById('messageSearchBox');

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchCriteria = searchInput.value;
            handleSearch(searchCriteria);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const searchCriteria = searchInput.value;
                handleSearch(searchCriteria);
            }
        });
    }
});






// Function to handle the search
async function handleSearch(searchCriteria) {
    const messages = await apiCalls.searchMessages(searchCriteria);
    displayMessages(messages);
}



//Filter messages function + event listener
async function filterMessages() {
    try {
        const messageStatus = document.getElementById('messageReadFilter').value;
        const messagesList = document.getElementById("messagesList");


        if (messageStatus && messagesList) {
            messagesList.innerHTML = "";
            const filterResults = await apiCalls.filterMessages(messageStatus);

            if (filterResults.length === 0) {
                const noMessagesRow = document.createElement('tr');
                noMessagesRow.classList.add('noResultsRow');
                const noMessagesCell = document.createElement('td');
                noMessagesCell.classList.add('noResultsFound');

                noMessagesCell.colSpan = 5; // Adjust based on the number of columns in your table
                noMessagesCell.textContent = 'No Messages found';
                noMessagesRow.appendChild(noMessagesCell);
                messagesList.appendChild(noMessagesRow);
            } else {
                filterResults.forEach(result => addMessageRow(result));
            }
        } else if (!messageStatus) {
            await listMessages();
        }
        else {
            console.error("No messages found found.");
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}
document.getElementById('adminMessagesFilter')?.addEventListener('click', () => {
    filterMessages();
});


// list all messages and clear search input
const showAllMessages = document.getElementById("adminMessagesShowAll");
if (showAllMessages) {
    showAllMessages.addEventListener('click', async () => {
        const messagesSearchInput = document.getElementById("messageSearchBox");
        const messageReadFilter = document.getElementById("messageReadFilter");
        messageReadFilter.value = ""; // Clear the input box
        if (messagesSearchInput) {
            messagesSearchInput.value = ""; // Clear the input box
        }
        await listMessages();
    });
}



document.addEventListener("DOMContentLoaded", () => {
    // Add event listeners for adding steps and ingredients
    document.getElementById("addStepButton")?.addEventListener("click", addStepField);
    document.getElementById("addIngredientButton")?.addEventListener("click", addIngredientField);
    document.getElementById("addEditStepButton")?.addEventListener("click", addEditStepField);
    document.getElementById("addEditIngredientButton")?.addEventListener("click", addEditIngredientField);

    // Event listener for add new recipe button
    document.getElementById('addNewRecipe')?.addEventListener('click', () => {

        const form = document.getElementById("addRecipeForm");
        form.style.display = form.style.display === "none" ? "block" : "none";


        const toggleButton = document.getElementById("toggleFormButton");
        toggleButton.innerText = (toggleButton.innerText === "+ Add Recipe") ? "Cancel" : "+ Add Recipe";
        addNewRecipe();
    });

    // Function to add an ingredient field for new recipe
    function addIngredientField() {
        const ingredientsContainer = document.getElementById("ingredientsContainer");
        const ingredientDiv = document.createElement("div");
        ingredientDiv.classList.add("ingredient");
        ingredientDiv.innerHTML = `
            <textarea class="ingredientDescription" placeholder="Ingredient" required></textarea>
            <button type="button" class="removeIngredientButton steptIngredientsButton">Remove</button>
        `;
        ingredientsContainer.appendChild(ingredientDiv);

        // Add event listener for the remove button
        ingredientDiv.querySelector(".removeIngredientButton").addEventListener("click", () => {
            ingredientDiv.remove();
        });
    }

    // Function to add a step field for new recipe
    function addStepField() {
        const stepsContainer = document.getElementById("stepsContainer");
        const stepNumber = stepsContainer.children.length + 1;

        const stepDiv = document.createElement("div");
        stepDiv.classList.add("step");
        stepDiv.innerHTML = `
            <p>Step ${stepNumber}</p>
            <input type="text" class="stepTitle" placeholder="Title" required>
            <textarea class="stepDescription" placeholder="Description" required></textarea>
            <button type="button" class="removeStepButton steptIngredientsButton">Remove</button>
        `;
        stepsContainer.appendChild(stepDiv);

        // Add event listener for the remove button
        stepDiv.querySelector(".removeStepButton").addEventListener("click", () => {
            stepDiv.remove();
            updateStepNumbers();
        });
    }

    // Function to add an ingredient field for edit recipe
    function addEditIngredientField() {
        const ingredientsContainer = document.getElementById("editIngredientsContainer");
        const ingredientDiv = document.createElement("div");
        ingredientDiv.classList.add("ingredient");
        ingredientDiv.innerHTML = `
            <textarea class="ingredientDescription" placeholder="Ingredient" required></textarea>
            <button type="button" class="removeIngredientButton">Remove</button>
        `;
        ingredientsContainer.appendChild(ingredientDiv);

        // Add event listener for the remove button
        ingredientDiv.querySelector(".removeIngredientButton").addEventListener("click", () => {
            ingredientDiv.remove();
        });
    }

    // Function to add a step field for edit recipe
    function addEditStepField() {
        const stepsContainer = document.getElementById("editStepsContainer");
        const stepNumber = stepsContainer.children.length + 1;

        const stepDiv = document.createElement("div");
        stepDiv.classList.add("step");
        stepDiv.innerHTML = `
            <p>Step ${stepNumber}</p>
            <input type="text" class="stepTitle" placeholder="Title" required>
            <textarea class="stepDescription" placeholder="Description" required></textarea>
            <button type="button" class="removeStepButton">Remove</button>
        `;
        stepsContainer.appendChild(stepDiv);

        // Add event listener for the remove button
        stepDiv.querySelector(".removeStepButton").addEventListener("click", () => {
            stepDiv.remove();
            updateEditStepNumbers();
        });
    }

    // Function to update step numbers for new recipe
    function updateStepNumbers() {
        const steps = document.querySelectorAll("#stepsContainer .step");
        steps.forEach((step, index) => {
            step.querySelector("p").innerText = `Step ${index + 1}`;
        });
    }

    // Function to update step numbers for edit recipe
    function updateEditStepNumbers() {
        const steps = document.querySelectorAll("#editStepsContainer .step");
        steps.forEach((step, index) => {
            step.querySelector("p").innerText = `Step ${index + 1}`;
        });
    }
});

// Function to edit recipe
function editRecipe(recipe) {
    const editPopup = document.getElementById('editRecipePopup');
    const overlay = document.getElementById('overlay');
    const countryMap = {
        'india': 1,
        'china': 2,
        'italy': 3,
        'france': 4,
        'russia': 5,
        'moldova': 6
    };
    const complexityMap = {
        'very easy': 1,
        'easy': 2,
        'medium': 3,
        'hard': 4,
        'very hard': 5
    };
    const categoryMap = {
        'non-vegetarian': 1,
        'vegetarian': 2
    };

    document.getElementById('editRecipeId').value = recipe.dish_id;
    document.getElementById('editDishName').value = recipe.dish_name;
    document.getElementById('editDishOrigin').value = countryMap[recipe.origin_country];
    document.getElementById('editDishDescription').value = recipe.dish_recipe_description;

    // Handle ingredients
    const ingredientsContainer = document.getElementById('editIngredientsContainer');
    ingredientsContainer.innerHTML = ''; // Clear previous ingredients
    const ingredients = JSON.parse(recipe.dish_ingredients);
    ingredients.forEach(ingredient => {
        const ingredientDiv = document.createElement('div');
        ingredientDiv.classList.add('ingredient');
        ingredientDiv.innerHTML = `
            <textarea class="ingredientDescription" placeholder="Ingredient" required>${ingredient}</textarea>
            <button type="button" class="removeIngredientButton">Remove</button>
        `;
        ingredientsContainer.appendChild(ingredientDiv);

        ingredientDiv.querySelector(".removeIngredientButton").addEventListener("click", () => {
            ingredientDiv.remove();
        });
    });

    // Handle steps
    const stepsContainer = document.getElementById('editStepsContainer');
    stepsContainer.innerHTML = ''; // Clear previous steps
    const steps = JSON.parse(recipe.dish_steps);
    steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.classList.add('step');
        stepDiv.innerHTML = `
            <p>Step ${index + 1}</p>
            <input type="text" class="stepTitle" placeholder="Title" required value="${step.title}">
            <textarea class="stepDescription" placeholder="Description" required>${step.description}</textarea>
            <button type="button" class="removeStepButton">Remove</button>
        `;
        stepsContainer.appendChild(stepDiv);

        stepDiv.querySelector(".removeStepButton").addEventListener("click", () => {
            stepDiv.remove();
            updateEditStepNumbers();
        });
    });

    document.getElementById('editDishCategory').value = categoryMap[recipe.category_name];
    document.getElementById('editDishComplexity').value = complexityMap[recipe.complexity_name];
    document.getElementById('editDishPrepTime').value = recipe.dish_prep_time;
    document.getElementById('editDishRating').value = Math.floor(recipe.dish_rating);
    document.getElementById('editChefRecommended').value = recipe.dish_chef_recommended;

    editPopup.classList.add('active');
    overlay.classList.add('active');
}

// Existing addNewRecipe function, if not included already
async function addNewRecipe() {
    const dishName = document.getElementById("dishName").value;
    const dishOrigin = document.getElementById("dishOrigin").value;
    const dishDescription = document.getElementById("dishDescription").value;
    const dishCategory = document.getElementById("dishCategory").value;
    const dishComplexity = document.getElementById("dishComplexity").value;
    const dishPrepTime = document.getElementById("dishPrepTime").value;
    const dishRating = document.getElementById("dishRating").value;
    const dishChefRecommended = document.getElementById("dishChefRecommended").value;
    const dishImage = document.getElementById("dishImage").files[0];

    const ingredientsElements = document.querySelectorAll("#ingredientsContainer .ingredientDescription");
    const dishIngredients = Array.from(ingredientsElements).map(input => input.value);

    const stepsElements = document.querySelectorAll("#stepsContainer .step");
    const dishSteps = Array.from(stepsElements).map((stepElement, index) => ({
        step: index + 1,
        title: stepElement.querySelector(".stepTitle").value,
        description: stepElement.querySelector(".stepDescription").value,
    }));

    const jsonData = {
        function: 'addNewRecipe',
        dishName: dishName,
        dishOrigin: dishOrigin,
        dishDescription: dishDescription,
        dishIngredients: dishIngredients,
        dishSteps: JSON.stringify(dishSteps),
        dishCategory: dishCategory,
        dishComplexity: dishComplexity,
        dishPrepTime: dishPrepTime,
        dishRating: dishRating,
        dishChefRecommended: dishChefRecommended,
        dishImage: null
    };

    if (dishImage) {
        const base64Image = await functions.convertImageToBase64(dishImage);
        jsonData.dishImage = base64Image;
    }

    await apiCalls.addNewRecipe(jsonData);
    addRecipeRows(); // Refresh the recipe list

    resetAddRecipeForm();
}

// Existing resetAddRecipeForm function, if not included already
function resetAddRecipeForm() {
    document.getElementById("dishName").value = "";
    document.getElementById("dishOrigin").selectedIndex = 0;
    document.getElementById("dishDescription").value = "";
    document.getElementById("dishCategory").selectedIndex = 0;
    document.getElementById("dishComplexity").selectedIndex = 0;
    document.getElementById("dishPrepTime").value = "";
    document.getElementById("dishRating").selectedIndex = 0;
    document.getElementById("dishChefRecommended").selectedIndex = 0;
    document.getElementById("dishImage").value = "";

    // Clear steps
    const stepsContainer = document.getElementById("stepsContainer");
    while (stepsContainer.firstChild) {
        stepsContainer.removeChild(stepsContainer.firstChild);
    }

    const ingredientsContainer = document.getElementById("ingredientsContainer");
    while (ingredientsContainer.firstChild) {
        ingredientsContainer.removeChild(ingredientsContainer.firstChild);
    }
}











//Filter users function + event listener
async function filterUsers() {
    try {
        const userRole = document.getElementById('userRoleFilter').value;
        const usersList = document.getElementById("usersList");


        if (userRole && usersList) {
            usersList.innerHTML = "";
            const filterResults = await apiCalls.filterUsers(userRole);

            if (filterResults.length === 0) {
                const noUsersRow = document.createElement('tr');
                noUsersRow.classList.add('noResultsRow');
                const noUsersCell = document.createElement('td');
                noUsersCell.classList.add('noResultsFound');

                noUsersCell.colSpan = 4; // Adjust based on the number of columns in your table
                noUsersCell.textContent = 'No Users found';
                noUsersRow.appendChild(noUsersCell);
                usersList.appendChild(noUsersRow);
            } else {
                filterResults.forEach(result => addUserRow(result));
            }
        } else if (!userRole) {
            await listUsers();
        }
        else {
            console.error("No users found .");
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}
document.getElementById('adminUsersFilter')?.addEventListener('click', () => {
    filterUsers();
});

// document.getElementById('showAllUsers')?.addEventListener('click', () => {
//     listUsers();
    
// });



// list all users and clear search input
const showAllUsers = document.getElementById("showAllUsers");
if (showAllUsers) {
    showAllUsers.addEventListener('click', async () => {
        const usersSearchInput = document.getElementById("userSearchBox");
        const usersRoleFilter = document.getElementById("userRoleFilter");
        usersRoleFilter.value = ""; // Clear the input box
        if (usersSearchInput) {
            usersSearchInput.value = ""; // Clear the input box
        }
        listUsers();
    });
}

























document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById('adminUsersSearch');
    const searchInput = document.getElementById('userSearchBox');

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchCriteria = searchInput.value;
            handleUserSearch(searchCriteria);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const searchCriteria = searchInput.value;
                handleUserSearch(searchCriteria);
            }
        });
    }
});






// Function to handle the search
async function handleUserSearch(searchCriteria) {

    try {
        const usersList = document.getElementById("usersList");
        const users = await apiCalls.searchUsers(searchCriteria);




        if (users && usersList) {
            usersList.innerHTML = "";
            if (users.length === 0) {
                const noUsersRow = document.createElement('tr');
                noUsersRow.classList.add('noResultsRow');
                const noUsersCell = document.createElement('td');
                noUsersCell.classList.add('noResultsFound');

                noUsersCell.colSpan = 4; // Adjust based on the number of columns in your table
                noUsersCell.textContent = 'No Users found';
                noUsersRow.appendChild(noUsersCell);
                usersList.appendChild(noUsersRow);
            } else {
                users.forEach(user => addUserRow(user));
            }
        } else if (!users) {
            await listUsers();
        }
        else {
            console.error("No users found .");
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }

}














































// Function to edit user
function editUser(user) {
    const editPopup = document.getElementById('editUserPopup');
    const overlay = document.getElementById('overlay');

    document.getElementById('editUserId').value = user.user_id;
    document.getElementById('editUserName').value = user.user_name;
    document.getElementById('editUserSurname').value = user.user_surname;

    document.getElementById('editUserEmail').value = user.user_email;
    document.getElementById('editUserPassword').value = "";
    document.getElementById('editUserRole').value = user.user_type;

    editPopup.classList.add('active');
    overlay.classList.add('active');
}











// Save changes button event listener for users
document.getElementById('saveUserChangesButton').addEventListener('click', updateUser);

async function updateUser() {
    const userId = document.getElementById('editUserId').value;
    const userName = document.getElementById('editUserName').value;
    const userSurname = document.getElementById('editUserSurname').value;
    const userEmail = document.getElementById('editUserEmail').value;
    const userPassword = document.getElementById('editUserPassword').value;
    const userRole = document.getElementById('editUserRole').value;


    const jsonData = {
        function: 'editUser',
        userId: userId,
        userName: userName,
        userSurname: userSurname,
        userEmail: userEmail,
        userPassword: userPassword,
        userRole: userRole
    };

    try {
        await apiCalls.editUser(jsonData);
        document.getElementById('editUserPopup').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        listUsers(); // Refresh the user list
    } catch (error) {
        console.error('Error updating user:', error);
    }
}












function addUserRow(user) {
    const userList = document.getElementById('usersList');
    const row = document.createElement('tr');
    row.id = user.user_id;

    // Create a unique ID for the button and image

    row.innerHTML = `
        <td>${user.user_name} ${user.user_surname}</td>
        <td>${user.user_email}</td>
        <td>${user.user_type}</td>
        <td class="actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;

    // Append the new row to the messages list
    userList.appendChild(row);




    // Set event handlers for the buttons

    row.querySelector('.delete-btn').addEventListener('click', () => {
        confirmAction('Delete User?', 'deleteUser', user.user_id, () => {
            listUsers();  // Refresh the users list after deleting the user
        });
    });
    row.querySelector('.edit-btn').addEventListener('click', () => editUser(user));

}




async function listUsers() {
    try {
        const usersList = document.getElementById("usersList");
        if (usersList) {
            usersList.innerHTML = "";
            const users = await apiCalls.getUsersList();
            users.forEach(user => addUserRow(user));
        } else {
            console.error("Element with ID 'usersList' not found.");
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}









// Listing messages in the messages tab/admin page
const usersTab = document.getElementById("usersTab");
if (usersTab) {
    usersTab.addEventListener('click', async () => {
        await listUsers();
    });
}































