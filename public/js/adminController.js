import * as apiCalls from './apiCalls.js';
import * as functions from './functions.js';
import * as commonController from './commonController.js';


// Function to append a row to adminPage.php recipes table
export function addRecipeRow(recipe) {
    const recipesList = document.getElementById('adminRecipesList');


    // Creating table row for recipe
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


    // Creating expanded table row for recipe
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
    // Listing each ingredient as separate list item
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
    // Listing each step name and step description as separate list items
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


    // Appending table row and expanded table row to recipes table
    recipesList.appendChild(row);
    recipesList.appendChild(expandedRow);

    // Event listeners for Expand, Edit and Delete buttons
    row.querySelector('.expand-btn').addEventListener('click', commonController.toggleExpand);
    row.querySelector('.edit-btn').addEventListener('click', () => editRecipe(recipe));
    row.querySelector('.delete-btn').addEventListener('click', () => confirmAction('Delete recipe?', 'deleteRecipe', recipe.dish_id));
}


// Function to append all or filtered recipes to adminPage.php
// Recipes table
async function addRecipeRows(filter = []) {


    // Calling getRecipes to retrieve the recipes from DB 
    const recipes = await apiCalls.getRecipes(filter);
    const recipesList = document.getElementById('adminRecipesList');

    // Clear the current rows    
    recipesList.innerHTML = '';


    // Displaying No recipe found if there are no search results
    if (recipes.length === 0) {
        const noRecipesRow = document.createElement('tr');
        noRecipesRow.classList.add('noResultsRow');
        const noRecipesCell = document.createElement('td');
        noRecipesCell.classList.add('noResultsFound');
        noRecipesCell.colSpan = 8;
        noRecipesCell.textContent = 'No Recipes found';
        noRecipesRow.appendChild(noRecipesCell);
        recipesList.appendChild(noRecipesRow);
    } 
    

    // Calling addRecipeRow() to list the search results
    else {
        recipes.forEach(recipe => addRecipeRow(recipe));
    }
}


// Function to amend/update a recipe
async function updateRecipe() {


    // Getting field values / recipe details
    const dishId = document.getElementById('editRecipeId').value;
    const dishName = document.getElementById('editDishName').value;
    const dishOrigin = document.getElementById('editDishOrigin').value;
    const dishDescription = document.getElementById('editDishDescription').value;
    const dishCategory = document.getElementById('editDishCategory').value;
    const dishComplexity = document.getElementById('editDishComplexity').value;
    const dishPrepTime = document.getElementById('editDishPrepTime').value;
    const dishRating = document.getElementById('editDishRating').value;
    const dishImage = document.getElementById('editDishImage').files[0];
    const dishChefRecommended = document.getElementById('editChefRecommended').value;   
    const ingredientsElements = document.querySelectorAll("#editIngredientsContainer .ingredientDescription");
    const dishIngredients = Array.from(ingredientsElements).map(input => input.value);

    const stepsElements = document.querySelectorAll("#editStepsContainer .step");
    const dishSteps = Array.from(stepsElements).map((stepElement, index) => ({
        step: index + 1,
        title: stepElement.querySelector(".stepTitle").value,
        description: stepElement.querySelector(".stepDescription").value,
    }));

    const reader = new FileReader();


    // Storing recipe data when image has been uploaded
    reader.onloadend = function () {
        const base64Image = reader.result ? reader.result.split(',')[1] : null;


        // Storing recipe data into JSON 
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
            dishChefRecommended: dishChefRecommended,
            dishImage: base64Image
        };


        // Calling editRecipe() and passing recipe data to update the recipe in DB
        apiCalls.editRecipe(jsonData).then(() => {


            // Closing Edit Recipe popup and removing overlay
            document.getElementById('editRecipePopup').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');


            // Calling addRecipeRows() to refresh the recipes list
            addRecipeRows();
        }).catch(error => {
            console.error('Error updating recipe:', error);
        });
    };

    reader.onerror = function (error) {
        console.error('Error reading file:', error);
    };


    if (dishImage) {
        reader.readAsDataURL(dishImage);
    } 
    
    
    // Storing recipe data when image has not been uploaded
    else {
        // If no image has been selected, proceed without reading file
        // and store recipe data into JSON 

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
            dishChefRecommended: dishChefRecommended,
            dishImage: null
        };


        // Calling editRecipe() and passing recipe data to update the recipe in DB
        apiCalls.editRecipe(jsonData).then(() => {


            // Closing Edit Recipe popup and removing overlay
            document.getElementById('editRecipePopup').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');


            // Calling addRecipeRows() to refresh the recipes list
            addRecipeRows();
            console.error('Error updating recipe:', error);
        });
    }
}


