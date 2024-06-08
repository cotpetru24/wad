import * as apiCalls from './apiCalls.js';
import * as functions from './functions.js';
import * as commonController from './commonController.js'





// Ensure the variable is available globally
console.log(isLoggedIn);
console.log(userId);









//add current year to footer copyright 
document.getElementById('year').textContent = new Date().getFullYear();

//list all recommended recipes
document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('index.html')) {
        try {
            const recipes = await apiCalls.getRecipes({ "dish_chef_recommended": "1" });
            await addRecipes(recipes);
        } catch (error) {
            console.error("Error loading recipes:", error);
        }
    }
    commonController.tabsController();
});




//this is the old function, incase the one below doesnt worl
//function to add recipes to index.html
async function addRecipes(recipesList) {

    const list = document.getElementById("recipesList");
    //clear current tasks
    list.innerText = "";

    recipesList.forEach((recipe) => {
        // alert('add recipes function has been called, this is the search result:'+ recipesList );
        // console.log(recipesList);

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
        //Heading
        let recipeHeading = document.createElement("h2")
        recipeHeading.innerHTML = recipe.dish_name
        let recipeHeadingH2Div = document.createElement("div")
        recipeHeadingH2Div.appendChild(recipeHeading);

        //Fav Btns







        let removeRecipeFavBtn = document.createElement("button");
        removeRecipeFavBtn.dataset.recipeId = recipe.dish_id;
        removeRecipeFavBtn.classList.add("hideRemoveRecipeFavBtn")
        removeRecipeFavBtn.classList.add("removeRecipeFavBtn")
        removeRecipeFavBtn.innerText="Remove from Favourites";













        let recipeAddFavBtn = document.createElement("button")
        // recipeAddFavBtn.id = recipe.dish_id;
        recipeAddFavBtn.dataset.recipeId = recipe.dish_id;
        recipeAddFavBtn.classList.add('showRecipeFavBtn')




















        let recipeHeadingBtnDiv = document.createElement("div")
        recipeHeadingBtnDiv.classList.add('favDiv')


        recipeHeadingBtnDiv.appendChild(removeRecipeFavBtn);
        recipeHeadingBtnDiv.appendChild(recipeAddFavBtn);






        //Recipe Heading Div
        let recipeHeadingDiv = document.createElement("div");
        recipeHeadingDiv.appendChild(recipeHeadingH2Div);
        recipeHeadingDiv.appendChild(recipeHeadingBtnDiv);


        //////----------Recipe subheading div---------\\\\\\\
        let recipeRating = document.createElement("h3");
        recipeRating.innerHTML = functions.formatDishRating(recipe.dish_rating);
        let recipeNonvegetarianVegetarian = document.createElement("h3");
        recipeNonvegetarianVegetarian.innerHTML = functions.toTitleCase(recipe.category_name);

        //Recipe Subheading Div
        let recipeSubheadingDiv = document.createElement("div");
        recipeSubheadingDiv.appendChild(recipeRating);
        recipeSubheadingDiv.appendChild(recipeNonvegetarianVegetarian);


        //////----------Recipe head div---------\\\\\\\
        let recipeHeadDiv = document.createElement("div");
        recipeHeadDiv.appendChild(recipeHeadingDiv)
        recipeHeadDiv.appendChild(recipeSubheadingDiv)


        //////----------Recipe info div---------\\\\\\\
        //Prep time div
        let prepTimeHeading = document.createElement('h3');
        prepTimeHeading.innerHTML = "Prep Time";
        let prepTime = document.createElement("h4");
        prepTime.innerHTML = functions.formatPrepTime(recipe.dish_prep_time);
        let prepTimeDiv = document.createElement("div");
        prepTimeDiv.appendChild(prepTimeHeading);
        prepTimeDiv.appendChild(prepTime);

        //Dificulty div
        let dificultyHeading = document.createElement('h3');
        dificultyHeading.innerHTML = "Dificulty";
        let dificulty = document.createElement('h4');
        dificulty.innerHTML = functions.toTitleCase(recipe.complexity_name);
        let dificultyDiv = document.createElement('div');
        dificultyDiv.appendChild(dificultyHeading);
        dificultyDiv.appendChild(dificulty);

        //Recipe info div
        let recipeInfoDiv = document.createElement('div');
        recipeInfoDiv.appendChild(prepTimeDiv);
        recipeInfoDiv.appendChild(dificultyDiv);


        //////----------Recipe footer div---------\\\\\\\
        //Recipe actions div
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

        //Ingredients
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

        //Steps
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

        //Recipe description div
        let recipeDescriptionDiv = document.createElement('div');
        recipeDescriptionDiv.appendChild(recipeHeadDiv);
        recipeDescriptionDiv.appendChild(recipeDescriptionParDiv);
        recipeDescriptionDiv.appendChild(recipeFooterDiv);


        //////----------Recipe div---------\\\\\\\
        let recipeDiv = document.createElement('div');
        recipeDiv.id = "recipe_ID" + recipe.recipe_id;
        recipeDiv.appendChild(recipeImgDiv);
        recipeDiv.appendChild(recipeDescriptionDiv);

        //adding classes to dom elements
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

        expandBtn.addEventListener("click", () => {
            recipeDescriptionParDiv.classList.toggle("expanded");
            expandBtn.textContent = recipeDescriptionParDiv.classList.contains("expanded") ? "Collapse" : "Expand";
        });

        recipeAddFavBtn.dataset.recipeId

        //calls addfavourite function in api calls------------------------------------------------
        // recipeAddFavBtn.addEventListener("click", ()=>{
        //     const recipeId = parseInt(recipeAddFavBtn.id, 10);
        //     apiCalls.addFavourite(userId,recipeId)
        // })

        recipeAddFavBtn.addEventListener("click", (event) => {
            if (!userId) {
                window.location.href = 'auth.php';
                return;
            }

            const recipeId = parseInt(recipeAddFavBtn.dataset.recipeId, 10); // Parse the stored data
            if (!isNaN(recipeId)) {
                apiCalls.addFavourite(userId, recipeId);




                const favNotification = document.getElementById('favNotification');

            // Set the position of the notification to the click coordinates
            favNotification.style.top = (event.clientY-0) + 'px';
            favNotification.style.left = (event.clientX-70) + 'px';

                favNotification.classList.add('show');
    
                setTimeout(function() {
                    favNotification.classList.remove('show');
                }, 1500); // 3 seconds










            } else {
                console.error('Invalid recipe ID');
            }
        });

        removeRecipeFavBtn.addEventListener("click", () => {
            const recipeId = parseInt(removeRecipeFavBtn.dataset.recipeId, 10); // Parse the stored data
            if (!isNaN(recipeId)) {
                (async () => {
                    await apiCalls.removeFavourite(userId, recipeId);
                    await getFavourites(userId);

                    const remFavBtns = document.querySelectorAll(".hideRemoveRecipeFavBtn");
                    remFavBtns.forEach(remFavBtn => remFavBtn.classList.remove('hideRemoveRecipeFavBtn'));
        
                    const addFavBtns = document.querySelectorAll(".showRecipeFavBtn");
                    addFavBtns.forEach(addFavBtn => addFavBtn.classList.add('hideAddRecipeFavBtn'));
        

                })();
            
            
            } else {
                console.error('Invalid recipe ID');
            }
        });


        list.appendChild(recipeDiv);
    });
}





