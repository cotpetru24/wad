import * as apiCalls from './apiCalls.js';
import * as functions from './functions.js';
import * as commonController from './commonController.js'


// Logging session data for debugging and development purposes
// Ensure the variable is available globally
console.log(isLoggedIn);
console.log(userId);


// Setting current year to copyright paragraph 
document.getElementById('year').textContent = new Date().getFullYear();


// Function to list recipes on index.php
async function addRecipes(recipesList) {

    const list = document.getElementById("recipesList");
    // Clear the current list
    list.innerText = "";

    // Creating list item for each recipe
    recipesList.forEach((recipe) => {

        //////----------Recipe img div---------\\\\\\\
        let recipeImg = document.createElement("img");
        if (recipe.dish_img) {
            recipeImg.src = recipe.dish_img;
        }
        else {
            recipeImg.src = 'public/img/image_coming_soon_with_camera_text.jpg';
        }
        let recipeImgDiv = document.createElement("div");
        recipeImgDiv.appendChild(recipeImg);


        //////----------Recipe heading div---------\\\\\\\
        // Heading
        let recipeHeading = document.createElement("h2")
        recipeHeading.innerHTML = recipe.dish_name
        let recipeHeadingH2Div = document.createElement("div")
        recipeHeadingH2Div.appendChild(recipeHeading);
        let removeRecipeFavBtn = document.createElement("button");
        removeRecipeFavBtn.dataset.recipeId = recipe.dish_id;
        removeRecipeFavBtn.classList.add("hideRemoveRecipeFavBtn")
        removeRecipeFavBtn.classList.add("removeRecipeFavBtn")
        removeRecipeFavBtn.innerText = "Remove from Favourites";
        let recipeAddFavBtn = document.createElement("button")
        recipeAddFavBtn.dataset.recipeId = recipe.dish_id;
        recipeAddFavBtn.classList.add('showRecipeFavBtn')
        let recipeHeadingBtnDiv = document.createElement("div")
        recipeHeadingBtnDiv.classList.add('favDiv')
        recipeHeadingBtnDiv.appendChild(removeRecipeFavBtn);
        recipeHeadingBtnDiv.appendChild(recipeAddFavBtn);


        // Recipe Heading Div
        let recipeHeadingDiv = document.createElement("div");
        recipeHeadingDiv.appendChild(recipeHeadingH2Div);
        recipeHeadingDiv.appendChild(recipeHeadingBtnDiv);


        //////----------Recipe subheading div---------\\\\\\\
        let recipeRating = document.createElement("h3");
        recipeRating.innerHTML = functions.formatDishRating(recipe.dish_rating);
        let recipeNonvegetarianVegetarian = document.createElement("h3");
        recipeNonvegetarianVegetarian.innerHTML = functions.toTitleCase(recipe.category_name);

        // Recipe Subheading Div
        let recipeSubheadingDiv = document.createElement("div");
        recipeSubheadingDiv.appendChild(recipeRating);
        recipeSubheadingDiv.appendChild(recipeNonvegetarianVegetarian);


        //////----------Recipe head div---------\\\\\\\
        let recipeHeadDiv = document.createElement("div");
        recipeHeadDiv.appendChild(recipeHeadingDiv)
        recipeHeadDiv.appendChild(recipeSubheadingDiv)


        //////----------Recipe info div---------\\\\\\\
        // Prep time div
        let prepTimeHeading = document.createElement('h3');
        prepTimeHeading.innerHTML = "Prep Time";
        let prepTime = document.createElement("h4");
        prepTime.innerHTML = functions.formatPrepTime(recipe.dish_prep_time);
        let prepTimeDiv = document.createElement("div");
        prepTimeDiv.appendChild(prepTimeHeading);
        prepTimeDiv.appendChild(prepTime);


        // Dificulty div
        let dificultyHeading = document.createElement('h3');
        dificultyHeading.innerHTML = "Dificulty";
        let dificulty = document.createElement('h4');
        dificulty.innerHTML = functions.toTitleCase(recipe.complexity_name);
        let dificultyDiv = document.createElement('div');
        dificultyDiv.appendChild(dificultyHeading);
        dificultyDiv.appendChild(dificulty);


        // Recipe info div
        let recipeInfoDiv = document.createElement('div');
        recipeInfoDiv.appendChild(prepTimeDiv);
        recipeInfoDiv.appendChild(dificultyDiv);


        //////----------Recipe footer div---------\\\\\\\
        // Recipe actions div
        let expandBtn = document.createElement('button');
        expandBtn.textContent = "Expand";
        let recipeActionsDiv = document.createElement('div');
        recipeActionsDiv.appendChild(expandBtn);
        let recipeFooterDiv = document.createElement('div');
        recipeFooterDiv.appendChild(recipeInfoDiv);
        recipeFooterDiv.appendChild(recipeActionsDiv);


        //////----------Recipe description div---------\\\\\\\
        //Recipe description paragraph div    
        let recipeDescriptionParDiv = document.createElement("div")
        let recipeDescriptionPar = document.createElement("p")
        recipeDescriptionPar.innerHTML = recipe.dish_recipe_description;
        recipeDescriptionParDiv.appendChild(recipeDescriptionPar);


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

            recipeDescriptionParDiv.appendChild(recipeIngredientsHeader);
            recipeDescriptionParDiv.appendChild(ingredientsList);
        }


        // Steps
        // Listing each step name and step description as separate list items
        if (recipe.dish_steps) {
            let recipeStepsHeader = document.createElement("h3");
            recipeStepsHeader.innerHTML = "Instructions";
            let recipeSteps = document.createElement("ol");
            const dishSteps = JSON.parse(recipe.dish_steps);
            dishSteps.forEach(step => {
                let recipeStep = document.createElement("li");
                let stepTitle = document.createElement("strong");
                stepTitle.textContent = step.title + ":";
                let stepDescription = document.createElement("span");
                stepDescription.textContent = step.description;

                recipeStep.appendChild(stepTitle);
                recipeStep.appendChild(stepDescription);
                recipeSteps.appendChild(recipeStep);
            }
            )
            recipeDescriptionParDiv.appendChild(recipeStepsHeader);
            recipeDescriptionParDiv.appendChild(recipeSteps);
        }


        // Recipe description div
        let recipeDescriptionDiv = document.createElement('div');
        recipeDescriptionDiv.appendChild(recipeHeadDiv);
        recipeDescriptionDiv.appendChild(recipeDescriptionParDiv);
        recipeDescriptionDiv.appendChild(recipeFooterDiv);


        //////----------Recipe div---------\\\\\\\
        let recipeDiv = document.createElement('div');
        recipeDiv.id = "recipe_ID" + recipe.recipe_id;
        recipeDiv.appendChild(recipeImgDiv);
        recipeDiv.appendChild(recipeDescriptionDiv);


        // Adding classes to DOM elements
        recipeDiv.classList.add("recipe")
        recipeImgDiv.classList.add("dishImage")
        recipeDescriptionDiv.classList.add("recipeDescription")
        recipeHeadDiv.classList.add("recipeDetails")
        recipeFooterDiv.classList.add("recipeFooterDiv");
        recipeFooterDiv.classList.add("recipeHeadDiv")
        recipeHeadingDiv.classList.add("recipeHeadDiv");
        recipeSubheadingDiv.classList.add("recipeHeadDiv");
        recipeInfoDiv.classList.add("recipeHeadDiv");
        recipeInfoDiv.classList.add("recipeFooterInfoInnerDivs");
        dificultyDiv.classList.add("recipeFooterInfoDiv");
        prepTimeDiv.classList.add("recipeFooterInfoDiv");
        recipeDescriptionParDiv.classList.add("recipeParagraphDiv");

        if (recipeNonvegetarianVegetarian.innerHTML.trim().toLowerCase() === "vegetarian") {
            recipeNonvegetarianVegetarian.classList.add("vegetarian");
        } else {
            recipeNonvegetarianVegetarian.classList.add("non-vegetarian");
        }


        // Handling expand button event
        expandBtn.addEventListener("click", () => {
            recipeDescriptionParDiv.classList.toggle("expanded");
            expandBtn.textContent = recipeDescriptionParDiv.classList.contains("expanded") ? "Collapse" : "Expand";
        });


        // Assigning recipeId to favourites button 
        // so that later it can be used to add or remove recipe to/from user favourites list 
        recipeAddFavBtn.dataset.recipeId


        // Handling add to favourites list
        // Checking if user is authenticated befor adding a recipe to favourites list
        // And calling addFavourites()
        recipeAddFavBtn.addEventListener("click", (event) => {
            if (!userId) {
                window.location.href = 'auth.php';
                return;
            }
            const recipeId = parseInt(recipeAddFavBtn.dataset.recipeId, 10);
            if (!isNaN(recipeId)) {
                apiCalls.addFavourite(userId, recipeId);


                // Notification to prompt user that recipe has been added to
                // favourites list
                // Setting the position of the notification to the click coordinates
                const favNotification = document.getElementById('favNotification');
                favNotification.style.top = (event.clientY - 0) + 'px';
                favNotification.style.left = (event.clientX - 70) + 'px';
                favNotification.classList.add('show');
                // Notification timeout
                setTimeout(function () {
                    favNotification.classList.remove('show');
                }, 1500);
            }
            else {
                console.error('Invalid recipe ID');
            }
        });


        // Handling remove from favourites list
        // Calling removeFavourite() to remove recipe from favourites list
        // Then calling getFavourites() to refresh favourites list
        removeRecipeFavBtn.addEventListener("click", () => {
            const recipeId = parseInt(removeRecipeFavBtn.dataset.recipeId, 10);
            if (!isNaN(recipeId)) {
                (async () => {
                    await apiCalls.removeFavourite(userId, recipeId);
                    await getFavourites(userId);


                    // Toggling CSS classes for add to favourites and remove from favourites buttons
                    const remFavBtns = document.querySelectorAll(".hideRemoveRecipeFavBtn");
                    remFavBtns.forEach(remFavBtn => remFavBtn.classList.remove('hideRemoveRecipeFavBtn'));
                    const addFavBtns = document.querySelectorAll(".showRecipeFavBtn");
                    addFavBtns.forEach(addFavBtn => addFavBtn.classList.add('hideAddRecipeFavBtn'));
                })();
            }
            else {
                console.error('Invalid recipe ID');
            }
        });


        // Appending recipe to DOM
        list.appendChild(recipeDiv);
    });
}