// Save changes button event listener
document.getElementById('saveEditButton').addEventListener('click', () => {
    const changesSavedNotification = document.getElementById('changesSavedNotification');

    // Calculate the center position
    const left = (window.innerWidth / 2) - (changesSavedNotification.offsetWidth / 2);
    const top = (window.innerHeight / 2) - (changesSavedNotification.offsetHeight / 2);

    // Set the position
    changesSavedNotification.style.left = left + 'px';
    changesSavedNotification.style.top = top + 'px';

    changesSavedNotification.classList.add('show');

    setTimeout(() => {
        changesSavedNotification.classList.remove('show');
    }, 1000); // 1 second

    // Call updateRecipe function
    updateRecipe();
});


// Function to show and handle the confirmation popup
function confirmAction(message, action, id, callback) {
    const confirmPopup = document.getElementById('confirmActionPopup');
    const overlay = document.getElementById('overlay');
    const confirmMessage = document.getElementById('confirmActionMessage');
    const yesButton = document.getElementById('confirmActionYesButton');

    confirmMessage.textContent = message;
    yesButton.onclick = async function () {
        try {

            if (action === 'deleteRecipe') {
                // Calling deleteRecipe() to delete the recipe
                await apiCalls.deleteRecipe(id);
                // Calling addRecipeRows() to refresh the recipes list
                addRecipeRows();
            } 

            
            else if (action === 'deleteMessage') {
                 // Calling deleteMessage() to delete the message
                await apiCalls.deleteMessage(id);
                // Calling getMessages() to refresh the messages list
                await apiCalls.getMessages();
            } 

            
            else if (action === 'deleteUser') {
                // Calling deleteUser() to delete the user
                await apiCalls.deleteUser(id);
                // Calling getUsersList() to refresh the users list
                await apiCalls.getUsersList();
            }


            // Closing confirmation popup and removing overlay
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



    // Displaying confirmation popup and overlay
    confirmPopup.classList.add('active');
    overlay.classList.add('active');
}


// Event listeners for confirmation popup
document.getElementById('closeEditPopup')?.addEventListener('click', () => {
    document.getElementById('editRecipePopup')?.classList.remove('active');
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


// Calling listMessages() when user selects the messages tab
const messagesTab = document.getElementById("messagesTab");
if (messagesTab) {
    messagesTab.addEventListener('click', async () => {
        await listMessages();
    });
}


// Toggling Add Recipe Form
document.getElementById("toggleFormButton").addEventListener("click", function () {
    const form = document.getElementById("addRecipeForm");
    form.style.display = form.style.display === "none" ? "block" : "none";


    // Toggling + Add Recipe button text 
    const toggleButton = document.getElementById("toggleFormButton");
    if (toggleButton.innerText === "+ Add Recipe") {
        toggleButton.innerText = "Cancel";
    } else {
        toggleButton.innerText = "+ Add Recipe";

        // Clearing add recipe form
        resetAddRecipeForm();
    }
});


// Function to append a row to adminPage.php messages table
function addMessageRow(message) {
    const messagesList = document.getElementById('messagesList');


    // Creating table row for message and adding CSS class based on read unread
    const row = document.createElement('tr');
    row.classList.add(message.message_read == 1 ? 'read-message-row' : 'unread-message-row');
    row.id = message.message_id;


    // Adding mesage_id to flag button so that message can be fragged / unflagged
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


    // Appending table row to messages table
    messagesList.appendChild(row);


    // Flag button hover functionality
    const flagButton = document.getElementById(flagButtonId);

    flagButton.addEventListener('mouseenter', () => {
        flagButton.classList.add('flag-purple');
    });

    flagButton.addEventListener('mouseleave', () => {
        flagButton.classList.remove('flag-purple');
    });


    // Event listener for the flag button to swap classes
    row.querySelector('.flag-button').addEventListener('click', () => {
        functions.toggleFlagClass(flagButton);
        apiCalls.flagUnflagMessage(message.message_id);

    });


    // Creating expanded message table row and adding CSS classes
    const expandedRow = document.createElement('tr');
    expandedRow.classList.add('message-expanded-row');
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


    // Appending expanded messages table row
    messagesList.appendChild(expandedRow);


    // Event listener for message read button
    row.querySelector('.read-btn').addEventListener('click', (event) => {
        if (row.classList.contains('unread-message-row')) {
            row.classList.remove('unread-message-row');
            row.classList.add('read-message-row');
        };


        // Calling toggleExpand() toggle message expanded row CSS classes
        commonController.toggleExpand(event);


        // Caling markMessageAsRead() to set the message as read in DB
        apiCalls.markMessageAsRead(message.message_id);
    });


    // Event listener for message read button
    row.querySelector('.delete-btn').addEventListener('click', () => {


        // Calling confirmAction() to display confirmation popup
        confirmAction('Delete message?', 'deleteMessage', message.message_id, () => {

            // Calling listMessages() to refresh messages list.
            listMessages()
        });
    });
}


// Function to list messages on adminPage.php messages table
async function listMessages() {
    try {
        const messagesList = document.getElementById("messagesList");
        if (messagesList) {


            // Clear the current rows    
            messagesList.innerHTML = "";


            // Calling getMessages() to retrieve messages from DB 
            const messages = await apiCalls.getMessages();


            // Calling addMessageRow() to append each messages
            messages.forEach(message => addMessageRow(message));
        } else {
            console.error("Element with ID 'messagesList' not found.");
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}


// Function to search recipes (adminPage.php)
async function searchRecipesAdmin() {
    const search = document.getElementById("recipeSearchBox").value;
    const recipesList = document.getElementById('adminRecipesList');


    // Calling searchRecipes() to search for recipes based on the search riteria
    const searchResults = await apiCalls.searchRecipes(search);


    // Clearing the recipes rows before displaying  the search results
    recipesList.innerHTML = '';


    // Displaying No recipe found if there are no search results
    if (searchResults.length === 0) {
        const noRecipesRow = document.createElement('tr');
        noRecipesRow.classList.add('noResultsRow');
        const noRecipesCell = document.createElement('td');
        noRecipesCell.classList.add('noResultsFound');

        noRecipesCell.colSpan = 8;
        noRecipesCell.textContent = 'No Recipes found';
        noRecipesRow.appendChild(noRecipesCell);
        recipesList.appendChild(noRecipesRow);
    } 
    

    // Calling addRecipeRow() to list the search results
    else {
        searchResults.forEach(result => addRecipeRow(result));
    }
}


// Event listener for adminPage.php recipes search button
// And calling searchRecipesAdmin() to search for recipes
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


// Function to filter recipes
async function filterRecipes() {
    const recipeCategory = document.getElementById('recipeOriginFilter').value;
    const recipeComplexity = document.getElementById('recipeComplexityFilter').value;
    const recipeRating = document.getElementById('recipeRatingFilter').value;
    const recipePrepTime = document.getElementById('recipePrepTimeFilter').value;

    let filterCriteria = { "origin_country": recipeCategory, "complexity_name": recipeComplexity, "dish_prep_time": recipePrepTime, "dish_rating": recipeRating };


    // Calling addRecipeRows() to list the results
    addRecipeRows(filterCriteria)
}


// Event listener for recipes filter button
document.getElementById('adminRecipesFilter')?.addEventListener('click', () => {


    // Calling filterRecipes() to filter and list filtered recipes    
    filterRecipes();
});


// Event listener for show all button recipes tab
document.getElementById('adminRecipesClearFilters')?.addEventListener('click', function () {
    const filterSelects = document.querySelectorAll('.filter-group select');
    const searchInput = document.getElementById('recipeSearchBox');


    // Clearing search input
    searchInput.value = '';


        // Resetting filters to default values
        filterSelects.forEach(function (select) {
            select.value = '';
        });

    // Calling addRecipeRows() to refresh recipes list  
    addRecipeRows();
});


// Function to display messages search results
function displaySearchMessages(messages) {
    const messagesList = document.getElementById('messagesList');


    // Clearing the messges list before displaying  the search results
    messagesList.innerHTML = ''; // Clear the list first


    // Displaying No messages found if there are no search results
    if (messages.length === 0) {
        const noMessagesRow = document.createElement('tr');
        noMessagesRow.classList.add('noResultsRow');
        const noMessagesCell = document.createElement('td');
        noMessagesCell.classList.add('noResultsFound');

        noMessagesCell.colSpan = 5;
        noMessagesCell.textContent = 'No Messages found';
        noMessagesRow.appendChild(noMessagesCell);
        messagesList.appendChild(noMessagesRow);
    } 
    
    
    // Calling addMessageRow() to list the search results
    else {
        messages.forEach(message => {
            addMessageRow(message);
        });
    }
}


// Function to handle messages search functionality
// Calling searchMessages() to get search results
// And calling displaySearchMessages() to display the results
async function handleSearch(searchCriteria) {
    const messages = await apiCalls.searchMessages(searchCriteria);
    displaySearchMessages(messages);
}


// Event listener for adminPage.php messages tab search button 
// And calling handleSearch() to search messages
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


// Function to filter messages
async function filterMessages() {
    try {
        const messageStatus = document.getElementById('messageReadFilter').value;
        const messagesList = document.getElementById("messagesList");


        if (messageStatus && messagesList) {


            // Clearing the messges list before displaying filtered results
            messagesList.innerHTML = "";


            // Calling filterMessages() to get messages based on filter value
            const filterResults = await apiCalls.filterMessages(messageStatus);


            // Displaying No messages found if there are no filtered results
            if (filterResults.length === 0) {
                const noMessagesRow = document.createElement('tr');
                noMessagesRow.classList.add('noResultsRow');
                const noMessagesCell = document.createElement('td');
                noMessagesCell.classList.add('noResultsFound');

                noMessagesCell.colSpan = 5;
                noMessagesCell.textContent = 'No Messages found';
                noMessagesRow.appendChild(noMessagesCell);
                messagesList.appendChild(noMessagesRow);
            } 
            
            
            // Calling addMessageRow() to list filtered results
            else {
                filterResults.forEach(result => addMessageRow(result));
            }

        } else if (!messageStatus) {


            // Calling listMessages() to listing all the messaeges if there are no filters set
            await listMessages();
        }
        else {
            console.error("No messages found found.");
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}


// Event listener for messages filter button
document.getElementById('adminMessagesFilter')?.addEventListener('click', () => {

    // Calling filterMessages() to filter and list filtered messages    
    filterMessages();
});


// Event listener for show all button messages tab
const showAllMessages = document.getElementById("adminMessagesShowAll");
if (showAllMessages) {
    showAllMessages.addEventListener('click', async () => {
        const messagesSearchInput = document.getElementById("messageSearchBox");
        const messageReadFilter = document.getElementById("messageReadFilter");


        // Resetting filters to default values
        messageReadFilter.value = "";


        // Clearing search input
        if (messagesSearchInput) {
            messagesSearchInput.value = "";
        }


        // Calling listMessages() to refresh messages list  
        await listMessages();
    });
}


// Function to add an ingredient field for a new recipe
function addIngredientField() {
    const ingredientsContainer = document.getElementById("ingredientsContainer");
    const ingredientDiv = document.createElement("div");
    ingredientDiv.classList.add("ingredient");
    ingredientDiv.innerHTML = `
        <textarea class="ingredientDescription" placeholder="Ingredient" required></textarea>
        <button type="button" class="removeIngredientButton steptIngredientsButton">Remove</button>
    `;
    ingredientsContainer.appendChild(ingredientDiv);

    // Event listener for ingredient remove button
    ingredientDiv.querySelector(".removeIngredientButton").addEventListener("click", () => {
        ingredientDiv.remove();
    });
}


// Function to add a step field for a new recipe
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

    // Event listener for step remove button
    stepDiv.querySelector(".removeStepButton").addEventListener("click", () => {
        stepDiv.remove();
        updateStepNumbers();
    });
}


// Function to add an ingredient field for edit recipe popup form
function addEditIngredientField() {
    const ingredientsContainer = document.getElementById("editIngredientsContainer");
    const ingredientDiv = document.createElement("div");
    ingredientDiv.classList.add("ingredient");
    ingredientDiv.innerHTML = `
        <textarea class="ingredientDescription" placeholder="Ingredient" required></textarea>
        <button type="button" class="removeIngredientButton">Remove</button>
    `;
    ingredientsContainer.appendChild(ingredientDiv);

    // Event listener for ingredient remove button
    ingredientDiv.querySelector(".removeIngredientButton").addEventListener("click", () => {
        ingredientDiv.remove();
    });
}


// Function to add a step field for edit recipe popupform
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

    // Event listener for step remove button
    stepDiv.querySelector(".removeStepButton").addEventListener("click", () => {
        stepDiv.remove();
        updateEditStepNumbers();
    });
}


// Function to update step numbers for new recipe 
// When adding or removing steps
function updateStepNumbers() {
    const steps = document.querySelectorAll("#stepsContainer .step");
    steps.forEach((step, index) => {
        step.querySelector("p").innerText = `Step ${index + 1}`;
    });
}


// Function to update step numbers for edit recipe popup form
// When adding or removing steps
function updateEditStepNumbers() {
    const steps = document.querySelectorAll("#editStepsContainer .step");
    steps.forEach((step, index) => {
        step.querySelector("p").innerText = `Step ${index + 1}`;
    });
}


// Event listeners for add / remove step and ingredient
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addStepButton")?.addEventListener("click", addStepField);
    document.getElementById("addIngredientButton")?.addEventListener("click", addIngredientField);
    document.getElementById("addEditStepButton")?.addEventListener("click", addEditStepField);
    document.getElementById("addEditIngredientButton")?.addEventListener("click", addEditIngredientField);
});


// Event listener for add new recipe button
document.getElementById('addNewRecipe')?.addEventListener('click', () => {


    // Notification to prompt user that new recipe hass been added
    // Setting the position of the notification to the middle of the screen
    const recipeAddedNotification = document.getElementById('recipeAddedNotification');


    // Calculate the center position
    const left = (window.innerWidth / 2) - (recipeAddedNotification.offsetWidth / 2);
    const top = (window.innerHeight / 2) - (recipeAddedNotification.offsetHeight / 2);
    

    // Set the position
    recipeAddedNotification.style.left = left + 'px';
    recipeAddedNotification.style.top = top + 'px';


    // Changing adding CSS class to notification
    recipeAddedNotification.classList.add('show');


    // Notification timeout
    setTimeout(function() {
        recipeAddedNotification.classList.remove('show');
    }, 1000);


    // Toggling add new recipe form visibility
    const form = document.getElementById("addRecipeForm");
    form.style.display = form.style.display === "none" ? "block" : "none";


    // Toggling add recipe button text 
    const toggleButton = document.getElementById("toggleFormButton");
    toggleButton.innerText = (toggleButton.innerText === "+ Add Recipe") ? "Cancel" : "+ Add Recipe";


    // Calling addNewRecipe() to store the new recipe in DB 
    addNewRecipe();
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


    // Filling the edit recipe form with recipe data stored in DB
    document.getElementById('editRecipeId').value = recipe.dish_id;
    document.getElementById('editDishName').value = recipe.dish_name;
    document.getElementById('editDishOrigin').value = countryMap[recipe.origin_country];
    document.getElementById('editDishDescription').value = recipe.dish_recipe_description;


    // Handling ingredients
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


    // Handling steps
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
    document.getElementById('editDishImage').value = '';


    // Changing visibility for overlay and edit recipe popup
    editPopup.classList.add('active');
    overlay.classList.add('active');
}


// Function to add / store a new recipe in the DB
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


    // Storing add recipe form data into JSON 
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


    // If dish image uploaded / added
    // Encoding the uploaded image to base64
    // Adding the encoded image to JSON
    if (dishImage) {
        const base64Image = await functions.convertImageToBase64(dishImage);
        jsonData.dishImage = base64Image;
    }


    // Calling addNewRecipe() to store the new recipe in teh DB
    await apiCalls.addNewRecipe(jsonData);


    // Calling addRecipeRows() to refresh the recipes list
    addRecipeRows();


    //Calling resetAddRecipeForm() to clear the add new recipe form input
    resetAddRecipeForm();
}


// Function to clear / reset the add new recipe form input
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


    // Removing the steps
    const stepsContainer = document.getElementById("stepsContainer");
    while (stepsContainer.firstChild) {
        stepsContainer.removeChild(stepsContainer.firstChild);
    }


    // Removing the ingredients
    const ingredientsContainer = document.getElementById("ingredientsContainer");
    while (ingredientsContainer.firstChild) {
        ingredientsContainer.removeChild(ingredientsContainer.firstChild);
    }
}


// Function to filter users based on users type / role
async function filterUsers() {
    try {
        const userRole = document.getElementById('userRoleFilter').value;
        const usersList = document.getElementById("usersList");


        if (userRole && usersList) {


            // Clear the current rows    
            usersList.innerHTML = "";


            // Calling filterUsers() to retrieve filtered results
            const filterResults = await apiCalls.filterUsers(userRole);


            // Displaying No Users found if there are no filter results
            if (filterResults.length === 0) {
                const noUsersRow = document.createElement('tr');
                noUsersRow.classList.add('noResultsRow');
                const noUsersCell = document.createElement('td');
                noUsersCell.classList.add('noResultsFound');

                noUsersCell.colSpan = 4; // Adjust based on the number of columns in your table
                noUsersCell.textContent = 'No Users found';
                noUsersRow.appendChild(noUsersCell);
                usersList.appendChild(noUsersRow);
            } 
            
            
            //Appending the results to users list 
            else {
                filterResults.forEach(result => addUserRow(result));
            }
        }         
        else if (!userRole) {
            await listUsers();
        }
        else {
            console.error("No users found .");
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}


// Event listeners for filter users button
document.getElementById('adminUsersFilter')?.addEventListener('click', () => {
    filterUsers();
});


// Event listener for show all button - users tab
const showAllUsers = document.getElementById("showAllUsers");
if (showAllUsers) {
    showAllUsers.addEventListener('click', async () => {
        const usersSearchInput = document.getElementById("userSearchBox");
        const usersRoleFilter = document.getElementById("userRoleFilter");
        
        
        // Resetting filter to default value
        usersRoleFilter.value = ""; // Clear the input box
        
        
        // Clearing search input
        if (usersSearchInput) {
            usersSearchInput.value = ""; // Clear the input box
        }


        //Listing all users
        listUsers();
    });
}


// Event listener for users search button
document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById('adminUsersSearch');
    const searchInput = document.getElementById('userSearchBox');

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchCriteria = searchInput.value;


            //Calling handleUserSearch() to search users and list the results
            handleUserSearch(searchCriteria);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const searchCriteria = searchInput.value;


                //Calling handleUserSearch() to search users and list the results
                handleUserSearch(searchCriteria);
            }
        });
    }
});