// async function addRecipes(recipesList) {
//     const list = document.getElementById("recipesList");
//     list.innerText = "";

//     const fragment = document.createDocumentFragment(); // Use DocumentFragment for batch updates

//     recipesList.forEach((recipe) => {
//         // Create elements
//         const recipeImg = document.createElement("img");
//         recipeImg.src = recipe.dish_img || 'public/img/image_coming_soon_with_camera_text.jpg';
//         const recipeImgDiv = document.createElement("div");
//         recipeImgDiv.appendChild(recipeImg);

//         const recipeHeading = document.createElement("h2");
//         recipeHeading.innerHTML = recipe.dish_name;
//         const recipeHeadingH2Div = document.createElement("div");
//         recipeHeadingH2Div.appendChild(recipeHeading);

//         const removeRecipeFavBtn = document.createElement("button");
//         removeRecipeFavBtn.dataset.recipeId = recipe.dish_id;
//         removeRecipeFavBtn.classList.add("hideRemoveRecipeFavBtn", "removeRecipeFavBtn");
//         removeRecipeFavBtn.innerText = "Remove from Favourites";

//         const recipeAddFavBtn = document.createElement("button");
//         recipeAddFavBtn.dataset.recipeId = recipe.dish_id;
//         recipeAddFavBtn.classList.add('showRecipeFavBtn');

//         const recipeHeadingBtnDiv = document.createElement("div");
//         recipeHeadingBtnDiv.classList.add('favDiv');
//         recipeHeadingBtnDiv.appendChild(removeRecipeFavBtn);
//         recipeHeadingBtnDiv.appendChild(recipeAddFavBtn);

//         const recipeHeadingDiv = document.createElement("div");
//         recipeHeadingDiv.appendChild(recipeHeadingH2Div);
//         recipeHeadingDiv.appendChild(recipeHeadingBtnDiv);