// Overlay for pop up dialog boxes
const overlay = document.getElementById('overlay');
const contactForm = document.getElementById('contactFormDiv');
const getInTouchBtn = document.getElementById('getInTouchBtn');
const closeContactForm = document.getElementById('closeButton');


// Function to toggle CSS classes for overlay and get in  touch form
function toggleContactForm(show) {
    if (show) {
        overlay.classList.add('active');
        contactForm.classList.add('active');
    } else {
        overlay.classList.remove('active');
        contactForm.classList.remove('active');
    }
}


// Handling get in touch form
// Get in touch form event listeners
getInTouchBtn.addEventListener('click', () => { toggleContactForm(true); });
closeContactForm.addEventListener('click', () => { toggleContactForm(false); });

document.addEventListener('DOMContentLoaded', (event) => {
    const sentMsgBtn = document.getElementById("sentMsgBtn");
    const customAlertModal = document.getElementById("customAlert");
    const closeButton = document.querySelector(".close-button");
    const modalMessage = document.getElementById("modalMessage");


    // Generating get in touch form warning messages and 
    // changing the display setting for popup message 
    const showModal = (message) => {
        modalMessage.textContent = message;
        customAlertModal.style.display = "block";
    };
    const closeModal = () => {
        customAlertModal.style.display = "none";
    };

    closeButton.addEventListener("click", closeModal);
    sentMsgBtn.addEventListener("click", (event) => {
        event.preventDefault();


        // Getting get in touch form fields values
        const nameFieldValue = document.getElementById("name").value;
        const emailFieldValue = document.getElementById("email").value;
        const messageFieldValue = document.getElementById("message").value;


        // Checking if all fields are filled in
        if (!nameFieldValue || !emailFieldValue || !messageFieldValue) {
            showModal("Please fill in the required fields.");
            return;
        }


        // Validating the email field
        const emailValidationPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValidationPattern.test(emailFieldValue)) {
            showModal("Please enter a valid email address.");
            return;
        }


        // Storing get in touch form data into JSON 
        const jsonData = {
            name: nameFieldValue,
            email: emailFieldValue,
            message: messageFieldValue
        };


        // Calling sentMessage() to store the message in DB
        apiCalls.sendMessage(jsonData);


        // Notification to prompt user that message has been sent
        // Setting the position of the notification to the middle of the screen
        const messsageNotification = document.getElementById('messsageNotification');

        // Calculate the center position
        const left = (window.innerWidth / 2) - (messsageNotification.offsetWidth / 2);
        const top = (window.innerHeight / 2) - (messsageNotification.offsetHeight / 2);


        // Set the position
        messsageNotification.style.left = left + 'px';
        messsageNotification.style.top = top + 'px';


        // Changing adding CSS class to notification
        messsageNotification.classList.add('show');


        // Notification timeout
        setTimeout(function () {
            messsageNotification.classList.remove('show');
        }, 1000);


        // Clearing the get in touch form fields
        // And toggling CSS classes for the overlay
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
        toggleContactForm(false);
    });


    // Click event to change the display setting for the custom alert
    window.onclick = function (event) {
        if (event.target == customAlertModal) {
            customAlertModal.style.display = "none";
        }
    };
});


