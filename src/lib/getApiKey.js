export const getApiKey = () => {
  const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY
  return api_key
}
