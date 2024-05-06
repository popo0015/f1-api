const urlParams = new URLSearchParams(window.location.search);
const driverId = urlParams.get('driverId');

// Fetch driver data using the driver ID
async function fetchDriverDetails() {
    const apiUrl = `https://ergast.com/api/f1/current/drivers/${driverId}.json`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayDriverDetails(data.MRData.DriverTable.Drivers[0]);
    } catch (error) {
        console.error('Failed to fetch driver details:', error);
    }
}

// Display driver details on the page
function displayDriverDetails(driver) {
    const driverDetailsContainer = document.getElementById('driver-details');

    driverDetailsContainer.innerHTML = `
            <div class="relative">
                <h2 class="absolute bottom-0 left-0 bg-red-600 text-white px-4 py-2 font-bold">${driver.givenName} ${driver.familyName}</h2>
            </div>
            <p><strong>Nationality:</strong> ${driver.nationality}</p>
            <p><strong>Race number:</strong> <span style="font-family: 'Racing Sans One', sans-serif; font-size: 24px;">${driver.permanentNumber}</span></p>
            <p><strong>Born:</strong> ${driver.dateOfBirth}</p>`;
}

document.addEventListener('DOMContentLoaded', fetchDriverDetails);