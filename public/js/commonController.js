// Function to control tabs selection and tabs content visibility
export function tabsController() {
    const contentSections = document.querySelectorAll('.contentSection');
    const tabButtonArray = document.querySelectorAll('.tabs');
    tabButtonArray.forEach((tabButton, index) => {
        tabButton.addEventListener('click', () => {
            document.querySelector('.tabSelected')?.classList.remove('tabSelected');
            document.querySelector("#favHeaderDiv")?.classList.add('hideFavHeader');
            tabButton.classList.add('tabSelected');
            contentSections.forEach((section, sectionIndex) => {
                section.style.display = sectionIndex === index ? 'block' : 'none';
            });
        });
    });
}


// Function to expand table rows for adminPage
export function toggleExpand(event) {
    const button = event.target;
    const row = button.closest('tr');
    const expandedRow = row.nextElementSibling;

    if (expandedRow && expandedRow.style.display === 'none') {
        expandedRow.style.display = 'table-row';
        button.textContent = expandedRow.classList.contains('message-expanded-row')
            ? 'Close' : 'Collapse';
    } else if (expandedRow) {
        expandedRow.style.display = 'none';
        button.textContent = expandedRow.classList.contains('message-expanded-row')
            ? 'Read' : 'Expand';
    }
}


