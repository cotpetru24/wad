// import * as apiCalls from './apiCalls.js';
// import * as functions from './functions.js';
// import * as commonController from './commonController.js';


// document.addEventListener('DOMContentLoaded', async () => {
//     // Check if the current URL includes "adminPage.html"
//     if (window.location.pathname.includes('adminPage.html')) {
//        addRecipeRows();
//     }
//     commonController.tabsController()
// });



// async function addRecipeRows() {
//     const recipes = await apiCalls.getRecipes();
//     recipes.forEach(recipe => addRecipeRow(recipe));

// }

// // //Function to add a recipe row to the table
// // export function addRecipeRow(recipe) {
// //     const recipesList = document.getElementById('adminRecipesList');


// //     const row = document.createElement('tr');

// //     row.innerHTML = `
// //                 <td>${recipe.dish_name}</td>
// //                 <td class="fixed-cell">${recipe.dish_recipe_description}</td><!--add elipse for description and ingredients so that it has a fixed size-->
// //                 <td>${recipe.category_name}</td>
// //                 <td class="fixed-cell">${JSON.parse(recipe.dish_ingredients)}</td><!--ingredients here-->
// //                 <td>${functions.toTitleCase(recipe.complexity_name)}</td>
// //                 <td>${functions.formatPrepTime(recipe.dish_prep_time)}</td>
// //                 <td>${recipe.dish_rating}</td>
// //                 <td><img src="${recipe.dish_img ? recipe.dish_img : 'public/img/image_coming_soon_with_camera_text.jpg'}" alt="Dish Image"></td>
// //                 <td class="actions" id="actionsTh">
// //                     <button onclick="previewRecipe(${JSON.stringify(recipe)})">Preview</button>
// //                     <button onclick="editRecipe(${JSON.stringify(recipe)})">Edit</button>
// //                     <button onclick="confirmAction('Delete recipe?', 'deleteRecipe', ${recipe.id})">Delete</button>
// //                 </td>
// //             `;

// //     recipesList.appendChild(row);
// // }


// export function toggleExpand(event) {
//     const button = event.target; // Get the target button from the event
//     const row = button.closest('tr'); // Ensure button is a DOM element and get the closest tr
//     const expandedRow = row.nextElementSibling;
//     if (expandedRow && expandedRow.style.display === 'none') {
//         expandedRow.style.display = 'table-row';
//         button.textContent = 'Collapse';
//     } else if (expandedRow) {
//         expandedRow.style.display = 'none';
//         button.textContent = 'Expand';
//     }
// }




// export function addRecipeRow(recipe) {
//     const recipesList = document.getElementById('adminRecipesList');
//     const row = document.createElement('tr');
//     row.classList.add('recipe-row');

//     row.innerHTML = `
//         <td>${recipe.dish_name}</td>
//         <td class="fixed-cell">${recipe.dish_recipe_description}</td>
//         <td>${recipe.category_name}</td>
//         <td class="fixed-cell">${JSON.parse(recipe.dish_ingredients).join(', ')}</td>
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

//     const expandedRow = document.createElement('tr');
//     expandedRow.classList.add('recipe-expanded-row');
//     expandedRow.style.display = 'none';

//     expandedRow.innerHTML = `
//         <td colspan="9">
//             <div class="expanded-content">
//                 <h3>Description</h3>
//                 <p>${recipe.dish_recipe_description}</p>
//                 <h3>Ingredients</h3>
//                 <p>${JSON.parse(recipe.dish_ingredients).join(', ')}</p>
//                 <h3>Steps</h3>
//                 <p>${recipe.dish_steps}</p>
//             </div>
//         </td>
//     `;

//     recipesList.appendChild(row);
//     recipesList.appendChild(expandedRow);

//     // Attach event listeners
//     row.querySelector('.expand-btn').addEventListener('click', toggleExpand);
//     row.querySelector('.edit-btn').addEventListener('click', () => editRecipe(recipe));
//     row.querySelector('.delete-btn').addEventListener('click', () => confirmAction('Delete recipe?', 'deleteRecipe', recipe.dish_id));
// }


















