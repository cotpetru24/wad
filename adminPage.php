<?php
require 'data/sessionChecker.php';

//Checking if user is of type 'admin' as only admins users should have access to this page
check_user_session('admin');

?>



<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/public/img/tab_logo.png" type="image/png">
    <title>Admin Dashboard</title>
    <link rel="icon" type="image/x-icon" href="/public/img/favicon.ico">
    <link rel="stylesheet" href="public/css/style.css">
</head>

<body>
    <div id="wrapper">
        <header>
            <a href="index.php"><img id="headerLogo" src="./public/img/logo.jpg" alt="logo" /></a>
            <div class="tabsDiv" id="tabsDiv">
                <button class="tabs tabSelected" id="recipesTab">Recipes</button>
                <button class="tabs" id="messagesTab">Messages</button>
                <button class="tabs" id="usersTab">Users</button>
            </div>
            <nav>
                <div id="nav">
                    <!-- Greeting users by their name -->
                    <?php if (isUserLoggedIn()) : ?>
                        <h3 id="greeting">Hi <?= $_SESSION['user_name'] ?>!</h3>
                    <?php endif; ?>
                    <button id="homeButton" onclick="location.href='./index.php'"></button>
                    <button onclick="location.href='data/logout.php'">Logout</button>
                </div>
            </nav>
        </header>
        <main>
            <div id="recipesSection" class="contentSection">
                <div class="container">
                    <div class="search-filter">
                        <input type="search" id="recipeSearchBox" placeholder="Search recipes...">
                        <div class="adminSearchShowBtnDiv">
                            <button id="adminRecipesSearch">Search</button>
                            <button id="adminRecipesClearFilters"> Show All</button>
                        </div>
                        <div class="filter-group">
                            <select id="recipeOriginFilter">
                                <option value="">All Countries</option>
                                <option value="india">India</option>
                                <option value="china">China</option>
                                <option value="italy">Italy</option>
                                <option value="france">France</option>
                                <option value="russia">Russia</option>
                                <option value="moldova">Moldova</option>
                            </select>
                            <select id="recipeComplexityFilter">
                                <option value="">All Complexities</option>
                                <option value="very easy">Very Easy</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                                <option value="very hard">Very Hard</option>
                            </select>
                            <select id="recipeRatingFilter">
                                <option value="">All Ratings</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                            <select id="recipePrepTimeFilter">
                                <option value="">All Prep Times</option>
                                <option value="<=30">Up to 30 mins</option>
                                <option value="<=60">Up to 1 hour</option>
                                <option value="<=120">Up to 2 hours</option>
                                <option value="<=240">Up to 4 hours</option>
                                <option value=">240">Over 4 hours</option>
                            </select>
                            <button id="adminRecipesFilter">Filter</button>
                        </div>
                    </div>
                    <button class="button" id="toggleFormButton">+ Add Recipe</button>
                    <div class="addRecipe" id="addRecipeForm" style="display: none;">
                        <h2>Add New Recipe</h2>
                        <div class="form-group">
                            <label for="dishName">Dish Name:</label>
                            <input type="text" id="dishName" placeholder="Dish name here" required>
                        </div>
                        <div class="form-group">
                            <label for="dishOrigin">Origin:</label>
                            <select id="dishOrigin" required>
                                <option value="" disabled selected>Select Origin</option>
                                <option value="1">India</option>
                                <option value="2">China</option>
                                <option value="3">Italy</option>
                                <option value="4">France</option>
                                <option value="5">Russia</option>
                                <option value="6">Moldova</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="dishDescription">Dish Description:</label>
                            <textarea class="inputclass" id="dishDescription" placeholder="Dish description here" required></textarea>
                        </div>
                        <!-- Ingredients will go in this section -->
                        <div class="form-group">
                            <label>Dish Ingredients:</label>
                            <div id="ingredientsContainer"></div>
                            <button type="button" class="steptIngredientsButton" id="addIngredientButton">+ Add
                                Ingredient</button>
                        </div>
                        <!-- Steps will go in this section -->
                        <div class="form-group">
                            <label>Steps:</label>
                            <div id="stepsContainer"></div>
                            <button class="steptIngredientsButton" type="button" id="addStepButton">+ Add Step</button>
                        </div>
                        <div class="form-group">
                            <label for="dishCategory">Dish Category:</label>
                            <select id="dishCategory" required>
                                <option value="" disabled selected>Select Category</option>
                                <option value="1">non-vegetarian</option>
                                <option value="2">vegetarian</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="dishComplexity">Dish Complexity:</label>
                            <select id="dishComplexity" required>
                                <option value="" disabled selected>Select Complexity</option>
                                <option value="1">Very Easy</option>
                                <option value="2">Easy</option>
                                <option value="3">Medium</option>
                                <option value="4">Hard</option>
                                <option value="5">Very Hard</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="dishPrepTime">Dish Prep Time (min):</label>
                            <input type="number" id="dishPrepTime" placeholder="Prep time here" required>
                        </div>
                        <div class="form-group">
                            <label for="dishRating">Dish Rating:</label>
                            <select id="dishRating">
                                <option value="" disabled selected>Select Rating</option>
                                <option value="0">No rating yet</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="dishChefRecommended">Chef Recommended:</label>
                            <select id="dishChefRecommended">
                                <option value="" disabled selected>Select an option</option>
                                <option value="0">Don't Know</option>
                                <option value="1">Yes</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="dishImage">Dish Image:</label>
                            <input type="file" id="dishImage">
                        </div>
                        <button class="button" id="addNewRecipe">+ Save Recipe</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Dish Name</th>
                                <th>Origin</th>
                                <th>Category</th>
                                <th>Complexity</th>
                                <th>Prep Time</th>
                                <th>Rating</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="adminRecipesList">
                            <!-- Recipe rows will go here -->
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="messagesSection" class="contentSection" style="display: none;">
                <div class="container">
                    <div class="search-filter">
                        <input type="search" id="messageSearchBox" placeholder="Search messages...">
                        <div class="adminSearchShowBtnDiv">
                            <button id="adminMessagesSearch">Search</button>
                            <button id="adminMessagesShowAll">Show All</button>
                        </div>
                        <div class="filter-group">
                            <select id="messageReadFilter">
                                <option value="">All</option>
                                <option value=1>Read</option>
                                <option value=0>Unread</option>
                            </select>
                            <button id="adminMessagesFilter">Filter</button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Flagged</th>
                                <th>From</th>
                                <th>Email</th>
                                <th>Date & Time</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="messagesList">
                            <!-- Message rows will go here -->
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="usersSection" class="contentSection" style="display: none;">
                <div class="container">
                    <div class="search-filter">
                        <input type="search" id="userSearchBox" placeholder="Search users...">
                        <div class="adminSearchShowBtnDiv">
                            <button id="adminUsersSearch">Search</button>
                            <button id="showAllUsers">Show All</button>
                        </div>
                        <div class="filter-group">
                            <select id="userRoleFilter">
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>
                            <button id="adminUsersFilter">Filter</button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="usersList">
                            <!-- Users rows will go here -->
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="recipeAddedNotification" id="recipeAddedNotification">
                <!-- Recipe added notification -->
                <h2>Recipe Added</h2>
            </div>
            <div class="changesSavedNotification" id="changesSavedNotification">
                <!-- Changes saved notification -->
                <h2>Changes Saved</h2>
            </div>
        </main>
        <footer id="adminFooter">
            <div id="footerDiv">
                <img id="footerLogo" src="public/img/logo.jpg" alt="logo" />
            </div>
            <p id="copyright">
                &copy; <span id="year"></span> STU124543. All rights reserved.
            </p>
        </footer>
    </div>
    <div id="overlay"></div>
    <div class="popup" id="editRecipePopup">
        <div class="popupHeader">
            <h2>Edit Recipe</h2>
            <button class="closeButton" id="closeEditPopup">&times;</button>
        </div>
        <div id="editRecipeContent">
            <input type="hidden" id="editRecipeId">
            <div class="form-group">
                <label for="editDishName">Dish Name:</label>
                <input type="text" id="editDishName" placeholder="Dish name here">
            </div>
            <div class="form-group">
                <label for="editDishOrigin">Origin:</label>
                <select id="editDishOrigin">
                    <option value="1">India</option>
                    <option value="2">China</option>
                    <option value="3">Italy</option>
                    <option value="4">France</option>
                    <option value="5">Russia</option>
                    <option value="6">Moldova</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editDishDescription">Dish Description:</label>
                <textarea class="inputclass" id="editDishDescription" placeholder="Dish description here" required></textarea>
            </div>
            <div class="form-group">
                <label for="editIngredientsContainer">Dish Ingredients:</label>
                <div id="editIngredientsContainer"></div>
                <button type="button" class="steptIngredientsButton" id="addEditIngredientButton">+ Add
                    Ingredient</button>
            </div>
            <div class="form-group">
                <label for="editStepsContainer">Steps:</label>
                <div id="editStepsContainer"></div>
                <button type="button" class="steptIngredientsButton" id="addEditStepButton">+ Add Step</button>
            </div>
            <div class="form-group">
                <label for="editDishCategory">Dish Category:</label>
                <select id="editDishCategory">
                    <option value="1">non-vegetarian</option>
                    <option value="2">vegetarian</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editDishComplexity">Dish Complexity:</label>
                <select id="editDishComplexity">
                    <option value="1">Very Easy</option>
                    <option value="2">Easy</option>
                    <option value="3">Medium</option>
                    <option value="4">Hard</option>
                    <option value="5">Very Hard</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editDishPrepTime">Dish Prep Time (min):</label>
                <input type="number" id="editDishPrepTime" placeholder="Prep time here">
            </div>
            <div class="form-group">
                <label for="editDishRating">Dish Rating:</label>
                <select id="editDishRating">
                    <option value="0">No rating yet</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editChefRecommended">Chef Recommended:</label>
                <select id="editChefRecommended">
                    <option value="" disabled selected>Select an option</option>
                    <option value="0">Don't Know</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                </select>
            </div>
            <div class="form-group">
                <label for="editDishImage">Dish Image:</label>
                <input type="file" id="editDishImage">
            </div>
            <button class="button" id="saveEditButton">Save Changes</button>
        </div>
    </div>
    <div class="popup" id="editUserPopup">
        <div class="popupHeader">
            <h2>Edit User</h2>
            <button class="closeButton" id="closeEditUserPopup">&times;</button>
        </div>
        <div id="editUserContent">
            <input type="hidden" id="editUserId">
            <div class="form-group">
                <label for="editUserName">Name:</label>
                <input type="text" id="editUserName" placeholder="User name here">
            </div>
            <div class="form-group">
                <label for="editUserSurname">Surname:</label>
                <input type="text" id="editUserSurname" placeholder="User surname here">
            </div>
            <div class="form-group">
                <label for="editUserEmail">Email:</label>
                <input type="email" id="editUserEmail" placeholder="User email here">
            </div>
            <div class="form-group">
                <label for="editUserPassword">Password (leave blank to keep the current password):</label>
                <input type="password" id="editUserPassword" placeholder="User password here">
            </div>
            <div class="form-group">
                <label for="editUserRole">Role:</label>
                <select id="editUserRole">
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>
            <button class="button" id="saveUserChangesButton">Save Changes</button>
        </div>
    </div>
    <div class="popup" id="confirmActionPopup">
        <div class="popupHeader">
            <h2>Confirm Action</h2>
            <button class="closeButton" id="closeConfirmActionPopup">&times;</button>
        </div>
        <div id="confirmActionContent">
            <p id="confirmActionMessage">Are you sure?</p>
            <div class="actions">
                <button id="confirmActionYesButton" class="button">Yes</button>
                <button id="confirmActionNoButton" class="button">No</button>
            </div>
        </div>
    </div>
    <script src="public/js/adminController.js" type="module" defer></script>
</body>

</html>