//         const recipeRating = document.createElement("h3");
//         recipeRating.innerHTML = functions.formatDishRating(recipe.dish_rating);

//         const recipeNonvegetarianVegetarian = document.createElement("h3");
//         recipeNonvegetarianVegetarian.innerHTML = functions.toTitleCase(recipe.category_name);
//         recipeNonvegetarianVegetarian.classList.add(recipe.category_name.toLowerCase() === "vegetarian" ? "vegetarian" : "non-vegetarian");

//         const recipeSubheadingDiv = document.createElement("div");
//         recipeSubheadingDiv.appendChild(recipeRating);
//         recipeSubheadingDiv.appendChild(recipeNonvegetarianVegetarian);

//         const recipeHeadDiv = document.createElement("div");
//         recipeHeadDiv.appendChild(recipeHeadingDiv);
//         recipeHeadDiv.appendChild(recipeSubheadingDiv);

//         const prepTimeHeading = document.createElement('h3');
//         prepTimeHeading.innerHTML = "Prep Time";

//         const prepTime = document.createElement("h4");
//         prepTime.innerHTML = functions.formatPrepTime(recipe.dish_prep_time);

//         const prepTimeDiv = document.createElement("div");
//         prepTimeDiv.appendChild(prepTimeHeading);
//         prepTimeDiv.appendChild(prepTime);

//         const dificultyHeading = document.createElement('h3');
//         dificultyHeading.innerHTML = "Difficulty";

//         const dificulty = document.createElement('h4');
//         dificulty.innerHTML = functions.toTitleCase(recipe.complexity_name);

//         const dificultyDiv = document.createElement('div');
//         dificultyDiv.appendChild(dificultyHeading);
//         dificultyDiv.appendChild(dificulty);

//         const recipeInfoDiv = document.createElement('div');
//         recipeInfoDiv.appendChild(prepTimeDiv);
//         recipeInfoDiv.appendChild(dificultyDiv);

//         const expandBtn = document.createElement('button');
//         expandBtn.textContent = "Expand";

//         const recipeActionsDiv = document.createElement('div');
//         recipeActionsDiv.appendChild(expandBtn);

//         const recipeFooterDiv = document.createElement('div');
//         recipeFooterDiv.appendChild(recipeInfoDiv);
//         recipeFooterDiv.appendChild(recipeActionsDiv);

//         const recipeDescriptionParDiv = document.createElement("div");
//         const recipeDescriptionPar = document.createElement("p");
//         recipeDescriptionPar.innerHTML = recipe.dish_recipe_description;
//         recipeDescriptionParDiv.appendChild(recipeDescriptionPar);

//         if (recipe.dish_ingredients) {
//             const recipeIngredientsHeader = document.createElement("h3");
//             recipeIngredientsHeader.innerHTML = "Ingredients:";

//             const ingredientsList = document.createElement("ul");
//             JSON.parse(recipe.dish_ingredients).forEach(value => {
//                 const listItem = document.createElement("li");
//                 listItem.textContent = value;
//                 ingredientsList.appendChild(listItem);
//             });

//             recipeDescriptionParDiv.appendChild(recipeIngredientsHeader);
//             recipeDescriptionParDiv.appendChild(ingredientsList);
//         }

//         if (recipe.dish_steps) {
//             const recipeStepsHeader = document.createElement("h3");
//             recipeStepsHeader.innerHTML = "Instructions";

//             const recipeSteps = document.createElement("ol");
//             JSON.parse(recipe.dish_steps).forEach(step => {
//                 const recipeStep = document.createElement("li");
//                 const stepTitle = document.createElement("strong");
//                 stepTitle.textContent = step.title + ":";

//                 const stepDescription = document.createElement("span");
//                 stepDescription.textContent = step.description;

//                 recipeStep.appendChild(stepTitle);
//                 recipeStep.appendChild(stepDescription);
//                 recipeSteps.appendChild(recipeStep);
//             });

//             recipeDescriptionParDiv.appendChild(recipeStepsHeader);
//             recipeDescriptionParDiv.appendChild(recipeSteps);
//         }

//         const recipeDescriptionDiv = document.createElement('div');
//         recipeDescriptionDiv.appendChild(recipeHeadDiv);
//         recipeDescriptionDiv.appendChild(recipeDescriptionParDiv);
//         recipeDescriptionDiv.appendChild(recipeFooterDiv);

//         const recipeDiv = document.createElement('div');
//         recipeDiv.id = "recipe_ID" + recipe.recipe_id;
//         recipeDiv.appendChild(recipeImgDiv);
//         recipeDiv.appendChild(recipeDescriptionDiv);

