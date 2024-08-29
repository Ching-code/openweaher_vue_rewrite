<template>
  <div v-if="data" class="weather-card">
    <div class="info">
      <h2>{{ props.title }}</h2>
      <p>氣溫: {{ (props.data.main.temp - 273.15).toFixed(2) }} &#176;&#67;</p>
      <p>風速: {{ props.data.wind.speed }} M/S</p>
      <p>濕度: {{ props.data.main.humidity }} %</p>
    </div>
    <div class="icon">
      <img
        :src="`https://openweathermap.org/img/wn/${data.weather[0].icon}@${iconSize}.png`"
        alt=""
      />
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String
  },
  data: {
    type: Object,
    required: true
  },
  iconSize: {
    type: String,
    default: '2x'
  }
})
</script>
<style scoped>
.weather-card {
  flex: 1;
  padding: 20px;
  border-radius: 1rem;
  background-color: #88d7dd;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
