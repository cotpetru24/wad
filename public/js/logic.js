const list = document.getElementById("recipesList");



function formatDishRating(rating) {
    const yellowStar = '<img class="ratingStars" src="/public/img/icons8-star-filled-30-yellow.png" alt="Yellow Star" />';
    const grayStar = '<img class="ratingStars" src="/public/img/icons8-star-filled-30-gray.png" alt="Gray Star" />';

    let yellowStars = yellowStar.repeat(rating);
    let grayStars = grayStar.repeat(5 - rating);

    return yellowStars + grayStars;
}


function toTitleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}


function formatPrepTime(prepTime) {
    if (prepTime / 60 < 1) return `&#x1F552; ${prepTime} min`;
    else return `&#x1F552; ${prepTime / 60} h`
}


// function to add tasks using a JSON data source
function addRecipes(recipesList) {
    //clear current tasks
    list.innerText = "";

    recipesList.forEach((recipe) => {

        //////----------Recipe img div---------\\\\\\\
        let recipeImg = document.createElement("img");
        if (recipe.dish_img) {
            recipeImg.src = recipe.dish_img;
            // recipeImg.style.maxHeight = "100%";
            // recipeImg.style.maxWidth = "266px"
        }
        // else {
        //     recipeImg.src = 'default_image_path'; // Optionally set a default image path
        // }
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
        // recipeAddFavBtn.innerHTML = '<img src="/public/img/icons8-favourite-60.png" alt="Add to Favorites" />';
        let recipeHeadingBtnDiv = document.createElement("div")
        recipeHeadingBtnDiv.appendChild(recipeAddFavBtn);

        //Recipe Heading Div
        let recipeHeadingDiv = document.createElement("div");
        recipeHeadingDiv.appendChild(recipeHeadingH2Div);
        recipeHeadingDiv.appendChild(recipeHeadingBtnDiv);


        //////----------Recipe subheading div---------\\\\\\\
        let recipeRating = document.createElement("h3");
        recipeRating.innerHTML = formatDishRating(recipe.dish_rating);
        let recipeNonvegetarianVegetarian = document.createElement("h3");
        recipeNonvegetarianVegetarian.innerHTML = toTitleCase(recipe.category_name);

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
        prepTime.innerHTML = formatPrepTime(recipe.dish_prep_time);
        let prepTimeDiv = document.createElement("div");
        prepTimeDiv.appendChild(prepTimeHeading);
        prepTimeDiv.appendChild(prepTime);

        //Dificulty div
        let dificultyHeading = document.createElement('h3');
        dificultyHeading.innerHTML = "Dificulty";
        let dificulty = document.createElement('h4');
        dificulty.innerHTML = toTitleCase(recipe.complexity_name);
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
        if (recipe.dish_ingredients){
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
        









        //to add here event listeners for tabs and button click

        // completeButton.addEventListener("click", ()=> {toggleCompleted(task)});
        // deleteButton.addEventListener("click", ()=> {removeTask(task)});









        list.appendChild(recipeDiv);
    });

}


// const addButton = document.getElementById("addTask");
// const input = document.getElementById("newTaskText");
// addButton.addEventListener("click", ()=>{addTask()});
// input.addEventListener("keypress", (k=>{if(k.key==="Enter") {addButton.click()}}));


// 
// this is the old one in case the above doesn't work use this onw
// export async function getRecipes(){
//     try{
//         const response = await fetch("http://localhost/data/index.php");
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const recipes = await response.json();
//         addRecipes(recipes);
//     }
//     catch(error){
//         console.log("Error retrieving data: " + error);
//     }
// }
//the new get recipes function
export async function getRecipes() {
    try {
        const param = new URLSearchParams({ "function": "getRecipesList" });
        const response = await fetch(`http://localhost/data/index.php?${param.toString()}`,
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
        addRecipes(recipes);
    }
    catch (error) {
        console.log("Error retrieving data: " + error);
    }
}




export async function removeRecipe(recipe) {
    try {
        const param = new URLSearchParams({ "function": "removeRecipe", "recipeID": recipe.recipe_id });
        const recipeData = await fetch("http://localhost/data/index.php", { method: "POST", body: param });
        getRecipes();
    }
    catch (error) {
        console.log("Error removing recipe" + error);
    }
}





export async function addRecipe() {
    try {
        const param = new URLSearchParams({ "function": "addRecipe", "jsonData": "recipe data should go here" });
        const recipeData = await fetch("http://localhost/data/index.php", { method: "POST", body: param });
        getRecipes();
    }
    catch (error) {
        console.log("error retrieving data: " + error);
    }
}


export async function viewRecipe(recipe_ID) {
    try {
        const param = new URLSearchParams({ "function": "viewRecipe", "recipeID": "recipe_ID" });
        const recipeData = await fetch("http://localhost/data/index.php", { method: "POST", body: param });
    }
    catch (error) {
        console.log("error retrieving data " + error)
    }
}


export async function sendMessage(jsonData) {
    try {
        jsonData.function = "sendMessage";

        const response = await fetch("http://localhost/data/index.php",
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jsonData) });

        if (!response.ok) {
            throw new Error(`Network response was not OK! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(`Message sent successfully:`, responseData)
        // alert('Message sent successfully!');
    }
    catch (error) {
        console.log("Error sending message:", error);
    }
}

// Function to view message
function addMessage(message) {
    const viewMessagePopup = document.getElementById('viewMessagePopup');
    const overlay = document.getElementById('overlay');
    const viewMessageContent = document.getElementById('viewMessageContent');

    viewMessageContent.innerHTML = `
                <p><strong>Name:</strong> ${message.name}</p>
                <p><strong>Email:</strong> ${message.email}</p>
                <p><strong>Message:</strong> ${message.content}</p>
                <p><strong>Date:</strong> ${message.date}</p>
                <p><strong>Status:</strong> ${message.read ? 'Read' : 'Unread'}</p>
            `;

    viewMessagePopup.classList.add('active');
    overlay.classList.add('active');
}

// sampleMessages.forEach(addMessageRow);

export async function getMessages() {
    try {
        const param = new URLSearchParams({ "function": "getMessagesList" });


        const response = await fetch(`http://localhost/data/index.php?${param.toString()}`,
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


