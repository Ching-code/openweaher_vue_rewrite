<script setup>
import { ref, computed } from 'vue'
import getCityCoordinates from '@/api/getCityCoordinates'
import getWeatherDetails from '@/api/getWeatherDetails'
import getUserLocation from '@/api/getUserLocation'

import WeatherCard from '@/components/WeatherCard.vue'

const countries = ['Taipei', 'Taichung', 'Tainan']
const countryInput = ref('')
const weatherDetails = ref([])
const selectedCountryName = ref('')

const handleCoordinate = async (city) => {
  if (!countryInput.value) return

  try {
    const res = await getCityCoordinates(city)
    if (!res.length) return alert('找不到城市')

    const { name, lat, lon } = res[0]
    selectedCountryName.value = name
    handleWeatherDetails(lat, lon)
  } catch (error) {
    alert(`發生錯誤: ${error.message}`)
  }
}

const handleWeatherDetails = async (lat, lon) => {
  try {
    weatherDetails.value = await getWeatherDetails(lat, lon)
  } catch (error) {
    alert(`發生錯誤: ${error.message}`)
  }
}

const handleUserLocation = () => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords
      try {
        const res = await getUserLocation(latitude, longitude)
        if (!res.length) return alert('找不到城市')
        selectedCountryName.value = res[0].name
        handleWeatherDetails(latitude, longitude)
      } catch (error) {
        alert(`無法取得位置資訊 ${error.message}`)
      }
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert('請開啟定位權限')
      }
    }
  )
}

const forecastDaysFilter = computed(() => {
  if (!weatherDetails.value || !weatherDetails.value.list) return []
  const uniqueDayList = []
  return weatherDetails.value.list.filter((forecast) => {
    const date = new Date(forecast.dt_txt).getDate()
    if (!uniqueDayList.includes(date)) {
      uniqueDayList.push(date)
      return true
    }
    return false
  })
})

const currentDay = computed(() => {
  if (!forecastDaysFilter.value) return {}
  return forecastDaysFilter.value[0]
})

const fiveDaysForecast = computed(() => {
  if (!forecastDaysFilter.value) return {}
  return forecastDaysFilter.value.slice(1)
})
</script>

<template>
  <header>
    <h1>天氣查詢</h1>
  </header>
  <div class="main container">
    <div class="weather-input">
      <label for="countryInput">輸入要查詢的城鎮: </label>
      <input
        type="text"
        v-model="countryInput"
        list="countries"
        name="countryInput"
        id="countryInput"
      />
      <datalist id="countries">
        <option v-for="country in countries" :key="country">{{ country }}</option>
      </datalist>
      <div class="btn-box">
        <button class="search-btn" @click="handleCoordinate(countryInput)">查詢</button>
        <button class="location-btn" @click="handleUserLocation">根據位置獲取</button>
      </div>
    </div>
    <div v-if="currentDay" class="currentWeather">
      <WeatherCard :title="selectedCountryName" :data="currentDay" iconSize="4x"></WeatherCard>
    </div>
    <div v-if="fiveDaysForecast.length > 0" class="forecastWeather">
      <h2>未來五天預測</h2>
      <ul class="weather-cards">
        <li class="card-item" v-for="day in fiveDaysForecast" :key="day.dt_txt">
          <WeatherCard :title="day.dt_txt.split(' ')[0]" :data="day" iconSize="2x"></WeatherCard>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
header {
  text-align: center;
  background-color: #5bb9df;
  color: #fff;
  padding: 10px;
}

.weather-input {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 20px;
  justify-content: center;
  align-items: center;
}
.weather-input input {
  flex: 1;
  padding: 5px 10px;
  margin: 0 10px;
  border: 1px solid #000;
}
.weather-input .btn-box {
  flex: 1;
  display: flex;
  gap: 10px;
}
.weather-input .search-btn,
.weather-input .location-btn {
  flex: 1;
  min-width: 60px;
  border: none;
  padding: 5px 10px;
  font-size: 1rem;
  background-color: #5bb9df;
  color: #fff;
  border-radius: 1rem;
  cursor: pointer;
}
.weather-input .search-btn:hover,
.weather-input .location-btn:hover {
  opacity: 0.8;
}

.currentWeather {
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
}

.forecastWeather {
  margin: 20px;
}
.forecastWeather h2 {
  margin: 10px 0;
}
.weather-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
.card-item {
  flex: 1 0 300px;
}
</style>
