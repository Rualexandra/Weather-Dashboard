function kelvinToFahrenheit(kelvin) {
  return (((kelvin - 273.15) * 9) / 5 + 32).toFixed(2);
}

function formatWeatherData(data) {
  // Format the weather data for display
  const city = data.city.name;
  const currentDate = new Date().toLocaleDateString();
  const currentWeather = data.list[0];
  const currentTemp = kelvinToFahrenheit(currentWeather.main.temp); // Convert temperature to Fahrenheit
  const currentHumidity = currentWeather.main.humidity;
  const currentWindSpeed = currentWeather.wind.speed;
  const iconCode = currentWeather.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

  let forecastHTML = "";
  const forecastsByDay = {};
  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!(date in forecastsByDay)) {
      forecastsByDay[date] = item;
    }
  });

  Object.values(forecastsByDay).forEach((item) => {
    const forecastDate = new Date(item.dt * 1000).toLocaleDateString();
    const forecastTemp = kelvinToFahrenheit(item.main.temp); // Convert temperature to Fahrenheit
    const forecastHumidity = item.main.humidity;
    const forecastWindSpeed = item.wind.speed;
    const forecastIconCode = item.weather[0].icon;
    const forecastIconUrl = `http://openweathermap.org/img/w/${forecastIconCode}.png`;

    forecastHTML += `
      <div>
        <p>Date: ${forecastDate}</p>
        <img src="${forecastIconUrl}" alt="Weather Icon">
        <p>Temperature: ${forecastTemp}°F</p>
        <p>Humidity: ${forecastHumidity}%</p>
        <p>Wind Speed: ${forecastWindSpeed} mph</p>
      </div>
    `;
  });

  return `
    <h2>${city}</h2>
    <p>Date: ${currentDate}</p>
    <img src="${iconUrl}" alt="Weather Icon">
    <p>Temperature: ${currentTemp}°F</p>
    <p>Humidity: ${currentHumidity}%</p>
    <p>Wind Speed: ${currentWindSpeed} mph</p>
    <h3>5-Day Forecast:</h3>
    <div>${forecastHTML}</div>
  `;
}

function searchCity() {
  const apiKey = "6ea7e3c8ababf9459ccde0faaeb7181e";
  const city = document.getElementById("city").value;

  // Use the Geocoding API to get the latitude and longitude of the city
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Update the #weather-data element with the weather forecast data
      document.getElementById("weather-data").innerHTML =
        formatWeatherData(data);

      // Save the searched city to local storage
      const searchHistory =
        JSON.parse(localStorage.getItem("searchHistory")) || [];
      if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        displaySearchHistory(searchHistory);
      }
    })
    .catch((error) => console.error("Error fetching city data:", error));
}

function displaySearchHistory(history) {
  // Display the search history in the #searched-cities element
  document.getElementById("searched-cities").innerHTML = history
    .map((city) => `<div onclick="searchHistoryCity('${city}')">${city}</div>`)
    .join("");
}

function searchHistoryCity(city) {
  // Display the weather forecast for the selected city
  document.getElementById("city").value = city;
  searchCity();
}

// Load the search history from localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  displaySearchHistory(searchHistory);
});
