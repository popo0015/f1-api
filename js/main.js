import {
    fetchDriversList,
    fetchDriverDetails,
    fetchConstructorsList,
    fetchRaceCalendar,
    fetchDriverStandings
} from './api.js';

import { renderDrivers, renderConstructors, renderRaceCalendar, displayError, renderRaceDetails, renderDriverDetails } from './render.js';

// Handle the routing and page-specific data fetching.
function init() {
    const page = window.location.pathname;
    // Different logic depending on the page
    if (page.includes('drivers.html')) {
        fetchAndDisplaySortedDrivers();
    } else if (page.includes('teams.html')) {
        fetchAndDisplayConstructors();
    } else if (page.includes('races.html')) {
        fetchAndDisplayRaceCalendar();
    } else if (page.includes('driver-show.html')) {
        fetchAndDisplayDeriverIndividual();
    }
}

/**
 * Fetch and display sorted drivers based on the latest driver standings.
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

        renderDrivers(driversWithStandings);
    } catch (error) {
        console.error('Failed to fetch or process data', error);
        displayError(error);
    }
}

/**
 * Fetch and render constructor teams racing in 2024.
 */
async function fetchAndDisplayConstructors() {
    try {
        const constructorsData = await fetchConstructorsList(2024);
        renderConstructors(constructorsData);
    } catch (error) {
        console.error('Failed to fetch constructors', error);
        displayError(error);
    }
}

/**
 * Fetch and render the race calendar for 2024.
 */
async function fetchAndDisplayRaceCalendar() {
    try {
        const raceData = await fetchRaceCalendar(2024);
        renderRaceCalendar(raceData);
    } catch (error) {
        console.error('Failed to fetch race calendar', error);
        displayError(error);
    }
}

/**
 * Fetch and render the driver details.
 */
async function fetchAndDisplayDeriverIndividual() {
    const urlParams = new URLSearchParams(window.location.search);
    try {
        const driverId = urlParams.get('driverId');
        const driver = await fetchDriverDetails(driverId);
        renderDriverDetails(driver);
    } catch (error) {
        console.error('Failed to fetch driver details', error);
        displayError(error);
    }
}

init();
