// Function to set recipe rating stars
export function formatDishRating(rating) {
    const yellowStar = '<img class="ratingStars" src="/public/img/icons8-star-filled-30-yellow.png" alt="Yellow Star" />';
    const grayStar = '<img class="ratingStars" src="/public/img/icons8-star-filled-30-gray.png" alt="Gray Star" />';
    return yellowStar.repeat(rating) + grayStar.repeat(5-rating);
}


// Function to set a string to title case
export function toTitleCase(str) {
    if (typeof str !== 'string') {
        return '';
    }
    return str.toLowerCase().replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}


// Function to format time and icon for recipe prep. time
export function formatPrepTime(prepTime) {
    if (prepTime / 60 < 1) return `&#x1F552; ${prepTime} min`;
    else return `&#x1F552; ${Math.floor(prepTime / 60)} h ${prepTime % 60} min.`
}


// Function to convert a string to JSON array
export function convertToJSONArray(string, delimiter = ','){
    let array = string.split(delimiter).map(item=>item.trim());
    let jsonArray = JSON.stringify(array);
    return jsonArray;
}

// export function swapFlagImage(flagIcon) {
//     const currentSrc = flagIcon.src;
//     const newSrc = currentSrc.includes('flag-pink.png') ? 'public/img/icons8-flag-grey.png' : 'public/img/icons8-flag-pink.png';
//     flagIcon.src = newSrc;
// }


// Functon to change the CSS class messages flag
export function toggleFlagClass(flagButton) {
    if (flagButton.classList.contains('flag-pink')) {
        flagButton.classList.remove('flag-pink');
        flagButton.classList.add('flag-grey');
    } else {
        flagButton.classList.remove('flag-grey');
        flagButton.classList.add('flag-pink');
    }
}


// Function to convert an image to base64 (for storring in DB)
export function convertImageToBase64(imageFile) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(imageFile);
    });
}