//         recipeDiv.classList.add("recipe");
//         recipeImgDiv.classList.add("dishImage");
//         recipeDescriptionDiv.classList.add("recipeDescription");
//         recipeHeadDiv.classList.add("recipeDetails");
//         recipeFooterDiv.classList.add("recipeFooterDiv");
//         recipeHeadingDiv.classList.add("recipeHeadDiv");
//         recipeSubheadingDiv.classList.add("recipeHeadDiv");
//         recipeInfoDiv.classList.add("recipeHeadDiv", "recipeFooterInfoInnerDivs");
//         dificultyDiv.classList.add("recipeFooterInfoDiv");
//         prepTimeDiv.classList.add("recipeFooterInfoDiv");
//         recipeDescriptionParDiv.classList.add("recipeParagraphDiv");

//         expandBtn.addEventListener("click", () => {
//             recipeDescriptionParDiv.classList.toggle("expanded");
//             expandBtn.textContent = recipeDescriptionParDiv.classList.contains("expanded") ? "Collapse" : "Expand";
//         });

//         recipeAddFavBtn.addEventListener("click", () => {
//             const recipeId = parseInt(recipeAddFavBtn.dataset.recipeId, 10);
//             if (!isNaN(recipeId)) {
//                 apiCalls.addFavourite(userId, recipeId);
//             } else {
//                 console.error('Invalid recipe ID');
//             }
//         });

//         removeRecipeFavBtn.addEventListener("click", async () => {
//             const recipeId = parseInt(removeRecipeFavBtn.dataset.recipeId, 10);
//             if (!isNaN(recipeId)) {
//                 await apiCalls.removeFavourite(userId, recipeId);
//                 await getFavourites(userId);

//                 document.querySelectorAll(".hideRemoveRecipeFavBtn").forEach(btn => btn.classList.remove('hideRemoveRecipeFavBtn'));
//                 document.querySelectorAll(".showRecipeFavBtn").forEach(btn => btn.classList.add('hideAddRecipeFavBtn'));
//             } else {
//                 console.error('Invalid recipe ID');
//             }
//         });

//         fragment.appendChild(recipeDiv);
//     });

//     list.appendChild(fragment); // Append fragment to the DOM
// }




// removeRecipeFavBtn.addEventListener("click", () => {
//     const recipeId = parseInt(removeRecipeFavBtn.dataset.recipeId, 10); // Parse the stored data
//     if (!isNaN(recipeId)) {
//         (async () => {
//             await apiCalls.removeFavourite(userId, recipeId);
//             getFavourites(userId);
//         })();
    
    
//     } else {
//         console.error('Invalid recipe ID');
//     }
// });

















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
getInTouchBtn.addEventListener('click', () => { toggleContactForm(true); });
closeContactForm.addEventListener('click', () => { toggleContactForm(false); });

const sendMsgBtn = document.getElementById("sentMsgBtn");
sendMsgBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // //checking if all fields are field in
    // if (!name || !email || !message){
    //     alert ("Please fill in the required fields.");
    //     return;
    // }

    // // Validate email field
    // const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // if (!emailValidation.test(email)) {
    //     alert("Please enter a valid email address.");
    //     return;
    });

//     const jsonData = {
//         name: name,
//         email: email,
//         message: message
//     };

//     apiCalls.sendMessage(jsonData);

//     document.getElementById('name').value = '';
//     document.getElementById('email').value = '';
//     document.getElementById('message').value = '';
//     toggleContactForm(false);
// });







// const closeFavAddedAlert = document.getElementById("closeFavAddedBtn")







document.addEventListener('DOMContentLoaded', (event) => {
    const sentMsgBtn = document.getElementById("sentMsgBtn");
    const customAlertModal = document.getElementById("customAlert");
    const closeButton = document.querySelector(".close-button");
    const modalMessage = document.getElementById("modalMessage");

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

        const nameFieldValue = document.getElementById("name").value;
        const emailFieldValue = document.getElementById("email").value;
        const messageFieldValue = document.getElementById("message").value;

        // Checking if all fields are filled in
        if (!nameFieldValue || !emailFieldValue || !messageFieldValue) {
            showModal("Please fill in the required fields.");
            return;
        }

        // Validate email field
        const emailValidationPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailValidationPattern.test(emailFieldValue)) {
            showModal("Please enter a valid email address.");
            return;
        }

        const jsonData = {
            name: nameFieldValue,
            email: emailFieldValue,
            message: messageFieldValue
        };

        apiCalls.sendMessage(jsonData);



        const messsageNotification = document.getElementById('messsageNotification');

               // Calculate the center position
               const left = (window.innerWidth / 2) - (messsageNotification.offsetWidth / 2);
               const top = (window.innerHeight / 2) - (messsageNotification.offsetHeight / 2);
               
               // Set the position
               messsageNotification.style.left = left + 'px';
               messsageNotification.style.top = top + 'px';

        messsageNotification.classList.add('show');

            setTimeout(function() {
                messsageNotification.classList.remove('show');
            }, 1000); // 3 seconds




        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('message').value = '';
        toggleContactForm(false);
    });

    window.onclick = function(event) {
        if (event.target == customAlertModal) {
            customAlertModal.style.display = "none";
        }
    };
});



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


