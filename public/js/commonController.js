// Tabs functionality
export function tabsController() {
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
}
