import * as apiCalls from './apiCalls.js';
import * as functions from './functions.js';
import * as commonController from './commonController.js';


document.addEventListener('DOMContentLoaded', async () => {
    // Check if the current URL includes "adminPage.html"
    if (window.location.pathname.includes('adminPage.html')) {
       addRecipeRows();
    }
    commonController.tabsController()
});



async function addRecipeRows() {
    const recipes = await apiCalls.getRecipes();
    recipes.forEach(recipe => addRecipeRow(recipe));

}

//Function to add a recipe row to the table
export function addRecipeRow(recipe) {
    const recipesList = document.getElementById('adminRecipesList');


    const row = document.createElement('tr');

    row.innerHTML = `
                <td>${recipe.dish_name}</td>
                <td>${recipe.description}</td><!--iadd elipse for description and ingredients so that it has a fixed size-->
                <td>${recipe.category_name}</td>
                <td>${recipe.name}</td><!--ingredients here-->
                <td>${functions.toTitleCase(recipe.complexity_name)}</td>
                <td>${functions.formatPrepTime(recipe.dish_prep_time)}</td>
                <td>${recipe.dish_rating}</td>
                <td><img src="${recipe.dish_img}" alt="Dish Image"></td>
                <td class="actions" id="actionsTh">
                    <button onclick="previewRecipe(${JSON.stringify(recipe)})">Preview</button>
                    <button onclick="editRecipe(${JSON.stringify(recipe)})">Edit</button>
                    <button onclick="confirmAction('Delete recipe?', 'deleteRecipe', ${recipe.id})">Delete</button>
                </td>
            `;

    recipesList.appendChild(row);
}



















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
});



