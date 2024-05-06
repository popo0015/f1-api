async function fetchRaceCalendar() {
    const apiUrl = 'https://ergast.com/api/f1/current.json';
    let attempts = 3;

    while (attempts-- > 0) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            displayRaceCalendar(data);
            return;
        } catch (error) {
            console.error(`Attempt failed, retrying... ${attempts}`, error);
            if (attempts <= 0) displayError(error);
        }
    }
}

function displayRaceCalendar(data) {
    const races = data.MRData.RaceTable.Races;
    const container = document.createElement('div');
    container.className = 'space-y-4';

    races.forEach(race => {
        const card = document.createElement('div');
        card.className = "flex flex-wrap rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out bg-black text-white relative flex m-7 hover:shadow-xl  Z-8 bg-center";
        card.style = "background-image: url('https://hellof1.netlify.app/img/background.1bf89f69.png');";

        const raceLink = document.createElement('a');
        raceLink.href = `races-show.html?raceId=${race.round}`;
        raceLink.appendChild(card);

        card.innerHTML = `<div class="flex-grow p-4 z-10">
            <h3 class="text-xl font-bold text-yellow-300">${race.raceName}</h3>
            <p class="text-gray-400">${race.date}</p>
        </div>
            <div class="absolute m-0 right-0 top-0 bottom-0 w-1/3 z-0" style="
            background-image: url('images/f1_cartoon_logo.png');
            background-size: cover;
            background-repeat: no-repeat;
            background-position: right center;
            height: 100%;"></div>`;

        container.appendChild(raceLink);
    });

    document.body.appendChild(container);
}

function displayError(error) {
    const errorElement = document.createElement('p');
    errorElement.textContent = `Failed to load data: ${error.message}`;
    errorElement.className = 'text-red-500 text-xl';
    document.body.appendChild(errorElement);
}

document.addEventListener('DOMContentLoaded', fetchRaceCalendar);