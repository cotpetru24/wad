import * as logic from './logic.js';
import { sendMessage } from './logic.js';
logic.getRecipes();
document.getElementById('year').textContent = new Date().getFullYear();


        // Tabs functionality for Admin Page
        const contentSections = document.querySelectorAll('.contentSection');
        const tabButtonArray = document.querySelectorAll('.tabs');
        tabButtonArray.forEach((tabButton, index) => {
            tabButton.addEventListener('click', () => {
                document.querySelector('.tabSelected')?.classList.remove('tabSelected');
                tabButton.classList.add('tabSelected');
                contentSections.forEach((section, sectionIndex) => {
                    section.style.display = sectionIndex === index ? 'block' : 'none';
                });
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

        // Toggle Add Recipe Form
        document.getElementById("toggleFormButton").addEventListener("click", function () {
            const form = document.getElementById("addRecipeForm");
            form.style.display = form.style.display === "none" ? "block" : "none";
        });

























