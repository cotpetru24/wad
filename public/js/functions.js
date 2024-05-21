export function formatDishRating(rating) {
    const yellowStar = '<img class="ratingStars" src="/public/img/icons8-star-filled-30-yellow.png" alt="Yellow Star" />';
    const grayStar = '<img class="ratingStars" src="/public/img/icons8-star-filled-30-gray.png" alt="Gray Star" />';
    return yellowStar.repeat(rating) + grayStar.repeat(5-rating);
}


export function toTitleCase(str) {
    if (typeof str !== 'string') {
        return ''; // or handle the error as appropriate for your use case
    }
    return str.toLowerCase().replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });
}



export function formatPrepTime(prepTime) {
    if (prepTime / 60 < 1) return `&#x1F552; ${prepTime} min`;
    else return `&#x1F552; ${prepTime / 60} h`
}

export function convertToJSONArray(string){
    let array = string.split(',').map(item=>item.trim());
    let jsonArray = JSON.stringify(array);

    return jsonArray;
}