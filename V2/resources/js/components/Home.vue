<script>
import axios from 'axios';
import Card from './Card.vue';
import BreweriesTable from './BreweriesTable.vue';

export default {
  components: {
    Card,
    BreweriesTable
  },
  data() {
    return {
      breweryName: '',
      breweryWebsite: '',
      breweryCityState: '',
      breweryCity: '',
      breweryState: '',
      breweryType: '',
      breweryId: '',
      // initialize likes and dislikes as 0
      likes: 0,
      dislikes: 0
    };
  },
  mounted() {
    this.randomBrewery();
  },
  methods: {
    async randomBrewery() {
      try {
        const response = await axios.get('http://localhost:8000/api/');

        this.breweryName = response['data'].name;
        this.breweryWebsite = response['data'].website_url;
        this.breweryCity = `#`+response['data'].city;
        this.breweryState = response['data'].state;
        this.breweryCityState = `${this.breweryCity.replace(/^#/, '')}, ${this.breweryState}`;
        this.breweryType = `#`+response['data'].brewery_type;
        this.breweryId = response['data'].id;
        this.likes = response['data'].likes;
        this.dislikes = response['data'].dislikes;

      } catch (error) {
        console.error('There was a problem making your request:', error);
      }
    },
    updateLikes(newLikes) {
      this.likes = newLikes;
    },
    updateDislikes(newDislikes) {
      this.dislikes = newDislikes;
    }
  },
};
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center gap-y-20">
    <Card @child-event="randomBrewery" :breweryName="breweryName" :breweryWebsite="breweryWebsite" :breweryCity="breweryCity" :breweryType="breweryType" :breweryId="breweryId" :breweryCityState="breweryCityState" :breweryState="breweryState" :likes="likes" :dislikes="dislikes" @update-likes="updateLikes" @update-dislikes="updateDislikes" />
    <BreweriesTable />
  </div>
</template>