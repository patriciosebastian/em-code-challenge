// Get random brewery from Open Brewery DB
const randomBrewery = async () => {
  try {
    const response = await fetch("https://api.openbrewerydb.org/v1/breweries/random", {
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
    const data = await response.json();

    // display brewery details
    document.querySelector('.brewery-name').textContent = data[0].name;
    document.querySelector('.brewery-website').textContent = data[0].website_url;
    document.querySelector('.brewery-city-state').textContent =`${data[0].city}, ${data[0].state}`;
    document.querySelector('.brewery-city').textContent = `#${data[0].city}`;
    document.querySelector('.brewery-type').textContent = `#${data[0].brewery_type}`;

  } catch (error) {
    console.error("There was a problem fetching random brewery:", error);
  }
};
randomBrewery();

// Get another random brewery on main buttons click
const mainButtons = document.querySelectorAll('.btn-feedback');
mainButtons.forEach(button => {
    button.addEventListener('click', randomBrewery);
    // hide tables when buttons are clicked
    document.querySelector('.by-prop-table').classList.add('hidden');
});

// Create table rows
const createTableRows = (brewery, i, tableBody) => {
    const row = tableBody.insertRow();
    const cellNumber = row.insertCell(0);
    const cellName = row.insertCell(1);
    const cellWebsite = row.insertCell(2);
    const cellPhone = row.insertCell(3)

    cellNumber.textContent = i + 1;
    cellName.textContent = brewery.name;
    cellWebsite.textContent = brewery.website_url;
    cellPhone.textContent = brewery.phone;
};

// Find other breweries that share data with the currently shown random brewery
const breweriesByCity = async () => {
    const city = document.querySelector('.brewery-city');
    // remove hash from city name
    const cityName = city.textContent.replace(/^#/, '');
    document.querySelector('.table-heading').innerHTML = `Breweries in <strong>${cityName}</strong>`;

    try {
        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${cityName}`);
        const data = await response.json();

        const tableBody = document.querySelector('.table-body');
        // clear all before populating
        tableBody.innerHTML = '';

        // populate table
        data.forEach((brewery, i) => {
            createTableRows(brewery, i, tableBody);
        });

        // show table when brewery-city is clicked
        document.querySelector('.by-prop-table').classList.remove('hidden');

    } catch (error) {
        console.error("There was a problem fetching breweries in the same city:", error);
    }
};

// Fire breweriesByCity func on brewery-city button click
const breweryCityButton = document.querySelector('.brewery-city');
breweryCityButton.addEventListener('click', breweriesByCity);

// Find other breweries of the same type in the same city
const breweriesByCityAndType = async () => {
    const type = document.querySelector('.brewery-type');
    // remove hash from brewery type name
    const breweryType = type.textContent.replace(/^#/, '');
    const cleanCity = document.querySelector('.brewery-city');
    // remove hash from city name
    const cleanCityName = cleanCity.textContent.replace(/^#/, '');
    document.querySelector('.table-heading').innerHTML = `<strong>${breweryType}</strong>'s in <strong>${cleanCityName}</strong>`;

    try {
        const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${cleanCityName}&by_type=${breweryType}`);
        const data = await response.json();

        const tableBody = document.querySelector('.table-body');
        // clear all before populating
        tableBody.innerHTML = '';

        // populate table
        data.forEach((brewery, i) => {
            createTableRows(brewery, i, tableBody);
        });

        // show table when brewery-type is clicked
        document.querySelector('.by-prop-table').classList.remove('hidden');

    } catch (error) {
        console.error("There was an issue fetching breweries of the same city and type:", error);
    }
}

// Fire breweriesByCityAndType func on brewery-type button click
const breweryTypeButton = document.querySelector('.brewery-type');
breweryTypeButton.addEventListener('click', breweriesByCityAndType);