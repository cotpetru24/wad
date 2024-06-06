<?php
session_start();

// Checking if user is logged in and setting session varriables
$isLoggedIn = isset($_SESSION['user_id']);
$user_id = $isLoggedIn ? $_SESSION['user_id'] : null;
$user_name = $isLoggedIn ? $_SESSION['user_name'] : null;
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth</title>
    <link rel="stylesheet" href="public/css/style.css">
    <script>
        // Converting php session variables to js const
        const isLoggedIn = <?php echo json_encode($isLoggedIn); ?>;
        const userId = <?php echo json_encode($user_id); ?>;
    </script>
    <script src="public/js/authController.js" type="module" defer></script>

</head>

<body>
    <div id="wrapper">
        <header>
            <a href="index.php"><img id="headerLogo" src="./public/img/logo.jpg" alt="logo" /></a>
            <nav>
                <div id="nav">
                    <button id="homeButton" onclick="location.href='./index.php'"></button>
                    <button id="authLoginBtn">Login</button>
                    <button id="authRegisterBtn">Register</button>
                </div>
            </nav>
        </header>
        <main>
            <!-- Login Form -->
            <div class="authDiv">
                <div class="contactFormHeader" id="loginRegisterHeader">
                    <h2>Login</h2>
                </div>
                <form id="loginForm" method="POST">

                    <div class="form-group inputDiv">
                        <label for="email">Email:</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group inputDiv">
                        <label for="password">Password:</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button id="loginBtn" type="submit">Login</button>
                </form>
            </div>

            <!-- Register Form -->
            <div class="authDiv" id="registerDiv">
                <div class="contactFormHeader" id="loginRegisterHeader">
                    <h2>Register</h2>
                </div>
                <form id="registerForm" method="POST">
                    <div class="form-group">
                        <label for="name">First Name:</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="surname">Last Name:</label>
                        <input type="text" id="surname" name="surname" required>
                    </div>
                    <div class="form-group">
                        <label for="reg_email">Email:</label>
                        <input type="email" id="reg_email" name="reg_email" required>
                    </div>
                    <div class="form-group">
                        <label for="reg_password">Password:</label>
                        <input type="password" id="reg_password" name="reg_password" required>
                    </div>
                    <div class="form-group">
                        <label for="confirm_password">Confirm Password:</label>
                        <input type="password" id="confirm_password" name="confirm_password" required>
                    </div>
                    <button id="registerBtn" type="submit">Register</button>
                </form>
            </div>
        </main>
        <footer id="authFooter">
            <div id="footerDiv">
                <img id="footerLogo" src="public/img/logo.jpg" alt="logo" />
            </div>
            <p id="copyright">
                &copy; <span id="year"></span> STU124543. All rights reserved.
            </p>
        </footer>
    </div>
</body>

</html>