
  function saveApiKey() {
  const apiKey=document.getElementById("apiKeyInput").value;
  localStorage.setItem("weatherApiKey",apiKey);
  alert("API Key saved successfully!");
}

function quickSearch(city) {
  document.getElementById("searchInput").value=city;
  Search();
}

function Search() {
  let city = document.getElementById("searchInput").value;
  const apiKey = localStorage.getItem("weatherApiKey")||document.getElementById("apiKeyInput").value ;
  fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`)
    .then((res) => res.json())
    .then((data) => {
    // Update UI with weather data
    document.getElementById("name").textContent = data.location.name;
    document.getElementById("region").textContent = data.location.region;
    document.getElementById("country").textContent = data.location.country;
    document.getElementById("lat").textContent = data.location.lat;
    document.getElementById("lon").textContent = data.location.lon;
    document.getElementById("localtime").textContent = data.location.localtime;
    document.getElementById("timezone").textContent = data.location.tz_id;

    document.getElementById("temp_c").textContent = `${data.current.temp_c}°C`;
    document.getElementById("temp_f").textContent = `${data.current.temp_f}°F`;
    document.getElementById("condition_text").textContent = data.current.condition.text;
    document.getElementById("condition_icon").innerHTML = `<img src="${data.current.condition.icon}" alt="${data.current.condition.text}">`;
    document.getElementById("last_updated").textContent = `Last updated: ${data.current.last_updated}`;
    document.getElementById("wind_kph").textContent = data.current.wind_kph;
    document.getElementById("humidity").textContent = data.current.humidity;
    document.getElementById("feelslike_c").textContent = data.current.feelslike_c;
    document.getElementById("pressure_mb").textContent = data.current.pressure_mb;
    });
  document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      document.getElementById("searchButton").click();
    }
  });
}