// // Listing messages in the messages tab/admin page
// const messagesTab = document.getElementById("messagesTab");
// if (messagesTab) {
//     messagesTab.addEventListener('click', async () => {
//         await listMessages();
//     });
// }






// async function listMessages() {
//     try {
//         const messagesList = document.getElementById("messagesList");
//         if (messagesList) {
//             messagesList.innerHTML = "";
//             const messages = await apiCalls.getMessages();
//             messages.forEach(message => addMessageRow(message));
//         } else {
//             console.error("Element with ID 'messagesList' not found.");
//         }
//     } catch (error) {
//         console.error("Error fetching messages:", error);
//     }
// }



// // Toggle Add Recipe Form
// document.getElementById("toggleFormButton").addEventListener("click", function () {
//     const form = document.getElementById("addRecipeForm");
//     form.style.display = form.style.display === "none" ? "block" : "none";
// });



// // Toggle Add User Form
// document.getElementById("toggleUserFormButton").addEventListener("click", function () {
//     const form = document.getElementById("addUserForm");
//     form.style.display = form.style.display === "none" ? "block" : "none";
// });




// // Function to show confirmation popup
// function confirmAction(message, action, id, callback) {
//     const confirmPopup = document.getElementById('confirmActionPopup');
//     const overlay = document.getElementById('overlay');
//     const confirmMessage = document.getElementById('confirmActionMessage');
//     const yesButton = document.getElementById('confirmActionYesButton');

//     confirmMessage.textContent = message;
//     yesButton.onclick = async function () {
//         try {
//             if (action === 'disableUser') {
//                 await disableUser(id);
//             } else if (action === 'unlockUser') {
//                 await unlockUser(id);
//             } else if (action === 'deleteUser') {
//                 await deleteUser(id);
//             } else if (action === 'deleteRecipe') {
//                 await apiCalls.deleteRecipe(id);
//             } else if (action === 'deleteMessage') {
//                 await apiCalls.deleteMessage(id);
//             } else if (action === 'resetPassword') {
//                 await resetPassword(id);
//             }
//             confirmPopup.classList.remove('active');
//             overlay.classList.remove('active');
//             // Call the callback function after the action
//             if (typeof callback === 'function') {
//                 callback();
//             }
//         } catch (error) {
//             console.error(`Error performing action ${action}:`, error);
//         }
//     };

//     confirmPopup.classList.add('active');
//     overlay.classList.add('active');
// }




// // Function to close popups
// document.getElementById('closePreviewPopup')?.addEventListener('click', () => {
//     document.getElementById('previewRecipePopup')?.classList.remove('active');
//     document.getElementById('overlay')?.classList.remove('active');
// });

// document.getElementById('closeEditPopup')?.addEventListener('click', () => {
//     document.getElementById('editRecipePopup')?.classList.remove('active');
//     document.getElementById('overlay')?.classList.remove('active');
// });

// document.getElementById('closeViewMessagePopup')?.addEventListener('click', () => {
//     document.getElementById('viewMessagePopup')?.classList.remove('active');
//     document.getElementById('overlay')?.classList.remove('active');
// });

// document.getElementById('closeEditUserPopup')?.addEventListener('click', () => {
//     document.getElementById('editUserPopup')?.classList.remove('active');
//     document.getElementById('overlay')?.classList.remove('active');
// });

// document.getElementById('closeConfirmActionPopup')?.addEventListener('click', () => {
//     document.getElementById('confirmActionPopup')?.classList.remove('active');
//     document.getElementById('overlay')?.classList.remove('active');
// });

// document.getElementById('confirmActionNoButton')?.addEventListener('click', () => {
//     document.getElementById('confirmActionPopup')?.classList.remove('active');
//     document.getElementById('overlay')?.classList.remove('active');
// });






document.getElementById('addNewRecipe')?.addEventListener('click', () => {
    addNewRecipe();
    alert ("add reipe button clicked")
});