// Event listeners for index.php tabs
// And calling getRecipes for the respective tab
const popularTab = document.getElementById('popular');
popularTab.addEventListener('click', async () => {
    let recipes = await apiCalls.getRecipes({ "dish_chef_recommended": "1" });
    addRecipes(recipes);
})

const indianTab = document.getElementById('indian');
indianTab.addEventListener('click', async () => {
    let recipes = await apiCalls.getRecipes({ "origin_country": "india" });
    addRecipes(recipes);
})

const chineseTab = document.getElementById('chinese');
chineseTab.addEventListener('click', async () => {
    let recipes = await apiCalls.getRecipes({ "origin_country": "china" });
    addRecipes(recipes);
})

const italianTab = document.getElementById('italian');
italianTab.addEventListener('click', async () => {
    let recipes = await apiCalls.getRecipes({ "origin_country": "italy" });
    addRecipes(recipes);
})

const frenchTab = document.getElementById('french');
frenchTab.addEventListener('click', async () => {
    let recipes = await apiCalls.getRecipes({ "origin_country": "france" });
    addRecipes(recipes);
})

const russianTab = document.getElementById('russian');
russianTab.addEventListener('click', async () => {
    let recipes = await apiCalls.getRecipes({ "origin_country": "russia" });
    addRecipes(recipes);
})