// Toggle Add User Form
document.getElementById("toggleUserFormButton").addEventListener("click", function () {
    const form = document.getElementById("addUserForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
});




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
                await deleteRecipe(id);
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







// const sampleUsers = [
//     {
//         id: 1,
//         name: 'Admin User',
//         email: 'admin@example.com',
//         role: 'admin'
//     },
//     {
//         id: 2,
//         name: 'Regular User',
//         email: 'user@example.com',
//         role: 'user'
//     }
// ];


// Function to add a message row to the table
function addMessageRow(message) {
    const messagesList = document.getElementById('messagesList');
    const row = document.createElement('tr');
    row.id = message.message_id;

    row.innerHTML = `
                <td>${message.flagged ? 'Flagged' : 'Not Flagged'}</td>
                <td>${message.sender_name}</td>
                <td>${message.sender_email}</td>
                <td>${message.message_text}</td>
                <td>${message.messsage_sent_date_time}</td>
                <td>${message.read ? 'Read' : 'Unread'}</td>
                <td class="actions">
                <button class="view-btn">View</button>
                <button class="flag-btn">${message.flagged ? 'Unflag' : 'Flag'}</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

    messagesList.appendChild(row);

    // Set event handlers for the buttons
    row.querySelector('.view-btn').addEventListener('click', () => viewMessage(message));
    row.querySelector('.flag-btn').addEventListener('click', () => toggleFlagMessage(message.id));
    // row.querySelector('.delete-btn').addEventListener('click', () => confirmAction('Delete message?', 'deleteMessage', message.message_id));

    row.querySelector('.delete-btn').addEventListener('click', () => {
        confirmAction('Delete message?', 'deleteMessage', message.message_id, () => {
            listMessages();  // Refresh the message list after deleting the message
        });
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





// Function to preview recipe
function previewRecipe(recipe) {
    console.log("preview recipe function called");

    const previewPopup = document.getElementById('previewRecipePopup');
    const overlay = document.getElementById('overlay');
    const previewContent = document.getElementById('previewRecipeContent');

    previewContent.innerHTML = `
        <h3>${recipe.name}</h3>
        <p><strong>Description:</strong> ${recipe.description}</p>
        <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
        <p><strong>Complexity:</strong> ${recipe.complexity}</p>
        <p><strong>Prep Time:</strong> ${recipe.prepTime}</p>
        <p><strong>Rating:</strong> ${recipe.rating}</p>
        <img src="${recipe.image}" alt="Dish Image" style="width: 100%;">
    `;

    previewPopup.classList.add('active');
    overlay.classList.add('active');
}

// Function to edit recipe
function editRecipe(recipe) {
    const editPopup = document.getElementById('editRecipePopup');
    const overlay = document.getElementById('overlay');
    document.getElementById('editDishName').value = recipe.name;
    document.getElementById('editDishDescription').value = recipe.description;
    document.getElementById('editDishIngredients').value = recipe.ingredients.join(', ');
    document.getElementById('editDishComplexity').value = recipe.complexity;
    document.getElementById('editDishPrepTime').value = recipe.prepTime;
    document.getElementById('editDishRating').value = recipe.rating;

    editPopup.classList.add('active');
    overlay.classList.add('active');
}


// Function to edit user
function editUser(user) {
    const editUserPopup = document.getElementById('editUserPopup');
    const overlay = document.getElementById('overlay');
    document.getElementById('editUserName').value = user.name;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserPassword').value = ''; // Do not prefill password
    document.getElementById('editUserRole').value = user.role;

    editUserPopup.classList.add('active');
    overlay.classList.add('active');
}

// Sample data for testing
const sampleRecipes = [
    {
        id: 1,
        name: 'Butter Chicken',
        description: 'A creamy and delicious butter chicken.',
        category: 'Indian',
        ingredients: ['chicken', 'butter', 'cream', 'tomato puree'],
        complexity: 'Medium',
        prepTime: '60 mins',
        rating: 4,
        image: 'path/to/image.jpg'
    }
];

const sampleMessages = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        content: 'Hello, I have a question...',
        date: '2023-05-15',
        read: false,
        flagged: false
    }
];

const sampleUsers = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
    },
    {
        id: 2,
        name: 'Regular User',
        email: 'user@example.com',
        role: 'user'
    }
];

// Adding sample data to tables for testing
sampleRecipes.forEach(addRecipeRow);

sampleUsers.forEach(addUserRow);



// Search and filter functionality for recipes
// const recipeSearchBox = document.getElementById('recipeSearchBox');
// const recipeCategoryFilter = document.getElementById('recipeCategoryFilter');
// const recipeComplexityFilter = document.getElementById('recipeComplexityFilter');
// const recipeRatingFilter = document.getElementById('recipeRatingFilter');
// const recipePrepTimeFilter = document.getElementById('recipePrepTimeFilter');

// recipeSearchBox.addEventListener('input', filterRecipes);
// recipeCategoryFilter.addEventListener('change', filterRecipes);
// recipeComplexityFilter.addEventListener('change', filterRecipes);
// recipeRatingFilter.addEventListener('change', filterRecipes);
// recipePrepTimeFilter.addEventListener('change', filterRecipes);

// function filterRecipes() {
//     const searchText = recipeSearchBox.value.toLowerCase();
//     const filterCategory = recipeCategoryFilter.value;
//     const filterComplexity = recipeComplexityFilter.value;
//     const filterRating = recipeRatingFilter.value;
//     const filterPrepTime = recipePrepTimeFilter.value;

//     const filteredRecipes = sampleRecipes.filter((recipe) => {
//         const matchesSearchText = recipe.name.toLowerCase().includes(searchText);
//         const matchesCategory = filterCategory === '' || recipe.category === filterCategory;
//         const matchesComplexity = filterComplexity === '' || recipe.complexity === filterComplexity;
//         const matchesRating = filterRating === '' || recipe.rating == filterRating;
//         const matchesPrepTime = filterPrepTime === '' || recipe.prepTime <= filterPrepTime;

//         return matchesSearchText && matchesCategory && matchesComplexity && matchesRating && matchesPrepTime;
//     });

//     document.getElementById('recipesList').innerHTML = '';
//     filteredRecipes.forEach(addRecipeRow);
// }

// Search functionality for messages
// const messageSearchBox = document.getElementById('messageSearchBox');
// const messageReadFilter = document.getElementById('messageReadFilter');

// messageSearchBox.addEventListener('input', filterMessages);
// messageReadFilter.addEventListener('change', filterMessages);

// function filterMessages() {
//     const searchText = messageSearchBox.value.toLowerCase();
//     const filterRead = messageReadFilter.value;

//     const filteredMessages = sampleMessages.filter((message) => {
//         const matchesSearchText = message.name.toLowerCase().includes(searchText) ||
//             message.email.toLowerCase().includes(searchText) ||
//             message.content.toLowerCase().includes(searchText);
//         const matchesRead = filterRead === '' || (filterRead === 'read' && message.read) || (filterRead === 'unread' && !message.read);

//         return matchesSearchText && matchesRead;
//     });

//     document.getElementById('messagesList').innerHTML = '';
//     filteredMessages.forEach(addMessageRow);
// }

// // Search and filter functionality for users
// const userSearchBox = document.getElementById('userSearchBox');
// const userRoleFilter = document.getElementById('userRoleFilter');

// userSearchBox.addEventListener('input', filterUsers);
// userRoleFilter.addEventListener('change', filterUsers);

// function filterUsers() {
//     const searchText = userSearchBox.value.toLowerCase();
//     const filterRole = userRoleFilter.value;

//     const filteredUsers = sampleUsers.filter((user) => {
//         const matchesSearchText = user.name.toLowerCase().includes(searchText) ||
//             user.email.toLowerCase().includes(searchText);
//         const matchesRole = filterRole === '' || user.role === filterRole;

//         return matchesSearchText && matchesRole;
//     });

//     document.getElementById('usersList').innerHTML = '';
//     filteredUsers.forEach(addUserRow);
// }


// // const todelete= document.getElementById('todelete');
// // todelete.addEventListener('click', ()=>{
// //     insertImage();
// // })


// document.addEventListener('DOMContentLoaded', () => {
//     const uploadButton = document.getElementById('uploadButton');
//     const fileInput = document.getElementById('imageInput');

//     if (uploadButton && fileInput) {
//         uploadButton.addEventListener('click', () => {
//             if (fileInput.files.length > 0) {
//                 const file = fileInput.files[0];
//                 insertImage(file);
//             } else {
//                 alert('Please select a file.');
//             }
//         });
//     } else {
//         console.error('Upload button or file input not found.');
//     }
// });


// //this hould go into logic folder
// async function insertImage(file) {
//     try {
//         const reader = new FileReader();

//         reader.onloadend = async function () {
//             const base64Image = reader.result.split(',')[1];

//             // Prepare the data to be sent as JSON
//             const data = {
//                 "function": "insertImage",
//                 "image": base64Image
//             };

//             // Send the data to the server
//             const response = await fetch("http://localhost/data/index.php", {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(data)
//             });

//             // Check if the response is OK
//             if (!response.ok) {
//                 console.error('Error response from server:', response.status, response.statusText);
//                 return;
//             }

//             const textResponse = await response.text();
//             console.log('Raw server response:', textResponse);

//             // Try parsing the response as JSON
//             let jsonResponse;
//             try {
//                 jsonResponse = JSON.parse(textResponse);
//             } catch (e) {
//                 console.error('Error parsing JSON response:', e);
//                 console.error('Received response:', textResponse); // Log the received response
//                 return;
//             }

//             console.log('Parsed JSON response:', jsonResponse);

//             if (jsonResponse.status === "success") {
//                 console.log('Image uploaded successfully:', jsonResponse);
//             } else {
//                 console.error('Error uploading image:', jsonResponse);
//             }
//         };

//         reader.onerror = function (error) {
//             console.error('Error reading file:', error);
//         };

//         reader.readAsDataURL(file);
//     } catch (error) {
//         console.log("Error uploading image:", error);
//     }
// }