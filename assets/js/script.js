// variables
const searchCities = [];

// functions
function handleCoords(searchCity) {
    const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

    fetch(fetchUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("error input")
            }
        })
        .then(function (data) {
            handleCurrentWeather(data.coord, data.name);
        }).catch((error) => {
            alert("Please enter a Valid City.")
            console.log(error)
        });
}

function handleCurrentWeather(coordinates, city) {
    const lat = coordinates.lat;
    const lon = coordinates.lon;

    const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

    fetch(fetchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            displayCurrentWeather(data.current, city);
            displayFiveDayWeather(data.daily);
        });
}

function displayCurrentWeather(currentCityData, cityName) {
    let weatherIcon = `https://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;
    // todo: add Wind, humidity, UV index DONT FORGET UNITS
    // create dynamic bg for uv index by adding class based on value of uv
    let uvClass = "low";
    if (currentCityData.uvi > 1 && currentCityData.uvi < 5) {
        uvClass = "medium";
    }
    if (currentCityData.uvi > 5) {
        uvClass = "high";
    }
    document.querySelector("#fiveDayTitle").innerHTML = "5-Day Forecast:";
    document.querySelector("#currentWeather").innerHTML = `<div class="border border-dark pb fw-bold"
    style="
    padding: 5px;
    align-items: center;
    text-align: center;
    border-radius: 1rem;
    background-color: gainsboro;"
    ><h2 style="text-shadow: 3px 2px rgba(255, 255, 255);">${cityName} ${moment.unix(currentCityData.dt).format("MMM Do YY")} <img src="${weatherIcon}"></h2> <div>Temp: ${currentCityData.temp} \xB0F</div><div>Wind Speed: ${currentCityData.wind_speed} MPH</div><div>Humidity: ${currentCityData.humidity} %</div><div class="${uvClass}">UV Index: ${currentCityData.uvi}</div></div>`;
    
    
}

function displayFiveDayWeather(fiveDayCityData) {
    const cityData = fiveDayCityData.slice(1, 6);
    document.querySelector("#fiveDayWeather").innerHTML = "";

    cityData.forEach((day) => {
        let weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        // todo: temp, wind, humidity DONT FORGET UNITS ()
       
        document.querySelector("#fiveDayWeather").innerHTML += `<div class="col-sm m-1 p-2 card"><div class="font-weight-bold">${moment.unix(day.dt).format("MMM Do YY")}</div> <div><img src="${weatherIcon}"></div><div>Temp: ${day.temp.day} \xB0F</div><div class="">Wind: ${day.wind_speed} MPH</div><div class="">Humidity: ${day.humidity} %</div></div>`;
        
    });
}

function handleFormSubmit(event) {
    document.querySelector("#searchHistory").innerHTML = "";
    event.preventDefault();
    const city = document.querySelector("#searchInput").value.trim();
    searchCities.push(city.toUpperCase());
    const filteredCities = searchCities.filter((city, index) => {
        return searchCities.indexOf(city) === index;
    })
    filteredCities.forEach((city) => {
        document.querySelector("#searchHistory").innerHTML += `<button class="w-100 d-block my-2 btn btn-outline-darks" data-city="${city}">${city}</button>`;
    });
    
    handleCoords(city);
}

function handleHistory(event) {
    const city = event.target.getAttribute("data-city");
    handleCoords(city);
}

// listeners
// on page load, show any past cities searched
// search for city
// click on city to show weather
document.querySelector("#searchForm").addEventListener("submit", handleFormSubmit);
document.querySelector("#searchHistory").addEventListener("click", handleHistory);