const moldovanTab = document.getElementById('moldovan');
moldovanTab.addEventListener('click', async () => {
    let recipes = await apiCalls.getRecipes({ "origin_country": "moldova" });
    addRecipes(recipes);
})


// Function to search recipes (index.php)
async function searchRecipesIndex() {

    const recipesList = document.getElementById('recipesList');
    const search = document.getElementById("indexRecipeSearchBox").value;


    // Calling searchRecipes() to search for recipes based on the search riteria
    let searchResults = await apiCalls.searchRecipes(search);


    // Hiding My Favourites header if not null
    document.querySelector("#favHeaderDiv")?.classList.add('hideFavHeader');


    // Clearing the recipes list before displaying  the search results
    recipesList.innerText = "";


    // Displaying No recipe found if there are no search results
    if (searchResults.length === 0) {
        const noResultsIndex = document.createElement('h2');
        noResultsIndex.classList.add('noResultsIndex');
        noResultsIndex.innerHTML = 'No Recipes Found'
        recipesList.appendChild(noResultsIndex);
    }


    // Calling addRecipes() to list the search results
    else {
        addRecipes(searchResults);
    }
}


// Event listener for index.php search button
// And calling searchRecipesIndex() to search for recipes
document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById('indexRecipesSearch');
    const searchInput = document.getElementById('indexRecipeSearchBox');

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            searchRecipesIndex();


            // Unselecting index.php tabs when searching
            document.querySelector('.tabSelected')?.classList.remove('tabSelected');
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                searchRecipesIndex();


                // Unselecting index.php tabs when searching    
                document.querySelector('.tabSelected')?.classList.remove('tabSelected');
            }
        });
    }
});


