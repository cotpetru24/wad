<?php
require 'data/sessionChecker.php';
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/public/img/tab_logo.png" type="image/png" />
    <title>Cookking Creations</title>
    <link rel="stylesheet" href="public/css/style.css" />
</head>

<body>
    <div id="wrapper">
        <header>
            <a href="index.php"><img id="headerLogo" src="./public/img/logo.jpg" alt="logo" /></a>
            <div class="tabsDiv" id="tabsDiv">
                <button class="tabs tabSelected" id="popular">
                    <img src="/public/img/icons8-star-48.png" alt="Popular" />Recommended
                </button>
                <button class="tabs" id="indian">
                    <img src="/public/img/icons8-india-48.png" alt="Indian" />Indian
                </button>
                <button class="tabs" id="chinese">
                    <img src="/public/img/icons8-china-48.png" alt="Chinese" />Chinese
                </button>
                <button class="tabs" id="italian">
                    <img src="/public/img/icons8-italian-flag-48.png" alt="Italian" />Italian
                </button>
                <button class="tabs" id="french">
                    <img src="/public/img/icons8-french-flag-48.png" alt="French" />French
                </button>
                <button class="tabs" id="russian">
                    <img src="/public/img/icons8-russian-federation-48.png" alt="Russian" />Russian
                </button>
                <button class="tabs" id="moldovan">
                    <img src="/public/img/icons8-moldova-48.png" alt="Moldovan" />Moldovan
                </button>
            </div>
            <nav>
                <div id="nav">
                    <button id="homeButton"></button>
                    <button onclick="location.href='data/logout.php'">logout</button>
                    <button onclick="location.href='auth.html'">Register</button>
                    <button onclick="location.href='auth.html'">Login</button>
                    <button onclick="location.href='adminPage.php'">Admin Page</button>
                </div>
                <div id="searchDiv">
                    <input type="search" id="indexRecipeSearchBox" placeholder="Search recipes...">
                    <button id="indexRecipesSearch"></button>

                </div>
            </nav>
        </header>
        <main id="recipesList">
            <!-- Recipes go here -->
        </main>
        <footer id="footer">
            <div id="footerDiv">
                <img id="footerLogo" src="public/img/logo.jpg" alt="logo" />
                <p id="emailContact">Email Us</p>
                <p><a href="mailto:abc@example.com">abc@example.com</a></p>
                <button id="getInTouchBtn">
                    <h2>Get In Touch</h2>
                </button>
                <div class="contactFormDiv" id="contactFormDiv">
                    <div class="contactFormHeader">
                        <h2>Get In Touch</h2>
                        <button class="closeButton" id="closeButton">
                            &times;
                        </button>
                    </div>
                    <div class="contactForm">
                        <form id="contactUsForm" action="#" method="POST">
                            <label for="name">Name:</label>
                            <input type="text" id="name" name="name" required />
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" required />
                            <label for="message">Message:</label>
                            <textarea id="message" name="message" rows="10" required></textarea>
                            <button type="submit" id="sentMsgBtn" class="sendButton">
                                Send
                            </button>
                        </form>
                        <div id="customAlert" class="modal">
                            <div class="modal-content">
                                <span class="close-button">&times;</span>
                                <p id="modalMessage"></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="overlay"></div>
            </div>
            <p id="copyright">
                &copy; <span id="year"></span> STU124543. All rights reserved.
            </p>

        </footer>
    </div>
    <script src="public/js/indexController.js" type="module" defer></script>

</body>

</html>