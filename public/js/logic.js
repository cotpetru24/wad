const list = document.getElementById("recipesList");


// function to add tasks using a JSON data source
function addRecipes(recipesList){
    //clear current tasks
    list.innerText = "";

    recipesList.forEach((recipe) => {

        //////----------Recipe img div---------\\\\\\\
        let recipeImg = document.createElement("img");
        if (recipe.dish_img){
            recipeImg.src = recipe.dish_img;
            recipeImg.style.maxHeight = "350px";
            recipeImg.style.maxWidth = "200px"
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
        recipeAddFavBtn.textContent = "AddFav" //to add here image instead of text   
        let recipeHeadingBtnDiv = document.createElement("div")
        recipeHeadingBtnDiv.appendChild(recipeAddFavBtn);

        //Recipe Heading Div
        let recipeHeadingDiv = document.createElement("div");
        recipeHeadingDiv.appendChild(recipeHeadingH2Div);
        recipeHeadingDiv.appendChild(recipeHeadingBtnDiv);


        //////----------Recipe subheading div---------\\\\\\\
        let recipeRating = document.createElement("h3");
        recipeRating.innerHTML = recipe.dish_rating;
        let recipeNonvegetarianVegetarian = document.createElement("h3");
        recipeNonvegetarianVegetarian.innerHTML = recipe.category;

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
        prepTime.innerHTML = recipe.dish_prep_time;
        let prepTimeDiv = document.createElement("div");
        prepTimeDiv.appendChild(prepTimeHeading);
        prepTimeDiv.appendChild(prepTime);

        //Dificulty div
        let dificultyHeading = document.createElement('h3');
        dificultyHeading.innerHTML = "Dificulty";
        let dificulty = document.createElement('h4');
        dificulty.innerHTML = recipe.dish_dish_complexity;
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
        let recipeDescriptionPar = document.createElement("p")
        recipeDescriptionPar.innerHTML = recipe.dish_recipe_description;
        let recipeDescriptionParDiv = document.createElement("div")
        recipeDescriptionParDiv.appendChild(recipeDescriptionPar);
        
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




export async function getRecipes(){
    try{
        const response = await fetch("http://localhost/data/index.php");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const recipes = await response.json();
        addRecipes(recipes);
    }
    catch(error){
        console.log("Error retrieving data: " + error);
    }
}




export async function removeRecipe(recipe){
    try{
        const param = new URLSearchParams ({"function" : "removeRecipe", "recipeID": recipe.recipe_id});
        const recipeData = await fetch("http://localhost/data/index.php", {method: "POST", body: param});
        getRecipes();
    }
    catch(error){
        console.log("Error removing recipe" + error);
    }
}





export async function addRecipe(){
try{
        const param = new URLSearchParams({"function" : "addRecipe", "jsonData": "recipe data should go here"});
        const recipeData = await fetch("http://localhost/data/index.php", {method: "POST", body: param});
        getRecipes();
    }
    catch(error){
        console.log("error retrieving data: " + error);
    }
}


export async function viewRecipe(recipe_ID){
    try{
        const param = new URLSearchParams({"function": "viewRecipe", "recipeID" : "recipe_ID"});
        const recipeData = await fetch("http://localhost/data/index.php", {method: "POST", body: param});
    }
    catch(error){
        console.log("error retrieving data " + error)
    }
}


export async function sendMessage(jsonData){
    try{
        jsonData.function = "sendMessage";

        const response = await fetch("http://localhost/data/index.php", 
        {method: "POST", headers: {'Content-Type' : 'application/json'}, body: JSON.stringify(jsonData)});
        
        if (!response.ok){
            throw new Error(`Network response was not OK! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(`Message sent successfully:`, responseData)
        // alert('Message sent successfully!');
    }
    catch(error){
        console.log("Error sending message:", error);
    }
}
