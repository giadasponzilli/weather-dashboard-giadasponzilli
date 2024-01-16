/* User Story
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly

Acceptance Criteria
Create a weather dashboard with form inputs.
When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
When a user views the current weather conditions for that city they are presented with:
The city name
The date
An icon representation of weather conditions
The temperature
The humidity
The wind speed
When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
The date
An icon representation of weather conditions
The temperature
The humidity
When a user click on a city in the search history they are again presented with current and future conditions for that city
 */



const apiURL = `https://api.openweathermap.org/data/2.5/weather?`;
// API key
const APIKey = "0e30f3273392b0602beedb3cf58693bd";
let citiesNames = [];


userInputApi();

// Main function to get the data from the API and calls other functions.
function userInputApi() {

    $("#search-form").on("submit", function (e) {
        e.preventDefault();

        let userInputCity = $("#search-input").val().trim();

        // URL we need to query the database
        let queryURL = `${apiURL}q=${userInputCity}&appid=${APIKey}`;

        // This queryURL grabs the coordinates of the specified city to use in the newQueryUrl and then we grab the data from the newQueryUrl. This is beacuse the queryURL system of getting data from the website is deprecated.

        // Create a Fetch call
        fetch(queryURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {

                // Added metric parameter to use Celsius Degree
                const newQueryUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&appid=${APIKey}`;

                fetch(newQueryUrl)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (data) {
                        // console.log(data)

                        todayWeather(data)

                        // If the the user inputs a new city name in the search field, the code pushes the cityName in the array citiesNames and it calls the renderButton function to create a new button and finally saves the search in local storage.
                        const cityName = data.name;

                        if (!citiesNames.includes(cityName)) {

                            citiesNames.push(cityName);

                            renderButton(cityName);

                            saveToLocalStorage();
                        }

                        // Clearing the search input field from previous search
                        $(`#search-input`).val(``);

                    })

                    .catch(function (error) {
                        console.error('Error during fetch:', error);
                    })

                // console.log('query: ', newQueryUrl)

                forecast(data)
            })
            .catch(function (error) {
                console.error('Error during fetch:', error);
            });
    })
}

// I didn't manage to get this working
// $(document).on("click", ".buttonCity", function (cityName) {
//     todayWeather(cityName);
//     forecast(cityName);
// });

// This function creates buttons for each search
function renderButton(cityName) {
    const createButton = $("<button class = buttonCity>").text(`${cityName}`);
    $(`#history`).append(createButton);
}

function saveToLocalStorage() {
    localStorage.setItem(`citiesNames`, JSON.stringify(citiesNames));
}

// This function retrives info from local storage, so if the user refreshes the page the previous buttons persist.
function loadFromLocalStorage() {
    const storedCities = localStorage.getItem('citiesNames');
    if (storedCities) {
        citiesNames = JSON.parse(storedCities);
        for (let i = 0; i < citiesNames.length; i++) {
            renderButton(citiesNames[i]);
        }
    }
}
loadFromLocalStorage();

// Function for today weather info, includes city info, date, icon, temperature, wind and humidity.
function todayWeather(data) {

     // .empty() method ensures that the today id is clear from the previous city info.
    $(`#today`).empty();
    // INFO about city, date, icon and current temperature, wind, humidity.
    const todayContainer = $(`<div class = todayContainerDiv>`)
    const todayCity = $(`<h2>`).text(data.name);
    const todayDate = dayjs().format(` (D/MM/YYYY)`);
    const iconWeather = $(`<img class = imgIconForecast>`).attr(`src`, `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    $(`#today`).append(todayContainer);
    todayContainer.append(todayCity);
    todayCity.append(todayDate, iconWeather);

    const todayCityTemp = $(`<div class = temp>`).text(`Temp: ${data.main.temp}° C`);
    const todayCityWind = $(`<div class = wind>`).text(`Wind: ${data.wind.speed} KPH`);
    const todayCityHumidity = $(`<div class = humidity>`).text(`Humidity: ${data.main.humidity}%`);
    todayContainer.append(todayCityTemp, todayCityWind, todayCityHumidity);
}


// Function for 5-day weather forecast, showing info about date, icon, temperature, wind and humidity.
function forecast(data) {

    // .empty() method ensures that the forecast id is clear from the previous city info.
    $(`#forecast`).empty();

    const fiveDaysQueryUrl = `https://api.openweathermap.org/data/2.5/forecast/?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&cnt=40&appid=${APIKey}`


    fetch(fiveDaysQueryUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (newData) {
            // console.log(newData)

            $(`#forecastTitle`).empty();

            const forecastText = $(`<h4>`).text(`5-Day Forecast:`);
            $(`#forecastTitle`).append(forecastText);

            // Adding one day to each new card of the loop
            let forecastDatePlus24 = dayjs().add(1, `day`);

            // The API gets data every 3rd hour during the next 5 days (each day is made of 8 objects (24/3)). The cnt parameter is set to 40 limits to get info for the next 5 days (5*8). 
            // The loop iterates trough the newData.list for increment of 8 to get info for 24h after the day before.
            for (let i = 7; i < newData.list.length; i += 8) {
                const divCard = $(`<div class = card>`);
                const divCardBody = $(`<div class="card-body">`);

                const pForecastDatePlus24 = $(`<h5>`).text(forecastDatePlus24.format(`D/MM/YYYY`));

                forecastDatePlus24 = forecastDatePlus24.add(1, `day`);

                const forecastIcon = $(`<img class = imgIconForecast>`).attr(`src`, `https://openweathermap.org/img/wn/${newData.list[i].weather[0].icon}@2x.png`);

                const forecastTemp = $(`<p>`).text(`Temp: ${newData.list[i].main.temp}° C`);

                const forecastWind = $(`<p>`).text(`Wind: ${newData.list[i].wind.speed} KPH`);

                const forecastHumidity = $(`<p>`).text(`Humidity: ${newData.list[i].main.humidity}%`);

                divCardBody.append(pForecastDatePlus24, forecastIcon, forecastTemp, forecastWind, forecastHumidity);
                divCard.append(divCardBody);
                $(`#forecast`).append(divCard);
            }
        })
        .catch(function (error) {
            console.error('Error during fetch:', error);
        })
}