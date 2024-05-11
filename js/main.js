import {
    fetchDriversList,
    fetchDriverDetails,
    fetchConstructorsList,
    fetchRaceCalendar,
    fetchRaceDetails,
    fetchDriverStandings
} from './api.js';

/**
 * Handles the displaying of an error message on the page
 * @param error - The error object containing the message to display
 */
function displayError(error) {
    const errorElement = document.createElement('p');
    errorElement.textContent = `Failed to load data: ${error.message}`;
    errorElement.className = 'text-red-500 text-xl';
    document.body.appendChild(errorElement);
}

/**
 * Loads both the drivers and the driver standings for 2024 and sorts the drivers by place
 * @param year - 2024 ;)
 */
async function fetchAndDisplaySortedDrivers(year = 2024) {
    try {
        const [driversData, standingsData] = await Promise.all([
            fetchDriversList(year),
            fetchDriverStandings(year)
        ]);

        const drivers = driversData.MRData.DriverTable.Drivers;
        const standings = standingsData.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        const driversWithStandings = drivers.map(driver => {
            const standing = standings.find(s => s.Driver.driverId === driver.driverId);
            return {
                ...driver,
                position: standing ? standing.position : 'N/A',
                points: standing ? standing.points : '0'
            };
        });

        driversWithStandings.sort((a, b) => a.position - b.position);

        displayDrivers(driversWithStandings);
    } catch (error) {
        console.error('Failed to fetch or process data', error);
        displayError(error);
    }
}

/**
 * Renders a list of all drivers racing in 2024 on the page. Each driver is displayed with their name, nationality, and their card is a link to their detailed view - drivers-show
 * @param drivers - Has a sorted list of the drivers and their personal information
 */
function displayDrivers(drivers) {
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 p-4';
    document.body.appendChild(container);

    drivers.forEach((driver, index) => {
        const card = document.createElement('a');
        card.href = `driver-show.html?driverId=${driver.driverId}`;
        card.className = "flex flex-wrap rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition duration-300 ease-in-out bg-black text-white m-2 p-4 hover:shadow-xl";
        card.style = "background-image: url('https://hellof1.netlify.app/img/background.1bf89f69.png');";
        card.innerHTML = `
                        <div class="flex-grow p-4 z-10">
                            <h3 class="text-xl font-bold text-yellow-300">${index + 1}. ${driver.givenName} ${driver.familyName}</h3>
                            <p class="text-gray-400">${driver.points} Points</p>
                        </div>
                        <div class="absolute m-0 right-0 top-0 bottom-0 w-1/3 z-0" style="
                        background-image: url('/images/f1_cartoon_logo.png');
                        background-size: cover;
                        background-repeat: no-repeat;
                        background-position: right center;
                        height: 100%;"></div>`;

        container.appendChild(card);
    });
}

/**
 * Renders a list of some information regarding the driver clicked on. It shows their name, nationality, race number, date of birth
 * @param driver - The object containing an array of all the info about the driver from the Ergast API
 */
function displayDriverDetails(driver) {
    const driverDetailsContainer = document.getElementById('driver-details');
    driverDetailsContainer.className = 'mt-8 p-4 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg';

    driverDetailsContainer.innerHTML = `
        <div class="flex flex-col md:flex-row items-center space-x-4">
            <img src="/path/to/driverImage.jpg" alt="Profile Image" class="rounded-full w-48 h-48 shadow-lg">
            <div>
                <h2 class="text-2xl font-bold text-white mb-2">${driver.givenName} ${driver.familyName}</h2>
                <p><strong>Nationality:</strong> ${driver.nationality}</p>
                <p><strong>Race number:</strong> ${driver.permanentNumber}</p>
                <p><strong>Points:</strong> ${driver.points || 'N/A'}</p>
                <p><strong>Born:</strong> ${driver.dateOfBirth}</p>
                <!-- Add more details here -->
            </div>
        </div>`;
}

/**
 * Renders a list of all teams racing in 2024 on the page. Each team is displayed with their name, nationality, and their card is a link to the teams' wiki page
 * @param data - The object containing an array of teams from the Ergast API
 */
