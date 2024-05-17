import * as logic from './logic.js';
import { sendMessage } from './logic.js';
logic.getRecipes();
document.getElementById('year').textContent = new Date().getFullYear();


        // Tabs functionality for Admin Page
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

// Overlay for pop up dialog boxes
const overlay = document.getElementById('overlay');
const contactForm = document.getElementById('contactFormDiv');
                    const getInTouchBtn = document.getElementById('getInTouchBtn');
                    const closeContactForm = document.getElementById('closeButton');

                    function toggleContactForm(show) {
                        if (show) {
                            overlay.classList.add('active');
                            contactForm.classList.add('active');
                        } else {
                            overlay.classList.remove('active');
                            contactForm.classList.remove('active');
                        }
}

//Get in touch form
getInTouchBtn.addEventListener('click', () => {toggleContactForm(true);});
closeContactForm.addEventListener('click', () => {toggleContactForm(false);});

const sendMsgBtn = document.getElementById("sentMsgBtn");
sendMsgBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const jsonData = {
        name: name,
        email: email,
        message: message
    };

    logic.sendMessage(jsonData);

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
    toggleContactForm(false);
});

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





        //Function to add a recipe row to the table
        function addRecipeRow(recipe) {
            const recipesList = document.getElementById('recipesList');
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${recipe.name}</td>
                <td>${recipe.description}</td>
                <td>${recipe.category}</td>
                <td>${recipe.ingredients.join(', ')}</td>
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



        // Function to add a message row to the table
        function addMessageRow(message) {
            const messagesList = document.getElementById('messagesList');
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${message.flagged ? '<div class="flagged-indicator"></div>' : ''}</td>
                <td>${message.name}</td>
                <td>${message.email}</td>
                <td>${message.content}</td>
                <td>${message.date}</td>
                <td>${message.read ? 'Read' : 'Unread'}</td>
                <td>${message.flagged ? 'Flagged' : 'Not Flagged'}</td>
                <td class="actions">
                    <button onclick="viewMessage(${JSON.stringify(message)})">View</button>
                    <button onclick="toggleFlagMessage(${message.id})">${message.flagged ? 'Unflag' : 'Flag'}</button>
                    <button onclick="confirmAction('Delete message?', 'deleteMessage', ${message.id})">Delete</button>
                </td>
            `;

            messagesList.appendChild(row);
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