// async function addNewRecipe() {
//     const dishName = document.getElementById("dishName").value;
//     const dishOrigin = document.getElementById("dishOrigin").value;
//     const dishDescription = document.getElementById("dishDescription").value;
//     const dishIngredients = document.getElementById("dishIngredients").value;
//     const dishSteps = document.getElementById("dishSteps").value;
//     const dishCategory = document.getElementById("dishCategory").value;
//     const dishComplexity = document.getElementById("dishComplexity").value;
//     const dishPrepTime = document.getElementById("dishPrepTime").value;
//     const dishRating = document.getElementById("dishRating").value;
//     const dishChefRecommended = document.getElementById("dishChefRecommended").value;
//     const dishImage = document.getElementById("dishImage").files[0]; // Use files[0] to get the selected file

//     const reader = new FileReader();

//     reader.onloadend = function () {
//         const base64Image = reader.result.split(',')[1];

//         const jsonData = {
//             function: 'addNewRecipe', // Use the existing function name
//             dishName: dishName,
//             dishOrigin: dishOrigin,
//             dishDescription: dishDescription,
//             dishIngredients: functions.convertToJSONArray(dishIngredients),
//             dishSteps: dishSteps,
//             dishCategory: dishCategory,
//             dishComplexity: dishComplexity,
//             dishPrepTime: dishPrepTime,
//             dishRating: dishRating,
//             dishChefRecommended: dishChefRecommended,
//             dishImage: base64Image // Include the image data
//         };

//         await apiCalls.addNewRecipe(jsonData);
//         addRecipeRows(); // Refresh the recipe list


//     };

//     reader.onerror = function (error) {
//         console.error('Error reading file:', error);
//     };

//     if (dishImage) {
//         reader.readAsDataURL(dishImage); // Read the image file as a data URL
//     } else {
//         // If no image is selected, send the data without the image
//         const jsonData = {
//             function: 'addNewRecipe', // Use the existing function name
//             dishName: dishName,
//             dishOrigin: dishOrigin,
//             dishDescription: dishDescription,
//             dishIngredients: functions.convertToJSONArray(dishIngredients),
//             dishSteps: dishSteps,
//             dishCategory: dishCategory,
//             dishComplexity: dishComplexity,
//             dishPrepTime: dishPrepTime,
//             dishRating: dishRating,
//             dishChefRecommended: dishChefRecommended,
//             dishImage: null // No image data
//         };

//         apiCalls.addNewRecipe(jsonData);
//     }
// }





function resetAddRecipeForm() {
    document.getElementById("dishName").value = '';
    document.getElementById("dishOrigin").value = '';
    document.getElementById("dishDescription").value = '';
    document.getElementById("dishIngredients").value = '';
    document.getElementById("dishSteps").value = '';
    document.getElementById("dishCategory").value = '';
    document.getElementById("dishComplexity").value = '';
    document.getElementById("dishPrepTime").value = '';
    document.getElementById("dishRating").value = '';
    document.getElementById("dishChefRecommended").value = '';
    document.getElementById("dishImage").value = '';

    document.getElementById("addRecipeForm").style.display = 'none';
}
//if the below works delete the one above addnewrecipe function
async function addNewRecipe() {
    const dishName = document.getElementById("dishName").value;
    const dishOrigin = document.getElementById("dishOrigin").value;
    const dishDescription = document.getElementById("dishDescription").value;
    const dishIngredients = document.getElementById("dishIngredients").value;
    const dishSteps = document.getElementById("dishSteps").value;
    const dishCategory = document.getElementById("dishCategory").value;
    const dishComplexity = document.getElementById("dishComplexity").value;
    const dishPrepTime = document.getElementById("dishPrepTime").value;
    const dishRating = document.getElementById("dishRating").value;
    const dishChefRecommended = document.getElementById("dishChefRecommended").value;
    const dishImage = document.getElementById("dishImage").files[0]; // Use files[0] to get the selected file

    const jsonData = {
        function: 'addNewRecipe', // Use the existing function name
        dishName: dishName,
        dishOrigin: dishOrigin,
        dishDescription: dishDescription,
        dishIngredients: functions.convertToJSONArray(dishIngredients),
        dishSteps: dishSteps,
        dishCategory: dishCategory,
        dishComplexity: dishComplexity,
        dishPrepTime: dishPrepTime,
        dishRating: dishRating,
        dishChefRecommended: dishChefRecommended,
        dishImage: null // Placeholder, will be updated if there is an image
    };

    if (dishImage) {
        const base64Image = await convertImageToBase64(dishImage);
        jsonData.dishImage = base64Image; // Include the image data
    }

    await apiCalls.addNewRecipe(jsonData);
    addRecipeRows(); // Refresh the recipe list


    // Clear and hide the form after adding the recipe
    resetAddRecipeForm();
}

