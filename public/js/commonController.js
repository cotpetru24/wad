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

    // const searchButtonIndex = document.getElementById('searchButton');
    // if (searchButtonIndex) {
    //     searchButtonIndex.addEventListener('click', () => {
    //         const currentSelectedTab = document.querySelector('.tabSelected');
    //         if (currentSelectedTab) {
    //             currentSelectedTab.classList.remove('tabSelected');
    //         }
    //     });
    // }
}


export function toggleExpand(event) {
    const button = event.target; // Get the target button from the event
    const row = button.closest('tr'); // Ensure button is a DOM element and get the closest tr
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


