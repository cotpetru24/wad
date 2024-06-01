


document.getElementById('addNewRecipe')?.addEventListener('click', () => {
    addNewRecipe();
    alert ("add reipe button clicked")
});











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

async function addRecipeRows(filter={}) {
    const recipes = await apiCalls.getRecipes(filter);
    const recipesList = document.getElementById('adminRecipesList');
    recipesList.innerHTML = ''; // Clear existing rows before adding new ones
    recipes.forEach(recipe => addRecipeRow(recipe));
}

export function toggleExpand(event) {
    const button = event.target; // Get the target button from the event
    const row = button.closest('tr'); // Ensure button is a DOM element and get the closest tr
    const expandedRow = row.nextElementSibling;
    if (expandedRow && expandedRow.style.display === 'none') {
        expandedRow.style.display = 'table-row';
        button.textContent = 'Collapse';
    } else if (expandedRow) {
        expandedRow.style.display = 'none';
        button.textContent = 'Expand';
    }
}

export function addRecipeRow(recipe) {
    const recipesList = document.getElementById('adminRecipesList');
    const row = document.createElement('tr');
    row.classList.add('recipe-row');

    row.innerHTML = `
        <td>${recipe.dish_name}</td>
        <td class="fixed-cell">${recipe.dish_recipe_description}</td>
        <td>${recipe.category_name}</td>
        <td class="fixed-cell">${JSON.parse(recipe.dish_ingredients).join(', ')}</td>
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
    expandedRow.classList.add('recipe-expanded-row');
    expandedRow.style.display = 'none';

    expandedRow.innerHTML = `
        <td colspan="9">
            <div class="expanded-content">
                <h3>Description</h3>
                <p>${recipe.dish_recipe_description}</p>
                <h3>Ingredients</h3>
                <p>${JSON.parse(recipe.dish_ingredients).join(', ')}</p>
                <h3>Steps</h3>
                <p>${recipe.dish_steps}</p>
            </div>
        </td>
    `;

    recipesList.appendChild(row);
    recipesList.appendChild(expandedRow);

    // Attach event listeners
    row.querySelector('.expand-btn').addEventListener('click', toggleExpand);
    row.querySelector('.edit-btn').addEventListener('click', () => editRecipe(recipe));
    row.querySelector('.delete-btn').addEventListener('click', () => confirmAction('Delete recipe?', 'deleteRecipe', recipe.dish_id));
}

async function updateRecipe() {
    const dishId = document.getElementById('editRecipeId').value;
    const dishName = document.getElementById('editDishName').value;
    const dishOrigin = document.getElementById('editDishOrigin').value;
    const dishDescription = document.getElementById('editDishDescription').value;
    const dishIngredients = document.getElementById('editDishIngredients').value;
    const dishSteps = document.getElementById('editDishSteps').value;
    const dishCategory = document.getElementById('editDishCategory').value;
    const dishComplexity = document.getElementById('editDishComplexity').value;
    const dishPrepTime = document.getElementById('editDishPrepTime').value;
    const dishRating = document.getElementById('editDishRating').value;
    const dishImage = document.getElementById('editDishImage').files[0];

    const reader = new FileReader();

    reader.onloadend = function () {
        const base64Image = reader.result ? reader.result.split(',')[1] : null;

        const jsonData = {
            function: 'editRecipe',
            dishId: dishId,
            dishName: dishName,
            dishOrigin: dishOrigin,
            dishDescription: dishDescription,
            dishIngredients: functions.convertToJSONArray(dishIngredients),
            dishSteps: dishSteps,
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
            dishIngredients: functions.convertToJSONArray(dishIngredients),
            dishSteps: dishSteps,
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
    document.getElementById('editDishIngredients').value = JSON.parse(recipe.dish_ingredients).join(', ');
    document.getElementById('editDishSteps').value = recipe.dish_steps;
    document.getElementById('editDishCategory').value = categoryMap[recipe.category_name];
    document.getElementById('editDishComplexity').value = complexityMap[recipe.complexity_name];
    document.getElementById('editDishPrepTime').value = recipe.dish_prep_time;
    document.getElementById('editDishRating').value = Math.floor(recipe.dish_rating);

    editPopup.classList.add('active');
    overlay.classList.add('active');
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
            } else if (action === 'deleteUser') {
                await deleteUser(id);
            } else if (action === 'deleteRecipe') {
                await apiCalls.deleteRecipe(id);
                addRecipeRows(); // Refresh the recipe list
            } else if (action === 'deleteMessage') {
                await apiCalls.deleteMessage(id);
            } else if (action === 'resetPassword') {
                await resetPassword(id);
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
    document.getElementById("toggleFormButton").innerText ==="+ Add Recipe" 
    ? document.getElementById("toggleFormButton").innerText ="Cancel"
    : document.getElementById("toggleFormButton").innerText ="+ Add Recipe"

    // ? (document.getElementById("toggleFormButton").innerText ="Cancel", resetAddRecipeForm())
    // : (document.getElementById("toggleFormButton").innerText ="+ Add Recipe", resetAddRecipeForm())
});

// Toggle Add User Form
document.getElementById("toggleUserFormButton").addEventListener("click", function () {
    const form = document.getElementById("addUserForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
});

// Function to add a message row to the table
function addMessageRow(message) {
    const messagesList = document.getElementById('messagesList');
    const row = document.createElement('tr');
    row.id = message.message_id;

    // Create a unique ID for the button and image
    const flagButtonId = `flag-button-${message.message_id}`;
    const flagIconId = `flag-icon-${message.message_id}`;

    row.innerHTML = `
        <td>
            <button class = "flag-button" id="${flagButtonId}">
                <img id="${flagIconId}" src="${message.flagged == 1 ? 'public/img/icons8-flag-pink.png' 
                : 'public/img/icons8-flag-grey.png'}" alt="Flag Icon">
            </button>
        </td>
        <td>${message.sender_name}</td>
        <td>${message.sender_email}</td>
        <td>${message.message_sent_date_time}</td>
        <td class="actions">
            <button class="expand-btn">Read</button>
            <button class="delete-btn">Delete</button>
        </td>
    `;

    // Append the new row to the messages list
    messagesList.appendChild(row);

    // Add hover functionality to the flag button
    const flagButton = document.getElementById(flagButtonId);
    const flagIcon = document.getElementById(flagIconId);
    
    const originalSrc = flagIcon.src;
    const hoverSrc = 'public/img/icons8-flag-purple.png';

    flagButton.addEventListener('mouseenter', () => {
        flagIcon.src = hoverSrc;
    });

    flagButton.addEventListener('mouseleave', () => {
        flagIcon.src = originalSrc;
    });

    // Create and append the expanded row
    const expandedRow = document.createElement('tr');
    expandedRow.classList.add('recipe-expanded-row'); // to change the name
    expandedRow.style.display = 'none';

    expandedRow.innerHTML = `
        <td colspan="7">
           <div class="expanded-content">
                <h3>From: ${message.sender_name}</h3>
                <h3>Email: ${message.sender_email}</h3>
                <p>${message.message_text}</p>
            </div>
        </td>
    `;

    messagesList.appendChild(expandedRow);

    // Set event handlers for the buttons
    row.querySelector('.expand-btn').addEventListener('click', toggleExpand);

    row.querySelector('.delete-btn').addEventListener('click', () => {
        confirmAction('Delete message?', 'deleteMessage', message.message_id, () => {
            listMessages();  // Refresh the message list after deleting the message
        });
    });

    row.querySelector('.flag-button'). addEventListener('click', () => {
        functions.swapFlagImage(flagIcon);
        apiCalls.flagUnflagMessage(message.message_id);
        // listMessages();
    });
}








// Function to add a user row to the table
function addUserRow(user) {
    const usersList = document.getElementById('usersList');
    const row = document.createElement('tr');

    row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td class="actions">
                    <button onclick="editUser(${JSON.stringify(user)})">Edit</button>
                    <button onclick="confirmAction('Reset password?', 'resetPassword', ${user.id})">Reset Password</button>
                    <button onclick="confirmAction('Disable user?', 'disableUser', ${user.id})">Disable</button>
                    <button onclick="confirmAction('Unlock user?', 'unlockUser', ${user.id})">Unlock</button>
                    <button onclick="confirmAction('Delete user?', 'deleteUser', ${user.id})">Delete</button>
                </td>
            `;

    usersList.appendChild(row);
}

