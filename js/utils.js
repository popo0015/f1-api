/**
 * Returns a formatted date string from a given date.
 * @param {string} dateStr - The date string to format.
 * @returns {string} - The formatted date.
 */
export function getFormattedDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
}

/**
 * Returns the race status tag depending on the current date and race date.
 * @param {Date} raceDate - The date of the race.
 * @param {Date} currentDate - The current date.
 * @param {boolean} isNextRace - Whether this is the next race.
 * @returns {string} - The HTML for the status tag.
 */
export function getRaceStatusTag(raceDate, currentDate, isNextRace) {
    let status = '';

    if (raceDate > currentDate) {
        status = 'Upcoming';
    } else if (raceDate < currentDate) {
        status = 'Finished';
    } else {
        status = 'Next Race';
    }

    return `<span class="bg-green-500 text-white rounded-full p-1 text-xs">${status}</span>`;
}