function convertImageToBase64(imageFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(imageFile);
    });
}




















// // const sampleUsers = [
// //     {
// //         id: 1,
// //         name: 'Admin User',
// //         email: 'admin@example.com',
// //         role: 'admin'
// //     },
// //     {
// //         id: 2,
// //         name: 'Regular User',
// //         email: 'user@example.com',
// //         role: 'user'
// //     }
// // ];


// // Function to add a message row to the table
// function addMessageRow(message) {
//     const messagesList = document.getElementById('messagesList');
//     const row = document.createElement('tr');
//     row.id = message.message_id;

//     row.innerHTML = `
//                 <td>${message.flagged ? 'Flagged' : 'Not Flagged'}</td>
//                 <td>${message.sender_name}</td>
//                 <td>${message.sender_email}</td>
//                 <td>${message.message_text}</td>
//                 <td>${message.messsage_sent_date_time}</td>
//                 <td>${message.read ? 'Read' : 'Unread'}</td>
//                 <td class="actions">
//                 <button class="view-btn">View</button>
//                 <button class="flag-btn">${message.flagged ? 'Unflag' : 'Flag'}</button>
//                 <button class="delete-btn">Delete</button>
//             </td>
//         `;

//     messagesList.appendChild(row);

//     // Set event handlers for the buttons
//     row.querySelector('.view-btn').addEventListener('click', () => viewMessage(message));
//     row.querySelector('.flag-btn').addEventListener('click', () => toggleFlagMessage(message.id));
//     // row.querySelector('.delete-btn').addEventListener('click', () => confirmAction('Delete message?', 'deleteMessage', message.message_id));

//     row.querySelector('.delete-btn').addEventListener('click', () => {
//         confirmAction('Delete message?', 'deleteMessage', message.message_id, () => {
//             listMessages();  // Refresh the message list after deleting the message
//         });
//     });

// }


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





// // Function to preview recipe
// function previewRecipe(recipe) {
//     console.log("preview recipe function called");

//     const previewPopup = document.getElementById('previewRecipePopup');
//     const overlay = document.getElementById('overlay');
//     const previewContent = document.getElementById('previewRecipeContent');

//     previewContent.innerHTML = `
//         <h3>${recipe.name}</h3>
//         <p><strong>Description:</strong> ${recipe.description}</p>
//         <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
//         <p><strong>Complexity:</strong> ${recipe.complexity}</p>
//         <p><strong>Prep Time:</strong> ${recipe.prepTime}</p>
//         <p><strong>Rating:</strong> ${recipe.rating}</p>
//         <img src="${recipe.image}" alt="Dish Image" style="width: 100%;">
//     `;

//     previewPopup.classList.add('active');
//     overlay.classList.add('active');
// }

// // Function to edit recipe
// function editRecipe(recipe) {
//     const editPopup = document.getElementById('editRecipePopup');
//     const overlay = document.getElementById('overlay');
//     document.getElementById('editDishName').value = recipe.name;
//     document.getElementById('editDishDescription').value = recipe.description;
//     // document.getElementById('editDishIngredients').value = recipe.ingredients.join(', ');
//     document.getElementById('editDishComplexity').value = recipe.complexity;
//     document.getElementById('editDishPrepTime').value = recipe.prepTime;
//     document.getElementById('editDishRating').value = recipe.rating;

