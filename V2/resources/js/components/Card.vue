<template>
  <div class="card w-96 bg-base-100 shadow-xl mx-auto">
    <figure class="border-b"><img src="https://www.openbrewerydb.org/_app/immutable/assets/obdb-logo.bfe70fda.png" alt="Open Brewery DB logo" /></figure>
    <div class="card-body">
      <h1 class="brewery-name card-title">{{ breweryName }}</h1>
      <p class="brewery-website">{{ breweryWebsite }}</p>
      <p class="brewery-city-state">{{ breweryCityState }}</p>
      <div class="card-actions justify-center mt-3">
        <!-- card buttons -->
        <button class="btn btn-primary btn-feedback" @click="like">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
          </svg>
        </button>
        <button class="btn btn-primary btn-feedback" @click="buttonActions">Show New</button>
        <button class="btn btn-primary btn-feedback" @click="dislike">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
          </svg>
        </button>
      </div>
      <!-- card tags -->
      <div class="card-actions justify-center mt-5">
        <div class="w-full flex justify-center gap-x-2">
          <span>Likes: {{ likes }}</span>
          <span>Dislikes: {{ dislikes }}</span>
        </div>
        <button class="brewery-city badge badge-outline" @click.PREVENT="breweriesByCity">{{ breweryCity }}</button>
        <button class="brewery-type badge badge-outline" @click.PREVENT="breweriesByCityAndType">{{ breweryType }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    breweryName: String,
    breweryWebsite: String,
    breweryCityState: String,
    breweryCity: String,
    breweryState: String,
    breweryType: String,
    breweryId: String,
    likes: Number,
    dislikes: Number
  },
  methods: {
    buttonActions() {
      this.$emit('child-event');

      // hide tables when buttons are clicked
      document.querySelector('.by-prop-table').classList.add('hidden');
    },
    /**
     * Create table rows
     */
    createTableRows(brewery, i , tableBody) {
      const row = tableBody.insertRow();
      const cellNumber = row.insertCell(0);
      const cellName = row.insertCell(1);
      const cellWebsite = row.insertCell(2);
      const cellPhone = row.insertCell(3)

      cellNumber.textContent = i + 1;
      cellName.textContent = brewery.name;
      cellWebsite.textContent = brewery.website_url;
      cellPhone.textContent = brewery.phone;
    },
    /**
     * Get breweries by city
     */
    async breweriesByCity() {
      const city = document.querySelector('.brewery-city');
      // remove hash from city name
      const cityName = city.textContent.replace(/^#/, '');
      document.querySelector('.table-heading').innerHTML = `Breweries in <strong>${cityName}</strong>`;

      try {
        const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries?by_city=${cityName}`);

        const tableBody = document.querySelector('.table-body');
        // clear all before populating
        tableBody.innerHTML = '';

        // populate table
        response.data.forEach((brewery, i) => {
            this.createTableRows(brewery, i, tableBody);
        });

        // show table when brewery-city is clicked
        document.querySelector('.by-prop-table').classList.remove('hidden');

      } catch (error) {
          console.error("There was a problem fetching breweries in the same city:", error);
      }
    },
    /**
     * Get breweries by city and type
     */
    async breweriesByCityAndType() {
      const type = document.querySelector('.brewery-type');
      // remove hash from brewery type name
      const breweryType = type.textContent.replace(/^#/, '');
      const cleanCity = document.querySelector('.brewery-city');
      // remove hash from city name
      const cleanCityName = cleanCity.textContent.replace(/^#/, '');
      document.querySelector('.table-heading').innerHTML = `<strong>${breweryType}</strong>'s in <strong>${cleanCityName}</strong>`;

      try {
        const response = await axios.get(`https://api.openbrewerydb.org/v1/breweries?by_city=${cleanCityName}&by_type=${breweryType}`);

        const tableBody = document.querySelector('.table-body');
        // clear all before populating
        tableBody.innerHTML = '';

        // populate table
        response.data.forEach((brewery, i) => {
            this.createTableRows(brewery, i, tableBody);
        });

        // show table when brewery-type is clicked
        document.querySelector('.by-prop-table').classList.remove('hidden');

      } catch (error) {
          console.error("There was an issue fetching breweries of the same city and type:", error);
      }
    },
    /**
     * like brewery
     */
    async like() {
      try {
        const response = await axios.post('http://localhost:8000/api/like', {
          name: this.breweryName,
          website_url: this.breweryWebsite,
          city: this.breweryCity,
          state: this.breweryState,
          breweryType: this.breweryType,
          brewery_id: this.breweryId,
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
        });

        this.$emit('update-likes', response['data'].likes);
        
      } catch (error) {
        console.error('There was a problem performing this action:', error);
      }
    },
    /**
     * dislike brewery
     */
     async dislike() {
      try {
        const response = await axios.post('http://localhost:8000/api/dislike', {
          name: this.breweryName,
          website_url: this.breweryWebsite,
          city: this.breweryCity,
          state: this.breweryState,
          breweryType: this.breweryType,
          brewery_id: this.breweryId,
        });

        this.$emit('update-dislikes', response['data'].dislikes);
        
      } catch (error) {
        console.error('There was a problem performing this action:', error);
      }
    },
  },
};
</script>