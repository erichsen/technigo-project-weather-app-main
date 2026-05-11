"use strict";
function getElement(id) {
    const el = document.getElementById(id);
    if (!el) {
        throw new Error(`Element with id "${id}" not found`);
    }
    return el;
}
// Collect weather data from the OpenWeather API
const API_KEY = '3ce9514a56df72651fc6340df3486d7b';
const city = 'Norrköping,Sweden';
const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=sv&appid=${API_KEY}`)
    .then(response => response.json())
    .then((data) => {
    const cityEl = getElement('city');
    const tempEl = getElement('temperature');
    const descEl = getElement('description');
    const sunriseEl = getElement('sunrise');
    const sunsetEl = getElement('sunset');
    const iconEl = getElement('weather-icon');
    cityEl.textContent = data.name;
    tempEl.textContent = `${data.main.temp.toFixed(1)} °C`;
    const description = data.weather[0].description.charAt(0).toUpperCase() +
        data.weather[0].description.slice(1);
    descEl.textContent = description;
    sunriseEl.textContent = `soluppgång ${formatTime(data.sys.sunrise)}`;
    sunsetEl.textContent = `solnedgång ${formatTime(data.sys.sunset)}`;
    const iconCode = data.weather[0].icon;
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconEl.alt = data.weather[0].description;
})
    .catch(error => {
    console.error('Error fetching weather data:', error);
});
// Fetch forecast data for weatcher forecast
fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`)
    .then(response => response.json())
    .then((data) => {
    const forecastEl = getElement('forecast');
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 4);
    dailyForecasts.forEach(day => {
        const date = new Date(day.dt_txt);
        const weekday = date.toLocaleDateString('sv-SE', {
            weekday: 'short'
        });
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-day');
        forecastItem.innerHTML = `
            <div class="forecast-row">
            <span class="day">${weekday}</span>
            <span class="temp">${Math.round(day.main.temp)}°C</span>
            </div>
            <div class="separator"></div>
        `;
        forecastEl.appendChild(forecastItem);
    });
})
    .catch(error => {
    console.error('Error fetching forecast data:', error);
});
