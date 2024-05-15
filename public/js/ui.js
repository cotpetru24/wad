import * as logic from './logic.js';
import { sendMessage } from './logic.js';

document.getElementById('year').textContent = new Date().getFullYear();

const tabButtonArray = document.querySelectorAll('.tabs');
tabButtonArray.forEach(tabButton => {
    tabButton.addEventListener('click', () => {
        document.querySelector('.tabSelected')?.classList.remove('tabSelected');
        tabButton.classList.add('tabSelected');
    });
});

const overlay = document.getElementById('overlay');
const contactForm = document.getElementById('contactFormDiv');
const getInTouchBtn = document.getElementById('getInTouchBtn');
const closeContactForm = document.getElementById('closeButton');

function toggleContactForm(show) {
    if (show) {
        overlay.classList.add('active');
        contactForm.classList.add('active');
    } else {
        overlay.classList.remove('active');
        contactForm.classList.remove('active');
    }
}

getInTouchBtn.addEventListener('click', () => {
    toggleContactForm(true);
});

closeContactForm.addEventListener('click', () => {
    toggleContactForm(false);
});

const sendMsgBtn = document.getElementById("sentMsgBtn");
sendMsgBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    const jsonData = {
        name: name,
        email: email,
        message: message
    };

    logic.sendMessage(jsonData);

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
    toggleContactForm(false);
});


logic.getRecipes();
