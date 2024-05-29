import * as apiCalls from './apiCalls.js';
import * as functions from './functions.js';
import * as commonController from './commonController.js'

//add current year to footer copyright 
document.getElementById('year').textContent = new Date().getFullYear();

//list all recommended recipes
document.addEventListener('DOMContentLoaded', async () => {
    if (window.location.pathname.includes('index.html')) {
        try {
            const recipes = await apiCalls.getRecipes({ "dish_chef_recommended": "1" });
            addRecipes(recipes);
        } catch (error) {
            console.error("Error loading recipes:", error);
        }
    }
    commonController.tabsController();
});


//function to add recipes to index.html
function addRecipes(recipesList) {
    const list = document.getElementById("recipesList");
    //clear current tasks
    list.innerText = "";

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
        //Heading
        let recipeHeading = document.createElement("h2")
        recipeHeading.innerHTML = recipe.dish_name
        let recipeHeadingH2Div = document.createElement("div")
        recipeHeadingH2Div.appendChild(recipeHeading);

        //Fav Btn
        let recipeAddFavBtn = document.createElement("button")
        let recipeHeadingBtnDiv = document.createElement("div")
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

        list.appendChild(recipeDiv);
    });
}


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

    const jsonData = {
        name: name,
        email: email,
        message: message
    };

    apiCalls.sendMessage(jsonData);

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
    toggleContactForm(false);
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