// Function to edit user
function editUser(user) {
    const editUserPopup = document.getElementById('editUserPopup');
    const overlay = document.getElementById('overlay');
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserName').value = user.name;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserPassword').value = ''; // Do not prefill password
    document.getElementById('editUserRole').value = user.role;

    editUserPopup.classList.add('active');
    overlay.classList.add('active');
}

// Save changes button event listener for users
document.getElementById('saveUserChangesButton').addEventListener('click', updateUser);

// Function to update user
async function updateUser() {
    const userId = document.getElementById('editUserId').value;
    const userName = document.getElementById('editUserName').value;
    const userEmail = document.getElementById('editUserEmail').value;
    const userPassword = document.getElementById('editUserPassword').value;
    const userRole = document.getElementById('editUserRole').value;

    const jsonData = {
        function: 'editUser',
        userId: userId,
        userName: userName,
        userEmail: userEmail,
        userPassword: userPassword,
        userRole: userRole
    };

    try {
        await apiCalls.editUser(jsonData);
        document.getElementById('editUserPopup').classList.remove('active');
        document.getElementById('overlay').classList.remove('active');
        addUserRows(); // Refresh the user list
    } catch (error) {
        console.error('Error updating user:', error);
    }
}

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
async function searchRecipesAdmin(){
    const search = document.getElementById("recipeSearchBox").value;
    let searchResults = await apiCalls.searchRecipes(search);
    const recipesList = document.getElementById('adminRecipesList');
    recipesList.innerHTML = ''; // Clear existing rows before adding new ones
    searchResults.forEach(result => addRecipeRow(result));
    // addRecipeRows(searchResults);
}


