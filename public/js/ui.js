import * as logic from '/logic';

document.getElementById('year').textContent = new Date().getFullYear();


const tabButtonArray = document.querySelectorAll('.tabs');
tabButtonArray.forEach(tabButton => {
    tabButton.addEventListener('click', ()=> {
        document.querySelector('.tabSelected')?.classList.remove('tabSelected');
        tabButton.classList.add('tabSelected');
    })
})


const overlay = document.getElementById('overlay');
const contactForm = document.getElementById('contactFormDiv');
const getInTouchBtn = document.getElementById('getInTouchBtn');
const closeContactForm = document.getElementById('closeButton');


getInTouchBtn.addEventListener('click', ()=> {
    overlay.classList.add('active');
    contactForm.classList.add('active');
})

closeContactForm.addEventListener('click', ()=> {
    overlay.classList.remove('active');
    contactForm.classList.remove('active');
})





getRecipes();
