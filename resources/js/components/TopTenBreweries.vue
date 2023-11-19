<template>
  <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 w-90 place-items-center mt-20 pb-10">
    <div v-for="(brewery, index) in breweries" :key="index" class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{{ index + 1 }}. {{ brewery.name }}</h2>
        <p>{{ brewery.city }}, {{ brewery.state }}</p>
        <p>Total Likes: <strong>{{ brewery.score }}</strong></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  mounted() {
    this.topTen();
  },
  data() {
    return {
      breweries: [], // init array for all breweries
    }
  },
  methods: {
    async topTen() {
      try {
        const response = await axios.get('http://localhost:8000/api/top-ten-breweries');

        this.breweries = response.data;
        
      } catch (error) {
        console.error('There was an issue making your request:', error);
      }
    },
  },
};
</script>