// Function to retrieve and display user's favourite recipes
async function getFavourites(userId) {
    const recipesList = document.getElementById('recipesList');

    try {


        // Calling getFavourites() to retrieve user's favourite recipes
        const response = await apiCalls.getFavourites(userId);


        // Clearing the current recipes list before diplsying favourites
        recipesList.innerText = "";


        // Displaying No favourites message if user doesn't have any favourite recipes
        if (!response || response.length === 0) {
            const noResultsIndex = document.createElement('h2');
            noResultsIndex.classList.add('noResultsIndex');
            noResultsIndex.innerHTML = 'You don\'t have any favourite recipes added.';
            recipesList.appendChild(noResultsIndex);
        }


        // Calling addRecipes() to list user's favourite recipes
        else {
            addRecipes(response);

        }
    }

    catch (error) {
        console.error('Error fetching favourites:', error);
        recipesList.innerText = "An error occurred while fetching your favourites.";
    }
}


// Event listener for My Favourites button
// And checking if user is logged in
const favouritesButton = document.getElementById('viewFavourites');
if (favouritesButton) {
    favouritesButton.addEventListener('click', function () {


        // If user is not logged in redirect to login or register
        if (!isLoggedIn) {
            window.location.href = 'auth.php';
        }
        else {
            (async () => {


                // Unselect the selected tab on index.php
                // Displaying My Favourites header
                document.querySelector('.tabSelected')?.classList.remove('tabSelected');
                document.querySelector("#favHeaderDiv")?.classList.remove('hideFavHeader');


                // Calling getFavourites() to retrieve user's favourite recipes 
                await getFavourites(userId);


                // Hiding add to favourites button and showing remove from favourites button
                // when displaying user's favourite recipes
                const remFavBtns = document.querySelectorAll(".hideRemoveRecipeFavBtn");
                remFavBtns.forEach(remFavBtn => remFavBtn.classList.remove('hideRemoveRecipeFavBtn'));
                const addFavBtns = document.querySelectorAll(".showRecipeFavBtn");
                addFavBtns.forEach(addFavBtn => addFavBtn.classList.add('hideAddRecipeFavBtn'));
            })()
        }
    });
}


// Calling getRecipes() and tabsController() once all the necessary DOM elements 
// Have been created to listing all the recommended recipes - Recomended Recipes Tab
// And toggling tabs CSS classes 
try {
    const recipes = await apiCalls.getRecipes({ "dish_chef_recommended": "1" });
    await addRecipes(recipes);
    commonController.tabsController();
}
catch (error) {
    console.error("Error loading recipes:", error);
}
