//Function to switch between login and register form
function showForm(formType) {
    document.getElementById('loginForm').style.display = formType === 'login' ? 'block' : 'none';
    document.getElementById('registerDiv').style.display = formType === 'register' ? 'block' : 'none';
}


//Function that handles the login and register api calls
async function handleFormSubmit(event, formType) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    formData.append(formType, '1');

    const response = await fetch('authApi.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    if (result.status === 'success') {
        window.location.href = formType === 'login' ? 'index.php' : 'auth.php';
    } else if (result.status === 'registrationSuccess') {
        alert(result.message);
        window.location.href = formType === 'login' ? 'index.php' : 'auth.php';
    } else {
        alert(result.message);
    }
}


//Event listeners for login and register submit forms
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        handleFormSubmit(event, 'login');
    });

    document.getElementById('registerForm').addEventListener('submit', function (event) {
        handleFormSubmit(event, 'register');
    });

    showForm('login');
});


//Event listener for toggling between login and register forms
document.getElementById('authLoginBtn').addEventListener('click', function () {
    showForm('login')
});
document.getElementById('authRegisterBtn').addEventListener('click', function () {
    showForm('register')
});