//     editPopup.classList.add('active');
//     overlay.classList.add('active');
// }


// // Function to edit user
// function editUser(user) {
//     const editUserPopup = document.getElementById('editUserPopup');
//     const overlay = document.getElementById('overlay');
//     document.getElementById('editUserName').value = user.name;
//     document.getElementById('editUserEmail').value = user.email;
//     document.getElementById('editUserPassword').value = ''; // Do not prefill password
//     document.getElementById('editUserRole').value = user.role;

//     editUserPopup.classList.add('active');
//     overlay.classList.add('active');
// }

// // Sample data for testing
// // const sampleRecipes = [
// //     {
// //         id: 1,
// //         name: 'Butter Chicken',
// //         description: 'A creamy and delicious butter chicken.',
// //         category: 'Indian',
// //         ingredients: ['chicken', 'butter', 'cream', 'tomato puree'],
// //         complexity: 'Medium',
// //         prepTime: '60 mins',
// //         rating: 4,
// //         image: 'path/to/image.jpg'
// //     }
// // ];

// const sampleMessages = [
//     {
//         id: 1,
//         name: 'John Doe',
//         email: 'john.doe@example.com',
//         content: 'Hello, I have a question...',
//         date: '2023-05-15',
//         read: false,
//         flagged: false
//     }
// ];

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

// // Adding sample data to tables for testing
// // sampleRecipes.forEach(addRecipeRow);

// sampleUsers.forEach(addUserRow);

























// // Search and filter functionality for recipes
// // const recipeSearchBox = document.getElementById('recipeSearchBox');
// // const recipeCategoryFilter = document.getElementById('recipeCategoryFilter');
// // const recipeComplexityFilter = document.getElementById('recipeComplexityFilter');
// // const recipeRatingFilter = document.getElementById('recipeRatingFilter');
// // const recipePrepTimeFilter = document.getElementById('recipePrepTimeFilter');

// // recipeSearchBox.addEventListener('input', filterRecipes);
// // recipeCategoryFilter.addEventListener('change', filterRecipes);
// // recipeComplexityFilter.addEventListener('change', filterRecipes);
// // recipeRatingFilter.addEventListener('change', filterRecipes);
// // recipePrepTimeFilter.addEventListener('change', filterRecipes);

// // function filterRecipes() {
// //     const searchText = recipeSearchBox.value.toLowerCase();
// //     const filterCategory = recipeCategoryFilter.value;
// //     const filterComplexity = recipeComplexityFilter.value;
// //     const filterRating = recipeRatingFilter.value;
// //     const filterPrepTime = recipePrepTimeFilter.value;

// //     const filteredRecipes = sampleRecipes.filter((recipe) => {
// //         const matchesSearchText = recipe.name.toLowerCase().includes(searchText);
// //         const matchesCategory = filterCategory === '' || recipe.category === filterCategory;
// //         const matchesComplexity = filterComplexity === '' || recipe.complexity === filterComplexity;
// //         const matchesRating = filterRating === '' || recipe.rating == filterRating;
// //         const matchesPrepTime = filterPrepTime === '' || recipe.prepTime <= filterPrepTime;

// //         return matchesSearchText && matchesCategory && matchesComplexity && matchesRating && matchesPrepTime;
// //     });

// //     document.getElementById('recipesList').innerHTML = '';
// //     filteredRecipes.forEach(addRecipeRow);
// // }

// // Search functionality for messages
// // const messageSearchBox = document.getElementById('messageSearchBox');
// // const messageReadFilter = document.getElementById('messageReadFilter');

// // messageSearchBox.addEventListener('input', filterMessages);
// // messageReadFilter.addEventListener('change', filterMessages);

// // function filterMessages() {
// //     const searchText = messageSearchBox.value.toLowerCase();
// //     const filterRead = messageReadFilter.value;

