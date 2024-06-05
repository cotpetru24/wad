import * as apiCalls from './apiCalls.js';
// import * as functions from './functions.js';
// import * as commonController from './commonController.js';

const authController = {
    showForm: function(formType) {
        document.getElementById('loginForm').style.display = formType === 'login' ? 'block' : 'none';
        document.getElementById('registerDiv').style.display = formType === 'register' ? 'block' : 'none';
    }
};

// Expose authController to the global scope
window.authController = authController;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        apiCalls.handleFormSubmit(event, 'login');
    });

    document.getElementById('registerForm').addEventListener('submit', function (event) {
        apiCalls.handleFormSubmit(event, 'register');
    });

    // Initialize the default form view if needed
    authController.showForm('login');
});
