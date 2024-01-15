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

// let userInputCity = "";
// let queryURL;


$("#search-form").on("submit", function (e) {
    e.preventDefault();


    let userInputCity = $("#search-input").val().trim();

    // URL we need to query the database
    let queryURL = `${apiURL}q=${userInputCity}&appid=${APIKey}`;

    // console.log('query: ', queryURL)



    // This queryURL grabs the coordinates of the specified city to use in the newQueryUrl and then we grab the data from the newQueryUrl. This is beacuse the queryURL system of getting data from the website is deprecated.

    // We then created a Fetch call
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {


            // Added metric parameter to use Celsius Degree

            const newQueryUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&appid=${APIKey}`

            fetch(newQueryUrl)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    console.log(data)

                    function todayWeather() {

                        $(`#today`).empty();
                        // INFO about city, date, icon and current temperature, wind, humidity.
                        const todayCity = $(`<h2>`).text(data.name)
                        const todayDate = dayjs().format(` (D/MM/YYYY)`)
                        const iconWeather = $(`<img>`).attr(`src`, `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
                        // console.log(data.weather[0].icon)
                        $(`#today`).append(todayCity);
                        todayCity.append(todayDate, iconWeather);

                        const todayCityTemp = $(`<div class = temp>`).text(`Temp: ${data.main.temp}° C`)
                        const todayCityWind = $(`<div class = wind>`).text(`Wind: ${data.wind.speed} KPH`)
                        const todayCityHumidity = $(`<div class = humidity>`).text(`Humidity: ${data.main.humidity}%`)
                        $(`#today`).append(todayCityTemp, todayCityWind, todayCityHumidity);
                    }
                    todayWeather()

                    // citiesNames.push(userInputCity)

                    // renderButton();

                })

                .catch(function (error) {
                    console.error('Error during fetch:', error);
                })

            console.log('query: ', newQueryUrl)

            
            function forecast() {
                $(`#forecast`).empty();

                const fiveDaysQueryUrl = `https://api.openweathermap.org/data/2.5/forecast/?lat=${data.coord.lat}&lon=${data.coord.lon}&units=metric&cnt=40&appid=${APIKey}`


                fetch(fiveDaysQueryUrl)
                    .then(function (response) {
                        return response.json()
                    })
                    .then(function (newData) {
                        console.log(newData)

                        let forecastDatePlus24 = dayjs().add(1, `day`);

                        for (let i = 7; i < newData.list.length; i += 8) {
                            const divCard = $(`<div class = card>`);
                            const divCardBody = $(`<div class="card-body">`);
                            
                            const pForecastDatePlus24 = $(`<h5>`).text(forecastDatePlus24.format(`D/MM/YYYY`));
                            
                            forecastDatePlus24 = forecastDatePlus24.add(1, `day`);

                            const forecastIcon = $(`<img>`).attr(`src`, `https://openweathermap.org/img/wn/${newData.list[i].weather[0].icon}@2x.png`);
                            
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

            forecast()

        })

        .catch(function (error) {
            console.error('Error during fetch:', error);
        });

})





// function renderButton() {

//     $("#history").empty();

//     $.each(citiesNames, function (i, userInput) {
//         const createButton = $("<button>").text(`${data.name}`)
//         $(`#history`).append(createButton)
//     })

// }