document.getElementById('adminRecipesSearch')?.addEventListener('click', () => {
    searchRecipesAdmin();
    alert ("seaching for recidpes")
});



// Filter recipes function + event listener
async function filterRecipes(){
    const recipeCategory = document.getElementById('recipeOriginFilter').value;
    const recipeComplexity = document.getElementById('recipeComplexityFilter').value;
    const recipeRating = document.getElementById('recipeRatingFilter').value;
    const recipePrepTime = document.getElementById('recipePrepTimeFilter').value;

    let filterCriteria = {"origin_country":recipeCategory, "complexity_name": recipeComplexity, "dish_prep_time": recipePrepTime, "dish_rating": recipeRating};

    addRecipeRows(filterCriteria)
}
document.getElementById('adminRecipesFilter')?.addEventListener('click', () => {
    filterRecipes();
    alert ("filtering recipes")
});

//Removing filters
document.getElementById('adminRecipesClearFilters')?.addEventListener('click', function() {
    const filterSelects = document.querySelectorAll('.filter-group select');
    filterSelects.forEach(function(select) {
        select.value = '';
    });
    addRecipeRows();
    alert ("removing filters")
});







//search messages function + event listener
async function searchMessages (){
    try {
        const search = document.getElementById("messageSearchBox").value;
        const messagesList = document.getElementById("messagesList");
        if (search && messagesList) {
            messagesList.innerHTML = "";
            let searchResults = await apiCalls.searchMessages(search);
            searchResults.forEach(result => addMessageRow(result));
        } else {
            console.error("No messages found found.");
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
} 

document.getElementById('adminMessagesSearch')?.addEventListener('click', () => {
    searchMessages();
    alert ("searching for messages")
});



//Filter messages function + event listener
async function filterMessages (){
    try {
        const messageStatus = document.getElementById('messageReadFilter').value;
        let filterResults = await apiCalls.filterMessages(messageStatus);
        filterResults.forEach(result => addMessageRow(result));
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
} 
document.getElementById('adminMessagesFilter')?.addEventListener('click', () => {
    filterMessages();
    alert ("filtering messages")
});