function displayConstructorsList(data) {
    const constructors = data.MRData.ConstructorTable.Constructors;
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 p-4';
    constructors.forEach(constructor => {
        const card = document.createElement('div');
        card.className = "flex flex-wrap rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition duration-300 ease-in-out bg-black text-white m-2 p-4 hover:shadow-xl";
        card.style = "background-image: url('https://hellof1.netlify.app/img/background.1bf89f69.png');";

        const constructorLink = document.createElement('a');
        constructorLink.href = constructor.url;
        constructorLink.appendChild(card);

        card.innerHTML = `<div class="flex-grow p-4 z-10">
                            <h3 class="text-xl font-bold text-yellow-300">${constructor.name}</h3>
                            <p class="text-gray-400">${constructor.nationality}</p>
                        </div>
                        <div class="absolute m-0 right-0 top-0 bottom-0 w-1/3 z-0" style="
                        background-image: url('/images/f1_cartoon_logo.png');
                        background-size: cover;
                        background-repeat: no-repeat;
                        background-position: right center;
                        height: 100%;"></div>`;

        container.appendChild(constructorLink);
    });

    document.body.appendChild(container);
}

/**
 * Renders a list of all races scheduled in 2024 on the page. Each race is displayed with their GP name, date planned and their card is a link to their detailed view - race-show
 * @param data - The object containing an array of the races from the Ergast API
 */
function displayRaceCalendar(data) {
    const races = data.MRData.RaceTable.Races;
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 p-4';
    races.forEach(race => {
        const card = document.createElement('div');
        card.className = "flex flex-wrap rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition duration-300 ease-in-out bg-black text-white m-2 p-4 hover:shadow-xl";
        card.style = "background-image: url('https://hellof1.netlify.app/img/background.1bf89f69.png');";

        const raceLink = document.createElement('a');
        raceLink.href = `races-show.html?raceId=${race.round}`;
        raceLink.appendChild(card);

        card.innerHTML = `<div class="flex-grow p-4 z-10">
                            <h3 class="text-xl font-bold text-yellow-300">${race.raceName}</h3>
                            <p class="text-gray-400">${race.date}</p>
                        </div>
                        <div class="absolute m-0 right-0 top-0 bottom-0 w-1/3 z-0" style="
                        background-image: url('/images/f1_cartoon_logo.png');
                        background-size: cover;
                        background-repeat: no-repeat;
                        background-position: right center;
                        height: 100%;"></div>`;

        container.appendChild(raceLink);
    });

    document.body.appendChild(container);
}

/**
 * Renders a list of all detailed information about the clicked race. It shows the GP name, location and a table with all scheduled practice sessions, sprints, qualifying and race and their according date and time
 * @param race - The object containing an array of all the info about the team from the Ergast API
 */
function displayRaceDetails(race) {
    const raceDetailsContainer = document.getElementById('race-details');
    const raceDate = new Date(race.date);

    function formatTime(timeString) {
        const timeParts = timeString.split(':');
        return `${timeParts[0]}:${timeParts[1]}`;
    }

    const tableHTML = `
            <table class="border-collapse border border-gray-300 mt-6 mb-10 w-full">
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
                <img src="/images/races/${race.Circuit.Location.locality}.jpg" alt="${race.raceName} Circuit" class="w-full rounded-lg shadow-md mb-6" />
                <h2 class="absolute bottom-0 left-0 bg-red-600 text-white px-4 py-2 font-bold">${race.raceName}</h2>
            </div>
            <p><strong>Date:</strong> ${raceDate.toDateString()}</p>
            <p><strong>Location:</strong> ${race.Circuit.Location.locality}, ${race.Circuit.Location.country}</p>
            ${tableHTML}`;
}


/**
 * What starts everything - depending on the path/what html file is opened, the needed function will be called to fetch and display data from Ergast API
 */
document.addEventListener('DOMContentLoaded', async () => {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    try {
        if (path.includes('drivers.html')) {
            fetchAndDisplaySortedDrivers(2024);
        } else if (path.includes('driver-show.html')) {
            const driverId = urlParams.get('driverId');
            const data = await fetchDriverDetails(driverId);
            displayDriverDetails(data.MRData.DriverTable.Drivers[0]);
        } else if (path.includes('teams.html')) {
            const data = await fetchConstructorsList();
            displayConstructorsList(data);
        } else if (path.includes('races.html')) {
            const data = await fetchRaceCalendar();
            displayRaceCalendar(data);
        } else if (path.includes('races-show.html')) {
            const raceId = urlParams.get('raceId');
            const data = await fetchRaceDetails(raceId);
            displayRaceDetails(data.MRData.RaceTable.Races[0]);
        }
    } catch (error) {
        let attempts = 3;
        while (attempts-- > 0) {
            try {
                const response = await fetch(`${baseUrl}${url}`);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return await response.json();
            } catch (error) {
                displayError(error);
            }
        }
    }
});