// Function to handle user search functionality
async function handleUserSearch(searchCriteria) {
    try {
        const usersList = document.getElementById("usersList");


        // Calling searchUsers() to get search results
        const users = await apiCalls.searchUsers(searchCriteria);
        if (users && usersList) {
            usersList.innerHTML = "";
            if (users.length === 0) {
                const noUsersRow = document.createElement('tr');
                noUsersRow.classList.add('noResultsRow');
                const noUsersCell = document.createElement('td');
                noUsersCell.classList.add('noResultsFound');

                noUsersCell.colSpan = 4;
                noUsersCell.textContent = 'No Users found';
                noUsersRow.appendChild(noUsersCell);
                usersList.appendChild(noUsersRow);
            } 
            
            
            // Calling addUserRow() to display the results
            else {
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


    // Filling the edit user form with user data stored in DB
    document.getElementById('editUserId').value = user.user_id;
    document.getElementById('editUserName').value = user.user_name;
    document.getElementById('editUserSurname').value = user.user_surname;
    document.getElementById('editUserEmail').value = user.user_email;
    document.getElementById('editUserPassword').value = "";
    document.getElementById('editUserRole').value = user.user_type;



    // Changing visibility for overlay and edit user popup
    editPopup.classList.add('active');
    overlay.classList.add('active');
}


// Event listener for Save changes button 
document.getElementById('saveUserChangesButton').addEventListener('click', () => {


    // Notification to prompt user that user details have been saved / updated
    // Setting the position of the notification to the middle of the screen
    const changesSavedNotification = document.getElementById('changesSavedNotification');


    // Calculate the center position
    const left = (window.innerWidth / 2) - (changesSavedNotification.offsetWidth / 2);
    const top = (window.innerHeight / 2) - (changesSavedNotification.offsetHeight / 2);


    // Set the position
    changesSavedNotification.style.left = left + 'px';
    changesSavedNotification.style.top = top + 'px';


    // Adding CSS class to notification
    changesSavedNotification.classList.add('show');


    // Notification timeout
    setTimeout(() => {
        changesSavedNotification.classList.remove('show');
    }, 1000); // 1 second


    // Call updateUser() to store user's details
    updateUser();
});


// Function to amend/update user details
async function updateUser() {


    // Getting field values / user details
    const userId = document.getElementById('editUserId').value;
    const userName = document.getElementById('editUserName').value;
    const userSurname = document.getElementById('editUserSurname').value;
    const userEmail = document.getElementById('editUserEmail').value;
    const userPassword = document.getElementById('editUserPassword').value;
    const userRole = document.getElementById('editUserRole').value;


    // Storing user data into JSON 
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


        // Calling editUser() and passing user data to update the user in DB
        await apiCalls.editUser(jsonData);


        // Closing Edit User popup and removing overlay
        document.getElementById('editUserPopup').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');


        // Calling listUsers() to refresh the users list
        listUsers();
    } catch (error) {
        console.error('Error updating user:', error);
    }
}


// Function to append a row to adminPage.php users table
function addUserRow(user) {
    const userList = document.getElementById('usersList');


    // Creating table row for user
    const row = document.createElement('tr');


    // Assigning user_Id to the row 
    // so that later it can be used to edit or delete the user
    row.id = user.user_id;

    row.innerHTML = `
        <td>${user.user_name} ${user.user_surname}</td>
        <td>${user.user_email}</td>
        <td>${user.user_type}</td>
        <td class="actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;


    // Appending the new row to the messages list
    userList.appendChild(row);


    // Event listeners for Edit and Delete buttons
    row.querySelector('.delete-btn').addEventListener('click', () => {
        confirmAction('Delete User?', 'deleteUser', user.user_id, () => {

            //Refresh users list after deleting user
            listUsers();
        });
    });
    row.querySelector('.edit-btn').addEventListener('click', () => editUser(user));
}


// Function to list users on adminPage.php users table
async function listUsers() {
    try {
        const usersList = document.getElementById("usersList");
        if (usersList) {


            // Clear the current rows    
            usersList.innerHTML = "";


            // Calling getUsersList() to retrieve users from DB 
            const users = await apiCalls.getUsersList();


            // Calling addUserRow() to append each user
            users.forEach(user => addUserRow(user));
        } else {
            console.error("Element with ID 'usersList' not found.");
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}


// Calling listUsers() when user selects the users tab
const usersTab = document.getElementById("usersTab");
if (usersTab) {
    usersTab.addEventListener('click', async () => {
        await listUsers();
    });
}


// Calling addRecipeRows() and tabsController() once all the necessary DOM elements 
// Have been created to listing all the recipes - Recipes Tab
// And calling tabsController() to toggle tabs CSS classes 
if (window.location.pathname.includes('adminPage.php')) {
    addRecipeRows();
    commonController.tabsController();
}


