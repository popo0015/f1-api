import { getRaceStatusTag, getFormattedDate } from './utils.js';

/**
 * Renders a list of drivers on the page.
 * @param {Array} drivers - List of driver data objects.
 */
export function renderDrivers(drivers) {
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 p-4 animate-fadeIn';
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
            <div class="absolute m-0 right-0 top-0 bottom-0 w-1/3 z-0" style="background-image: url('/images/f1_cartoon_logo.png'); background-size: cover; background-repeat: no-repeat; background-position: right center; height: 100%;"></div>`;

        container.appendChild(card);
    });
}

/**
 * Renders the list of constructors (teams) on the page.
 * @param {Object} data - The constructor data.
 */
export function renderConstructors(data) {
    const constructors = data.MRData.ConstructorTable.Constructors;
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 p-4 animate-fadeIn';
    constructors.forEach(constructor => {
        const card = document.createElement('div');
        card.className = "flex flex-wrap rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition duration-300 ease-in-out bg-black text-white m-2 p-4 hover:shadow-xl";
        card.style = "background-image: url('https://hellof1.netlify.app/img/background.1bf89f69.png');";

        const constructorLink = document.createElement('a');
        constructorLink.href = constructor.url;
        constructorLink.appendChild(card);

        card.innerHTML = `
            <div class="flex-grow p-4 z-10">
                <h3 class="text-xl font-bold text-yellow-300">${constructor.name}</h3>
                <p class="text-gray-400">${constructor.nationality}</p>
            </div>
            <div class="absolute m-0 right-0 top-0 bottom-0 w-1/3 z-0" style="background-image: url('/images/f1_cartoon_logo.png'); background-size: cover; background-repeat: no-repeat; background-position: right center; height: 100%;"></div>`;

        container.appendChild(constructorLink);
    });

    document.body.appendChild(container);
}

/**
 * Renders the race calendar on the page.
 * @param {Object} data - The race data.
 */
export function renderRaceCalendar(data) {
    const races = data.MRData.RaceTable.Races;
    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 p-4 animate-fadeIn';

    const currentDate = new Date();
    let isNextRace = false;

    races.forEach(race => {
        const raceDate = new Date(race.date);
        const card = document.createElement('div');
        card.className = "flex flex-wrap rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition duration-300 ease-in-out bg-black text-white m-2 p-4 hover:shadow-xl relative";
        card.style = "background-image: url('https://hellof1.netlify.app/img/background.1bf89f69.png');";

        const raceLink = document.createElement('a');
        raceLink.href = `races-show.html?raceId=${race.round}`;
        raceLink.appendChild(card);

        const statusTag = getRaceStatusTag(raceDate, currentDate, isNextRace);

        card.innerHTML = `
            <div class="flex-grow p-4 z-10 relative">
                <h3 class="text-xl font-bold text-yellow-300">${race.raceName.replace('Grand Prix', 'GP')}</h3>
                <p class="text-gray-400">${getFormattedDate(race.date)}</p>
                <div class="mt-2">${statusTag}</div>
            </div>
            <div class="absolute m-0 right-0 top-0 bottom-0 w-1/3 z-10" style="background-image: url('/images/f1_cartoon_logo.png'); background-size: contain; background-repeat: no-repeat; background-position: center; height: 100%;"></div>`;

        container.appendChild(raceLink);
    });

    document.body.appendChild(container);
}

/**
 * Displays an error message if data fails to load.
 * @param {Object} error - The error to display.
 */
export function displayError(error) {
    const errorElement = document.createElement('p');
    errorElement.textContent = `Failed to load data: ${error.message}`;
    errorElement.className = 'text-red-500 text-xl';
    document.body.appendChild(errorElement);
}

/**
 * Renders the detailed driver information on their individual page.
 * @param {Object} driver - Driver data object.
 */
export function renderDriverDetails(driverData) {
    const driver = driverData.MRData.DriverTable.Drivers[0];
    
    console.log(driver);
    const driverDetailsContainer = document.getElementById('driver-details');
    driverDetailsContainer.className = 'mt-8 p-4 bg-black bg-opacity-90 rounded-lg shadow-lg flex flex-row items-center space-x-4 animate-fadeIn';

    driverDetailsContainer.innerHTML = `
        <div class="flex-shrink-0">
            <img width="128" height="128" src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/128/external-driver-motor-sports-flaticons-lineal-color-flat-icons-9.png" alt="Driver Icon"/>
        </div>
        <div class="flex-grow">
            <h2 class="text-2xl font-bold text-yellow-300 mb-2">${driver.givenName} ${driver.familyName}</h2>
            <p class="text-gray-400"><strong>Nationality:</strong> ${driver.nationality}</p>
            <p class="text-gray-400"><strong>Race number:</strong> ${driver.permanentNumber}</p>
            <p class="text-gray-400"><strong>Born:</strong> ${driver.dateOfBirth}</p>
        </div>`;
}

// Function to render race details
export function renderRaceDetails(raceData) {
    const raceContainer = document.getElementById('raceDetails'); // Example element
    raceContainer.innerHTML = `
        <h2>${raceData.raceName}</h2>
        <p>Date: ${raceData.date}</p>
        <p>Location: ${raceData.location}</p>
        <p>Winner: ${raceData.winner}</p>
    `;
}