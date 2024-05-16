const list = document.getElementById("recipesList");


// function to add tasks using a JSON data source
function addRecipes(recipesList){
    //clear current tasks
    list.innerText = "";

    recipesList.forEach((recipe) => {
        //assign newly created page element to variables
        let recipeDiv = document.createElement("div");
        let recipeImgDiv = document.createElement("div");
        let recipeImg = document.createElement("img");
        let recipeDescriptionDiv = document.createElement("div");
        let recipeDetailsDiv = document.createElement("div");
        let recipeDescriptionPar = document.createElement("p")
        let recipeMainIngredientsDiv = document.createElement("div")
        let recipeIngredientsPar = document.createElement("p")


        recipeDiv.id = "recipe_ID" + recipe.recipe_id;


        recipeDiv.classList.add("recipe")
        recipeImgDiv.classList.add("dishImage")
        recipeDescriptionDiv.classList.add("recipeDescription")
        recipeDetailsDiv.classList.add("recipeDetails")
        recipeMainIngredientsDiv.classList.add("recipeMainIngredients")


        //setting the values of the new elements
        if (recipe.dish_img){
            recipeImg.src = recipe.dish_img;
            recipeImg.style.height = "350px"; // Set the height to 300px
        }
        // else {
        //     recipeImg.src = 'default_image_path'; // Optionally set a default image path
        // }

        recipeImgDiv.appendChild(recipeImg);
        recipeDetailsDiv.appendChild(recipeDescriptionPar);
        recipeMainIngredientsDiv.appendChild(recipeIngredientsPar);
        recipeDescriptionDiv.appendChild(recipeDetailsDiv)
        recipeDescriptionDiv.appendChild(recipeMainIngredientsDiv)
        recipeDiv.appendChild(recipeImgDiv)
        recipeDiv.appendChild(recipeDescriptionDiv)




        recipeDescriptionPar.innerHTML = recipe.dish_recipe_description
        recipeIngredientsPar.innerHTML = recipe.dish_ingredients



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
