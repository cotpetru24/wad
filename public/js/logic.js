const list = document.getElementById("recipeList");


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


        this.recipeItemDiv.id = "recipe_ID" + recipe.recipe_id;


        recipeDiv.classList.add("recipe")
        recipeImgDiv.classList.add("dishImage")
        recipeDescriptionDiv.classList.add("recipeDescription")
        recipeDetailsDiv.classList.add("recipeDetails")
        recipeMainIngredientsDiv.classList.add("recipeMainIngredients")

        recipeImgDiv.appendChild(recipeImg);
        recipeDetailsDiv.appendChild(recipeDescriptionPar);
        recipeMainIngredientsDiv.appendChild(recipeIngredientsPar);
        recipeDescriptionDiv.appendChild(recipeDetailsDiv, recipeMainIngredientsDiv)
        recipeDiv.appendChild(recipeImgDiv, recipeDescriptionDiv)



        //setting the values of the new elements
        recipeImg.innerHTML = recipe.recipe_img;
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
        const recipesData = await fetch("http://localhost/data/index.php");
        const recipes = await recipesData.json();
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


export async function sendMessage(data){
    try{
        const param = new URLSearchParams({"function":"sendMessage", "jsonData":"jsondata goes hereeeeeeeeeeeee"});
        const messagData = await fetch("http://localhost/data/index.php", {method: "POST", body: param});
    }
    catch(error){
        console.log("error retrieving data " + error)
    }
}