// //     const filteredMessages = sampleMessages.filter((message) => {
// //         const matchesSearchText = message.name.toLowerCase().includes(searchText) ||
// //             message.email.toLowerCase().includes(searchText) ||
// //             message.content.toLowerCase().includes(searchText);
// //         const matchesRead = filterRead === '' || (filterRead === 'read' && message.read) || (filterRead === 'unread' && !message.read);

// //         return matchesSearchText && matchesRead;
// //     });

// //     document.getElementById('messagesList').innerHTML = '';
// //     filteredMessages.forEach(addMessageRow);
// // }

// // // Search and filter functionality for users
// // const userSearchBox = document.getElementById('userSearchBox');
// // const userRoleFilter = document.getElementById('userRoleFilter');

// // userSearchBox.addEventListener('input', filterUsers);
// // userRoleFilter.addEventListener('change', filterUsers);

// // function filterUsers() {
// //     const searchText = userSearchBox.value.toLowerCase();
// //     const filterRole = userRoleFilter.value;

// //     const filteredUsers = sampleUsers.filter((user) => {
// //         const matchesSearchText = user.name.toLowerCase().includes(searchText) ||
// //             user.email.toLowerCase().includes(searchText);
// //         const matchesRole = filterRole === '' || user.role === filterRole;

// //         return matchesSearchText && matchesRole;
// //     });

// //     document.getElementById('usersList').innerHTML = '';
// //     filteredUsers.forEach(addUserRow);
// // }


// // // const todelete= document.getElementById('todelete');
// // // todelete.addEventListener('click', ()=>{
// // //     insertImage();
// // // })












// /////////////////////////////// this is the code that inserts the image   \\\\\\\\\\\\\\\\\\\\\\\\\\\









// // document.addEventListener('DOMContentLoaded', () => {
// //     const uploadButton = document.getElementById('uploadButton');
// //     const fileInput = document.getElementById('imageInput');

// //     if (uploadButton && fileInput) {
// //         uploadButton.addEventListener('click', () => {
// //             if (fileInput.files.length > 0) {
// //                 const file = fileInput.files[0];
// //                 insertImage(file);
// //             } else {
// //                 alert('Please select a file.');
// //             }
// //         });
// //     } else {
// //         console.error('Upload button or file input not found.');
// //     }
// // });


// // //this hould go into logic folder
// // async function insertImage(file) {
// //     try {
// //         const reader = new FileReader();

// //         reader.onloadend = async function () {
// //             const base64Image = reader.result.split(',')[1];

// //             // Prepare the data to be sent as JSON
// //             const data = {
// //                 "function": "insertImage",
// //                 "image": base64Image
// //             };

// //             // Send the data to the server
// //             const response = await fetch("http://localhost/data/index.php", {
// //                 method: "POST",
// //                 headers: {
// //                     'Content-Type': 'application/json'
// //                 },
// //                 body: JSON.stringify(data)
// //             });

// //             // Check if the response is OK
// //             if (!response.ok) {
// //                 console.error('Error response from server:', response.status, response.statusText);
// //                 return;
// //             }

// //             const textResponse = await response.text();
// //             console.log('Raw server response:', textResponse);

// //             // Try parsing the response as JSON
// //             let jsonResponse;
// //             try {
// //                 jsonResponse = JSON.parse(textResponse);
// //             } catch (e) {
// //                 console.error('Error parsing JSON response:', e);
// //                 console.error('Received response:', textResponse); // Log the received response
// //                 return;
// //             }

// //             console.log('Parsed JSON response:', jsonResponse);

// //             if (jsonResponse.status === "success") {
// //                 console.log('Image uploaded successfully:', jsonResponse);
// //             } else {
// //                 console.error('Error uploading image:', jsonResponse);
// //             }
// //         };

// //         reader.onerror = function (error) {
// //             console.error('Error reading file:', error);
// //         };

// //         reader.readAsDataURL(file);
// //     } catch (error) {
// //         console.log("Error uploading image:", error);
// //     }
// // }








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
