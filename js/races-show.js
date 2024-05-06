const urlParams = new URLSearchParams(window.location.search);
const raceId = urlParams.get('raceId');

// Fetch race data using the race ID
async function fetchRaceDetails() {
    const apiUrl = `https://ergast.com/api/f1/current/${raceId}.json`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayRaceDetails(data.MRData.RaceTable.Races[0]);
    } catch (error) {
        console.error('Failed to fetch race details:', error);
    }
}

// Display race details on the page
function displayRaceDetails(race) {
    const raceDetailsContainer = document.getElementById('race-details');
    const raceDate = new Date(race.date);

    function formatTime(timeString) {
        const timeParts = timeString.split(':');
        return `${timeParts[0]}:${timeParts[1]}`;
    }

    const tableHTML = `
            <table class="border-collapse border border-gray-300 mt-6 mb-10">
                <thead>
                    <tr class="bg-red-600 text-white">
                        <th class="border border-gray-300 px-4 py-2">Event</th>
                        <th class="border border-gray-300 px-4 py-2">Date</th>
                        <th class="border border-gray-300 px-4 py-2">Time</th>
                    </tr>
                </thead>
                <tbody class="table-font text-center">
                    ${race.FirstPractice ? `
                        <tr>
                            <td class="border border-gray-300 px-4 py-2">First Practice</td>
                            <td class="border border-gray-300 px-4 py-2">${new Date(race.FirstPractice.date).toDateString()}</td>
                            <td class="border border-gray-300 px-4 py-2">${formatTime(race.FirstPractice.time)}</td>
                        </tr>
                    ` : ''}
                    ${race.SecondPractice ? `
                        <tr>
                            <td class="border border-gray-300 px-4 py-2">Second Practice</td>
                            <td class="border border-gray-300 px-4 py-2">${new Date(race.SecondPractice.date).toDateString()}</td>
                            <td class="border border-gray-300 px-4 py-2">${formatTime(race.SecondPractice.time)}</td>
                        </tr>
                    ` : ''}
                    ${race.ThirdPractice ? `
                        <tr>
                            <td class="border border-gray-300 px-4 py-2">Third Practice</td>
                            <td class="border border-gray-300 px-4 py-2">${new Date(race.ThirdPractice.date).toDateString()}</td>
                            <td class="border border-gray-300 px-4 py-2">${formatTime(race.ThirdPractice.time)}</td>
                        </tr>
                    ` : ''}
                    ${race.Qualifying ? `
                        <tr>
                            <td class="border border-gray-300 px-4 py-2">Qualifying</td>
                            <td class="border border-gray-300 px-4 py-2">${new Date(race.Qualifying.date).toDateString()}</td>
                            <td class="border border-gray-300 px-4 py-2">${formatTime(race.Qualifying.time)}</td>
                        </tr>
                    ` : ''}
                    ${race.Sprint ? `
                        <tr>
                            <td class="border border-gray-300 px-4 py-2">Sprint</td>
                            <td class="border border-gray-300 px-4 py-2">${new Date(race.Sprint.date).toDateString()}</td>
                            <td class="border border-gray-300 px-4 py-2">${formatTime(race.Sprint.time)}</td>
                        </tr>
                    ` : ''}
                    <tr>
                        <td class="border border-gray-300 px-4 py-2">Race</td>
                        <td class="border border-gray-300 px-4 py-2">${raceDate.toDateString()}</td>
                        <td class="border border-gray-300 px-4 py-2">${formatTime(race.time)}</td>
                    </tr>
                </tbody>
            </table>`;

    raceDetailsContainer.innerHTML = `
            <div class="relative">
                <img src="images/races/${race.Circuit.Location.locality}.jpg" alt="${race.raceName} Circuit" class="w-full rounded-lg shadow-md mb-6" />
                <h2 class="absolute bottom-0 left-0 bg-red-600 text-white px-4 py-2 font-bold">${race.raceName}</h2>
            </div>
            <p><strong>Date:</strong> ${raceDate.toDateString()}</p>
            <p><strong>Location:</strong> ${race.Circuit.Location.locality}, ${race.Circuit.Location.country}</p>
            ${tableHTML}`;
}

document.addEventListener('DOMContentLoaded', fetchRaceDetails);