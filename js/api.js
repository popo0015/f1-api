const baseUrl = 'https://ergast.com/api/f1';

/**
 * Makes an HTTP request to the specified URL and returns the parsed JSON
 * A little extra detail is that it retries up to 3 times until the request officially fails
 * @param url - The URL to fetch data from, appended to the base URL
 * @returns {Promise<any>} A parsed JSON
 * @throws error Throws an error if the request fails after 3 attempts
 */
async function fetchData(url) {
    let attempts = 3;
    while (attempts-- > 0) {
        try {
            const response = await fetch(`${baseUrl}${url}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Attempt failed, retrying... ${attempts}`, error);
            if (attempts <= 0) throw error;
        }
    }
}

/**
 * Fetches a list of drivers for 2024 from the Ergast API
 * @param year - self-explanatory
 */
export async function fetchDriversList(year = 2024) {
    return fetchData(`/${year}/drivers.json`);
}

/**
 * Fetches a list of the driver standings for 2024 from the Ergast API
 * @param year - self-explanatory!
 */
export async function fetchDriverStandings(year = 2024) {
    return fetchData(`/${year}/driverStandings.json`);
}

/**
 * Fetches detailed information about a specific driver from the Ergast API
 * @param driverId - The unique identifier for the driver
 */
export async function fetchDriverDetails(driverId) {
    return fetchData(`/current/drivers/${driverId}.json`);
}

/**
 * Fetches a list of all teams for 2024 from the Ergast API
 * @param year - Again, self-explanatory
 */
export async function fetchConstructorsList(year = 2024) {
    return fetchData(`/${year}/constructors.json`);
}

/**
 * Fetches the race calendar for 2024 from the Ergast API
 * @param year - :)
 */
export async function fetchRaceCalendar(year = 'current') {
    return fetchData(`/${year}.json`);
}

/**
 * Fetches detailed information about a specific race from the Ergast AP
 * @param raceId - The unique identifier for the race
 */
export async function fetchRaceDetails(raceId) {
    return fetchData(`/current/${raceId}.json`);
}

