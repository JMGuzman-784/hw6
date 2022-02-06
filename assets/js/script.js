//gloabl variables
// on page load, show any past cities searched
let searchCities = [];
if (localStorage.getItem("history")) {
    // get searched cities 
    searchCities = localStorage.getItem("history").split(",")
    // display recent searched when page is reloaded into the form html 
}

searchCities.forEach((city) => {
    // adds button to recently searched city
    document.querySelector("#searchHistory").innerHTML += `<button class="w-100 d-block my-2 btn btn-outline-darks" data-city="${city}">${city}</button>`;
});

// functions
function handleCoords(searchCity) {
    // search city using api
    const fetchUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;

    fetch(fetchUrl)
    // grab information form url
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
            // if city is entered incorrectly then an alert will show up to ask to enter correct city
            // an error will also appear into the console
            console.log(error)
        });
}

function handleCurrentWeather(coordinates, city) {
    // grabbing data using lattitude and longitude
    const lat = coordinates.lat;
    const lon = coordinates.lon;

    const fetchUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=4b9f7dc3f8536150bc0eb915e8e4a81b`;
    // obtain information that will be used to display what is need such as temp, wind speed, humidity and uv index
    fetch(fetchUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // data is console logged when information is fetched 
            displayCurrentWeather(data.current, city);
            displayFiveDayWeather(data.daily);
        });
}

function displayCurrentWeather(currentCityData, cityName) {
    let weatherIcon = `https://openweathermap.org/img/wn/${currentCityData.weather[0].icon}.png`;
   
    // create dynamic bg for uv index by adding class based on value of uv
    let uvClass = "low";
    if (currentCityData.uvi > 1 && currentCityData.uvi < 5) {
        uvClass = "medium";
    }
    if (currentCityData.uvi > 5) {
        uvClass = "high";
    }
    document.querySelector("#fiveDayTitle").innerHTML = "5-Day Forecast:";
    // title displayed
    document.querySelector("#currentWeather").innerHTML = `<div class="border border-dark pb fw-bold"
    style="
    padding: 5px;
    align-items: center;
    text-align: center;
    border-radius: 1rem;
    background-color: gainsboro;"
    ><h2 style="text-shadow: 3px 2px rgba(255, 255, 255);">${cityName} ${moment.unix(currentCityData.dt).format("MMM Do YY")} <img src="${weatherIcon}"></h2> <div>Temp: ${currentCityData.temp} \xB0F</div><div>Wind Speed: ${currentCityData.wind_speed} MPH</div><div>Humidity: ${currentCityData.humidity} %</div><div class="${uvClass}">UV Index: ${currentCityData.uvi}</div></div>`;
    // the weather searched for is displayed with information needed
    // styling and classes are added for looks
}

function displayFiveDayWeather(fiveDayCityData) {
    // display the future weather using the api
    const cityData = fiveDayCityData.slice(1, 6);
    document.querySelector("#fiveDayWeather").innerHTML = "";

    cityData.forEach((day) => {
        let weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        // temp, wind, humidity with units
       
        document.querySelector("#fiveDayWeather").innerHTML += `<div class="col-sm m-1 p-2 card"><div class="font-weight-bold">${moment.unix(day.dt).format("MMM Do YY")}</div> <div><img src="${weatherIcon}"></div><div>Temp: ${day.temp.day} \xB0F</div><div class="">Wind: ${day.wind_speed} MPH</div><div class="">Humidity: ${day.humidity} %</div></div>`;
        
    });
}
// process information 
function handleFormSubmit(event) {
    document.querySelector("#searchHistory").innerHTML = "";
    // creates search button and allows to function to search for cities
    event.preventDefault();
    const city = document.querySelector("#searchInput").value.trim();
    // city entered into 'form'
    searchCities.push(city.toUpperCase());
    const filteredCities = searchCities.filter((city, index) => {
        return searchCities.indexOf(city) === index;
    })
    filteredCities.forEach((city) => {
        // creates a button for every city searched
        document.querySelector("#searchHistory").innerHTML += `<button class="w-100 d-block my-2 btn btn-outline-darks" data-city="${city}">${city}</button>`;
    });
    // added searched city to local storage 
    localStorage.setItem("history", filteredCities);
    
    handleCoords(city);
}

function handleHistory(event) {
    const city = event.target.getAttribute("data-city");
    handleCoords(city);
}

// listeners

// search for city
// click on city to show weather
document.querySelector("#searchForm").addEventListener("submit", handleFormSubmit);
document.querySelector("#searchHistory").addEventListener("click", handleHistory);
