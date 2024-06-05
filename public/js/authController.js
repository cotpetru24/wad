
function showForm(formType) {
    document.getElementById('loginForm').style.display = formType === 'login' ? 'block' : 'none';
    // document.getElementById('registerForm').style.display = formType === 'register' ? 'block' : 'none';

    document.getElementById('registerDiv').style.display = formType === 'register' ? 'block' : 'none';
    
}

async function handleFormSubmit(event, formType) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    formData.append(formType, '1');

    const response = await fetch('authentication.php', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    if (result.status === 'success') {
        alert(result.message);
        window.location.href = formType === 'login' ? 'index.php' : 'authentication.php';
    } else {
        alert(result.message);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        handleFormSubmit(event, 'login');
    });

    document.getElementById('registerForm').addEventListener('submit', function(event) {
        handleFormSubmit(event, 'register');
    });

    showForm('login'); // Default to login form
});