closeContactForm.addEventListener('click', () => { toggleContactForm(false); });



//search recipes function + event listener => index page
async function searchRecipesIndex() {
    // const search = document.getElementById("search-box").value;
    // document.querySelector("#favHeaderDiv")?.classList.remove('showFavHeader');


    const recipesList = document.getElementById('recipesList');
    const search = document.getElementById("indexRecipeSearchBox").value;
    let searchResults = await apiCalls.searchRecipes(search);
    document.querySelector("#favHeaderDiv")?.classList.add('hideFavHeader');

    recipesList.innerText = "";

    if (searchResults.length === 0) {

        const noResultsIndex = document.createElement('h2');
        noResultsIndex.classList.add('noResultsIndex');
        noResultsIndex.innerHTML = 'No Recipes Found'

        recipesList.appendChild(noResultsIndex);
    } else {
        addRecipes(searchResults);
    }
}




// document.getElementById('indexRecipesSearch')?.addEventListener('click', () => {
//     searchRecipesIndex();
//     document.querySelector('.tabSelected')?.classList.remove('tabSelected');
// });





//if the below works remove the above!!!!!!!!!!!!!!!!!!!!!!!!!
document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById('indexRecipesSearch');
    const searchInput = document.getElementById('indexRecipeSearchBox');

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            searchRecipesIndex();
            document.querySelector('.tabSelected')?.classList.remove('tabSelected');
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                searchRecipesIndex();
                document.querySelector('.tabSelected')?.classList.remove('tabSelected');
            }
        });
    }
});


// view favourites event listener here----------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------
const favouritesButton = document.getElementById('viewFavourites');
if (favouritesButton) {
    favouritesButton.addEventListener('click', function() {
        if (!isLoggedIn) {
            window.location.href = 'auth.php';
        } else { (async () =>{ 
            document.querySelector('.tabSelected')?.classList.remove('tabSelected');
            document.querySelector("#favHeaderDiv")?.classList.remove('hideFavHeader');



           await getFavourites(userId);



            const remFavBtns = document.querySelectorAll(".hideRemoveRecipeFavBtn");
            remFavBtns.forEach(remFavBtn => remFavBtn.classList.remove('hideRemoveRecipeFavBtn'));

            const addFavBtns = document.querySelectorAll(".showRecipeFavBtn");
            addFavBtns.forEach(addFavBtn => addFavBtn.classList.add('hideAddRecipeFavBtn'));

        })()
            
        }
    });
}


// async function getFavourites(userId) {
//     const recipesList = document.getElementById('recipesList');
//     if (!userId) {
//         // recipesList.innerText = "Please log in to view your favourites.";
//         return;
//     }

//     const results = await apiCalls.getFavourites(userId);

//     // console.log(results);
//     recipesList.innerText = "";
//     if (results.length === 0) {
//         const noResultsIndex = document.createElement('h2');
//         noResultsIndex.classList.add('noResultsIndex');
//         noResultsIndex.innerHTML = 'No Recipes Found';
//         recipesList.appendChild(noResultsIndex);
//     } else {
//         addRecipes(results);
//     }

// }




async function getFavourites(userId) {
    const recipesList = document.getElementById('recipesList');
    

    try {
        const response = await apiCalls.getFavourites(userId);

        recipesList.innerText = "";

        if (!response || response.length === 0) {
            const noResultsIndex = document.createElement('h2');
            noResultsIndex.classList.add('noResultsIndex');
            noResultsIndex.innerHTML = 'You don\'t have any favourite recipes added.';
            recipesList.appendChild(noResultsIndex);
        } else {
            addRecipes(response);

        }

    } catch (error) {
        console.error('Error fetching favourites:', error);
        recipesList.innerText = "An error occurred while fetching your favourites.";
    }
}






try {
    const recipes = await apiCalls.getRecipes({ "dish_chef_recommended": "1" });
    await addRecipes(recipes);
} catch (error) {
    console.error("Error loading recipes:", error);
}
